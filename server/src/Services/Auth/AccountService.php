<?php
namespace Mtansk\Cp\Services\Auth;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Helpers\Other\Filter;
use Mtansk\Cp\Helpers\DB\PDOConnection;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Models\Auth\AccountUpdateModel;
use Mtansk\Cp\Repositories\Auth\TokenRepository;
use Mtansk\Cp\Repositories\Auth\AccountRepository;
use Mtansk\Cp\Services\RateLimiters\CodeLimitService;

class AccountService
{
    private AccountRepository $accountRepository;
    private LoginService $loginService;
    private AuthPayloadService $authPayloadService;
    private TokenRepository $tokenRepository;
    private EmailCodeService $emailCodeService;
    private CodeLimitService $codeLimitService;

    public function __construct(
        AccountRepository $accountRepository,
        LoginService $loginService,
        AuthPayloadService $authPayloadService,
        TokenRepository $tokenRepository,
        EmailCodeService $emailCodeService,
        CodeLimitService $codeLimitService
    ) {
        $this->accountRepository = $accountRepository;
        $this->loginService = $loginService;
        $this->authPayloadService = $authPayloadService;
        $this->tokenRepository = $tokenRepository;
        $this->emailCodeService = $emailCodeService;
        $this->codeLimitService = $codeLimitService;
    }


    public function findMy()
    {
        return $this->accountRepository->findMy();
    }

    public function updateMy(array $inputAccount, string $account_id)
    {
        $accountModel = new AccountUpdateModel($inputAccount);
        $res = $this->accountRepository->updateMy($accountModel, $account_id);
        return $res;
    }

    public function updateMyPassword(array $json)
    {
        PDOConnection::beginTransaction();
        $user = Router::getInstance()->user;
        $account_id = $user["account_id"];

        $account = $this->accountRepository->findById($account_id);
        $res = $this->loginService->validateHash($json["currentPassword"], $account);
        if (!$res) {
            $response = new Response();
            $response->code = 422;
            $response->error_code = "AUTH-PASSWORD-INVALID";
            $response->send();
        }

        $filter = new Filter($json);
        $password = $filter->validate("password", "password");

        $updateRes = $this->updatePassword($password, $account_id);
        if (!$updateRes) {
            $response = new Response();
            $response->code = 500;
            $response->error_code = "AUTH-PASSWORD-UPDATE";
            $response->send();
        }

        $this->tokenRepository->deleteExistingRefreshTokens($user["user_id"]);
        $authPayload = $this->authPayloadService->getAuthorizationPayload($user["user_id"]);

        PDOConnection::commit();

        return [$authPayload];
    }

    public function restorePassword()
    {
        PDOConnection::beginTransaction();



        $json = Router::getInstance()->json;
        $email = $json["email"] ?? null;
        $firstName = $json["first_name"] ?? null;

        $account = $this->accountRepository->findByEmail($email);
        if (!$account) {
            $response = new Response();
            $response->error_code = "AUTH-RESTORE-INVALID2";
            $response->send();
        }

        $this->codeLimitService->setAndCheckRestoreIncrement($email);

        if ($account["first_name"] !== $firstName) {
            $response = new Response();
            $response->error_code = "AUTH-RESTORE-INVALID1";
            $response->send();
        }

        $newPassword = Crypto::tempPassword();
        $res = $this->updatePassword($newPassword, $account["account_id"]);
        if (!$res) {
            $response = new Response();
            $response->code = 500;
            $response->error_code = "AUTH-PASSWORD-UPDATE";
            $response->send();
        }

        $this->emailCodeService->sendRestoredPasswordEmail($email, $newPassword);
        PDOConnection::commit();
    }

    public function updatePassword(string $password, string $account_id)
    {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $res = $this->accountRepository->updatePassword($hash, $account_id);
        return $res;
    }


}