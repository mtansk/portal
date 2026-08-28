<?php
namespace Mtansk\Cp\Services\Auth;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Helpers\DB\PDOConnection;
use Mtansk\Cp\Models\Auth\UserRegModel;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Services\Auth\TokenService;
use Mtansk\Cp\Services\Access\InviteService;
use Mtansk\Cp\Repositories\Auth\AccountRepository;
use Mtansk\Cp\Repositories\Auth\UserRegRepository;
use Mtansk\Cp\Repositories\Users\UserRepository;
use Mtansk\Cp\Services\Access\SubscriptionService;

class UserRegService
{
    private UserRegRepository $userRegRepository;
    private InviteService $inviteService;
    private AccountRepository $accountRepository;
    private TokenService $tokenService;
    private EmailCodeService $emailCodeService;
    private SubscriptionService $subscriptionService;
    private AccessStateService $accessStateService;
    private AuthPayloadService $authPayloadService;
    private UserRepository $userRepository;

    public function __construct(
        UserRegRepository $userRegRepository,
        InviteService $inviteService,
        AccountRepository $accountRepository,
        TokenService $tokenService,
        EmailCodeService $emailCodeService,
        SubscriptionService $subscriptionService,
        AccessStateService $accessStateService,
        AuthPayloadService $authPayloadService,
        UserRepository $userRepository
    ) {
        $this->userRegRepository = $userRegRepository;
        $this->inviteService = $inviteService;
        $this->accountRepository = $accountRepository;
        $this->tokenService = $tokenService;
        $this->emailCodeService = $emailCodeService;
        $this->subscriptionService = $subscriptionService;
        $this->accessStateService = $accessStateService;
        $this->authPayloadService = $authPayloadService;
        $this->userRepository = $userRepository;
    }

    public function processCredentials(array $json)
    {
        PDOConnection::beginTransaction();

        $inviteCode = isset($json["invite_code"]) ? \trim($json["invite_code"]) : null;
        $firstName = isset($json["first_name"]) ? \trim($json["first_name"]) : null;

        $invite = $this->inviteService->findByCodeAndFirstName($inviteCode, $firstName);
        if (!$invite) {
            $response = new Response();
            $response->code = 422;
            $response->error_code = "AUTH-REG-INVITE-INVALID";
            $response->send();
        }

        $email = $json["email"] ?? null;
        $existingAccount = $this->accountRepository->findByEmail($email);
        if ($existingAccount) {
            $response = new Response();
            $response->code = 422;
            $response->error_code = "AUTH-REG-EMAIL-EXISTS";
            $response->send();
        }

        $regId = Crypto::UUID4();
        $storeRes = $this->storeRegInfo($json, $regId, $invite["invite_id"], $invite["company_id"], $invite["user_id"]);
        if (!$storeRes) {
            $response = new Response();
            $response->code = 500;
            $response->error_code = "AUTH-REG-OTHER";
            $response->send();
        }

        $token = $this->tokenService->generateUniversalAuthToken($regId, "reg", $email);
        $this->emailCodeService->sendCode($email, $regId, "reg");

        $data = [
            [
                "token" => $token
            ]
        ];
        PDOConnection::commit();
        return $data;

    }

    private function storeRegInfo(array $json, string $regId, string $invite_id, string $company_id, string $user_id)
    {
        $model = new UserRegModel($json);

        $hash = password_hash($model->password, PASSWORD_DEFAULT);
        $rows = [
            [
                'reg_id' => $regId,
                'invite_id' => $invite_id,
                'first_name' => $model->first_name,
                'email' => $model->email,
                'password' => $hash,
                "user_id" => $user_id,
                'company_id' => $company_id
            ]
        ];

        $res = $this->userRegRepository->create($rows);
        return $res;
    }

    public function processCode(array $json)
    {
        PDOConnection::beginTransaction();

        $token = $json["token"] ?? "";
        $payload = $this->tokenService->decodeAuthorizationToken($token);

        $code = $json["code"] ?? "";
        $this->emailCodeService->validateCode($code, $payload["sub"], "reg");

        $regInfo = $this->userRegRepository->findById($payload["sub"]);
        if (!$regInfo) {
            $response = new Response();
            $response->code = 422;
            $response->error_code = "AUTH-REG-ID";
            $response->send();
        }


        $account_id = Crypto::UUID4();
        $this->createAccount($regInfo, $account_id);

        $payload = $this->connectAccountToUser($regInfo["user_id"], $account_id);

        return $payload;
    }


    public function processMyEntryByCode()
    {
        $user = Router::getInstance()->user;
        $json = Router::getInstance()->json;

        $inviteCode = isset($json["invite_code"]) ? \trim($json["invite_code"]) : null;
        $firstName = isset($json["first_name"]) ? \trim($json["first_name"]) : null;

        $invite = $this->inviteService->findByCodeAndFirstName($inviteCode, $firstName);
        if (!$invite) {
            $response = new Response();
            $response->code = 422;
            $response->error_code = "AUTH-REG-INVITE-INVALID";
            $response->send();
        }
        $this->checkAccountLimit($user["account_id"]);

        $payload = $this->connectAccountToUser($invite["user_id"], $user["account_id"]);
        return $payload;
    }


    public function connectAccountToUser(string $userId, string $accountId)
    {
        $activationRes = $this->userRepository->activateUser($userId, $accountId);
        if (!$activationRes) {
            $response = new Response();
            $response->code = 500;
            $response->error_code = "AUTH-REG-ACCOUNT";
            $response->send();
        }

        $this->inviteService->deleteAllUserInvites($userId);

        $authPayload = $this->authPayloadService->getAuthorizationPayload($userId);
        PDOConnection::commit();

        return [$authPayload];
    }

    public function createAccount(array $regInfo, string $account_id)
    {
        $rows = [
            [
                $account_id,
                "username",
                $regInfo["password"],
                time(),
                $regInfo["first_name"],
                $regInfo["email"],
                NULL
            ]
        ];

        $res = $this->accountRepository->create($rows);
        if (!$res) {
            $response = new Response();
            $response->code = 500;
            $response->error_code = "AUTH-REG-ACCOUNT";
            $response->send();
        }
    }


    private function checkAccountLimit(string $accountId)
    {
        $existingUsers = $this->userRepository->findAllByAccountIdForSelection($accountId);
        if (count($existingUsers) >= 50) {
            $response = new Response();
            $response->code = 422;
            $response->error_code = "AUTH-REG-USER-LIMIT";
            $response->send();
        }
    }
}
