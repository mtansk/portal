<?php
namespace Mtansk\Cp\Controllers\Company;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Models\Company\AccrualGroupModel;
use Mtansk\Cp\Services\Company\AccrualGroupService;

class AccrualGroupController
{
    private AccrualGroupService $accrualGroupService;

    public function __construct(AccrualGroupService $accrualGroupService)
    {
        $this->accrualGroupService = $accrualGroupService;
    }

    public function index()
    {
        $data = $this->accrualGroupService->findAll();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function update(string $id)
    {
        $json = Router::getInstance()->json;
        $rate = new AccrualGroupModel($json);
        $data = $this->accrualGroupService->update($rate, $id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function store()
    {
        $data = $this->accrualGroupService->createFromJson();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }
}