<?php
namespace Mtansk\Cp\Services\Auth;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\DB\PDOConnection;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Repositories\Users\UserRepository;
use Mtansk\Cp\Repositories\Auth\AccountRepository;

class LoginService
{
    private AccountRepository $accountRepository;
    private TokenService $tokenService;
    private EmailCodeService $emailCodeService;
    private UserRepository $userRepository;
    private AuthPayloadService $authPayloadService;


    public function __construct(
        AccountRepository $accountRepository,
        TokenService $tokenService,
        EmailCodeService $emailCodeService,
        UserRepository $userRepository,
        AuthPayloadService $authPayloadService
    ) {
        $this->accountRepository = $accountRepository;
        $this->tokenService = $tokenService;
        $this->emailCodeService = $emailCodeService;
        $this->userRepository = $userRepository;
        $this->authPayloadService = $authPayloadService;
    }

    public function processLoginCredentials()
    {
        PDOConnection::beginTransaction();

        $json = Router::getInstance()->json;

        $email = $json["username"] ?? "";
        $account = $this->accountRepository->findByEmail($email);
        if (!$account) {
            $this->sendCredentialsError();
        }

        $password = $json["password"] ?? "";
        $hashRes = $this->validateHash($password, $account);
        if (!$hashRes) {
            $this->sendCredentialsError();
        }


        $token = $this
            ->tokenService
            ->generateUniversalAuthToken($account["account_id"], "login", $account["account_email"]);

        // $this->emailCodeService->sendCode($account["account_email"], $account["account_id"], "login");
        $accountUsers = $this
            ->userRepository
            ->findAllByAccountIdForSelection($account["account_id"]);

        PDOConnection::commit();

        return [
            [
                "token" => $token,
                "companies" => $accountUsers
            ]
        ];

    }
    public function processLoginCode()
    {
        $pdo = PDOConnection::getInstance()->getConnection();
        $pdo->beginTransaction();
        $json = Router::getInstance()->json;

        $token = $json["token"] ?? null;
        $payload = $this->tokenService->decodeAuthorizationToken($token);
        $accountId = $payload["sub"];

        $code = $json["code"] ?? "";

        $this->emailCodeService->validateCode($code, $accountId, "login");

        $accountUsers = $this
            ->userRepository
            ->findAllByAccountIdForSelection($accountId);
        $newToken = $this
            ->tokenService
            ->generateUniversalAuthToken($accountId, "login", $payload["email"]);

        PDOConnection::commit();

        return [
            [
                "token" => $newToken,
                "companies" => $accountUsers
            ]
        ];
    }
    public function refreshLoginCode()
    {
        $pdo = PDOConnection::getInstance()->getConnection();
        $pdo->beginTransaction();

        $json = Router::getInstance()->json;
        $token = $json["token"] ?? null;

        if ($token === null) {
            $response = new Response();
            $response->code = 401;
            $response->error_code = "AUTH-LOGIN-TOKEN-EXPIRED";
            $response->send();
        }

        $payload = $this->tokenService->decodeAuthorizationToken($token);
        $this->emailCodeService->sendCode($payload["email"], $payload["account_id"], "login");

        PDOConnection::commit();
    }
    public function processLoginCompanySelection()
    {
        PDOConnection::beginTransaction();

        $json = Router::getInstance()->json;
        $token = $json["token"] ?? null;
        $user_id = $json["user_id"] ?? null;

        $payload = $this->tokenService->decodeAuthorizationToken($token);
        $accountId = $payload["sub"];
        $payload = $this->validateUserSwitchAndSendPayload($accountId, $user_id);
        PDOConnection::commit();
        return $payload;
    }
    public function processMyCompanySelection(string $newUserId)
    {
        $user = Router::getInstance()->user;
        $accountId = $user["account_id"];

        $json = Router::getInstance()->json;
        $token = $json["token"] ?? null;
        $this->tokenService->validateAndPurgeRefreshToken($token);

        $payload = $this->validateUserSwitchAndSendPayload($accountId, $newUserId);
        return $payload;
    }

    public function validateUserSwitchAndSendPayload(string $accountId, string $userId)
    {
        PDOConnection::beginTransaction();

        $user = $this->userRepository->findById($userId);
        if (!$user) {
            $response = new Response();
            $response->code = 422;
            $response->error_code = "AUTH-LOGIN-USER";
            $response->send();
        }

        if ($user["account_id"] !== $accountId) {
            $response = new Response();
            $response->code = 422;
            $response->error_code = "AUTH-LOGIN-USER";
            $response->send();
        }

        $payload = $this->authPayloadService->getAuthorizationPayload($userId);
        PDOConnection::commit();
        return [$payload];
    }
    public function processTokenRefresh()
    {
        PDOConnection::beginTransaction();

        $json = Router::getInstance()->json;

        $token = $json["token"] ?? null;
        $payload = $this->tokenService->validateAndPurgeRefreshToken($token);
        $userId = $payload["user_id"];

        $authPayload = $this->authPayloadService->getAuthorizationPayload($userId);

        PDOConnection::commit();
        return [$authPayload];
    }




    //

    public function validateHash(string $password, array $account)
    {

        $hash = $account["password"];
        $res = password_verify($password, $hash);

        if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
            $newHash = password_hash($password, PASSWORD_DEFAULT);
            $rehashRes = $this->accountRepository->updatePassword($newHash, $account["account_id"]);

            if (!$rehashRes) {
                $response = new Response();
                $response->code = 500;
                $response->error_code = "AUTH-PASSWORD-REHASH";
                $response->send();
            }
        }

        return $res;
    }
    private function sendCredentialsError()
    {
        $response = new Response();
        $response->code = 401;
        $response->error_code = "AUTH-LOGIN-CREDENTIALS";
        $response->send();
    }






}