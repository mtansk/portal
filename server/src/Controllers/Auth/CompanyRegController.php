<?php
namespace Mtansk\Cp\Controllers\Auth;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Services\Auth\CompanyRegService;

class CompanyRegController
{

    private CompanyRegService $companyRegService;

    public function __construct(CompanyRegService $companyRegService)
    {
        $this->companyRegService = $companyRegService;
    }

    public function processRegCredentials()
    {
        $json = Router::getInstance()->json;
        $data = $this->companyRegService->processRegCredentials($json);
        $res = new Response();
        $res->code = 200;
        $res->data = $data;
        $res->send();
    }

    public function processRegCode()
    {
        $json = Router::getInstance()->json;
        $data = $this->companyRegService->processRegCode($json);
        $res = new Response();
        $res->code = 200;
        $res->data = $data;
        $res->send();
    }

    public function createMy()
    {
        $json = Router::getInstance()->json;
        $data = $this->companyRegService->createMyCompany($json);
        $res = new Response();
        $res->code = 201;
        $res->data = $data;
        $res->send();
    }

    public function updateName()
    {
        $json = Router::getInstance()->json;
        $user = Router::getInstance()->user;
        $data = $this->companyRegService->updateName($json, $user["company_id"]);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }


}