<?php
namespace Mtansk\Cp\Controllers\Auth;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Services\Auth\EmailCodeService;
use Mtansk\Cp\Services\Auth\LoginService;

class LoginController
{
    private LoginService $loginService;
    private EmailCodeService $emailCodeService;

    public function __construct(
        LoginService $loginService,
        EmailCodeService $emailCodeService
    ) {
        $this->loginService = $loginService;
        $this->emailCodeService = $emailCodeService;
    }

    public function processCredentials()
    {
        $data = $this->loginService->processLoginCredentials();
        $response = new Response();
        $response->data = $data;
        $response->send();
    }
    public function processCode()
    {
        $data = $this->loginService->processLoginCode();
        $response = new Response();
        $response->data = $data;
        $response->send();
    }
    public function processCompanySelection()
    {
        $data = $this->loginService->processLoginCompanySelection();
        $response = new Response();
        $response->data = $data;
        $response->send();
    }
    public function refreshCode()
    {
        $this->loginService->refreshLoginCode();
        $response = new Response();
        $response->send();
    }
    public function processTokenRefresh()
    {
        $data = $this->loginService->processTokenRefresh();
        $response = new Response();
        $response->data = $data;
        $response->send();
    }

    public function refreshEmailCode()
    {
        $json = Router::getInstance()->json;
        $this->emailCodeService->refreshCode($json);
        $response = new Response();
        $response->send();
    }

    public function processMyCompanySelection(string $newUserId)
    {
        $data = $this->loginService->processMyCompanySelection($newUserId);
        $response = new Response();
        $response->data = $data;
        $response->send();
    }


}