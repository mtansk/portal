<?php
namespace Mtansk\Cp\Controllers\Auth;

use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Services\Auth\AccountService;

class AccountController
{
    private AccountService $accountService;

    public function __construct(AccountService $accountService)
    {
        $this->accountService = $accountService;
    }

    public function findMy()
    {
        $data = $this->accountService->findMy();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function updateMy()
    {
        $user = Router::getInstance()->user;
        $json = Router::getInstance()->json;
        $resData = $this->accountService->updateMy($json, $user["account_id"]);
        $data = [
            [
                "id" => $user["account_id"],
                "count" => $resData
            ]
        ];
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function updateMyPassword()
    {
        $json = Router::getInstance()->json;
        $resData = $this->accountService->updateMyPassword($json);
        $response = new Response();
        $response->data = $resData;
        $response->send();
    }

    public function restorePassword()
    {
        $this->accountService->restorePassword();
        $response = new Response();
        $response->send();
    }
}