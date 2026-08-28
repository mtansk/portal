<?php
namespace Mtansk\Cp\Controllers\Auth;

use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Services\Auth\UserRegService;

class UserRegController
{
    private UserRegService $userRegService;

    public function __construct(UserRegService $userRegService)
    {
        $this->userRegService = $userRegService;
    }

    public function processCredentials()
    {
        $json = Router::getInstance()->json;
        $data = $this->userRegService->processCredentials($json);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function processCode()
    {
        $json = Router::getInstance()->json;
        $data = $this->userRegService->processCode($json);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function processMyEntryByCode()
    {
        $data = $this->userRegService->processMyEntryByCode();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }



}