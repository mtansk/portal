<?php
namespace Mtansk\Cp\Services\Auth;

use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Helpers\Other\Mailer;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Repositories\Auth\EmailCodeRepository;
use Mtansk\Cp\Services\RateLimiters\CodeLimitService;

class EmailCodeService
{
    private EmailCodeRepository $emailCodeRepository;
    private CodeLimitService $codeLimitService;
    private TokenService $tokenService;


    public function __construct(
        EmailCodeRepository $emailCodeRepository,
        CodeLimitService $codeLimitService,
        TokenService $tokenService
    ) {
        $this->emailCodeRepository = $emailCodeRepository;
        $this->codeLimitService = $codeLimitService;
        $this->tokenService = $tokenService;
    }

    public function sendCode(string $email, string $account_or_reg_id, string $typeOfAction)
    {
        $subjectId = $typeOfAction === "reg" ? $email : $account_or_reg_id;
        $this->codeLimitService->validateRequestRate($subjectId, $typeOfAction);

        $this->sendEmail($email, $account_or_reg_id, $typeOfAction);

        $this->codeLimitService->setRedisIncrement($subjectId, $typeOfAction);
    }


    private function sendEmail(string $email, string $account_or_reg_id, string $typeOfAction)
    {
        $code = Crypto::sixFig();
        //$code = 111111;

        switch ($typeOfAction) {
            case "login":
                $subject = "{$code} - Код для входа в Портал";
                $body = "{$code} - ваш код для входа в Портал.";
                break;
            case "reg":
                $subject = "{$code} - Код для регистрации в Портале";
                $body = "{$code} - ваш код для регистрации в Портале.";
                break;
            default:
                $res = new Response();
                $res->code = 500;
                $res->error_code = "AUTH-CODE-SEND";
                $res->send();
        }

        $res = $this
            ->emailCodeRepository
            ->create($code, $account_or_reg_id, $typeOfAction, $email);
        $mailerRes = Mailer::send($email, $subject, $body);

        if (!$mailerRes) {
            $res = new Response();
            $res->code = 500;
            $res->error_code = "MAILER-SEND";
            $res->send();
        }
    }


    public function sendRestoredPasswordEmail(string $email, string $password)
    {
        $subject = "Восстановление пароля";
        $body = "Ваш новый пароль: {$password}";

        $mailerRes = Mailer::send($email, $subject, $body);

        if (!$mailerRes) {
            $res = new Response();
            $res->code = 500;
            $res->error_code = "MAILER-SEND";
            $res->send();
        }
    }





    public function validateCode(string $code, string $account_or_reg_id, string $typeOfAction)
    {
        $codeData = $this->emailCodeRepository->findValidCode($code, $account_or_reg_id, $typeOfAction);

        if (!$codeData) {
            $res = new Response();
            $res->code = 401;
            $res->error_code = "AUTH-CODE-INVALID";
            $res->send();
        }

        return $codeData;
    }

    public function refreshCode(array $json)
    {
        $token = $json["token"] ?? "";

        $payload = $this->tokenService->decodeAuthorizationToken($token);
        $regOrAccountId = $payload["sub"];
        $typeOfAction = $payload["type"];
        $email = $payload["email"];

        $this->sendCode($email, $regOrAccountId, $typeOfAction);
    }



}