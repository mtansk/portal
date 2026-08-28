<?php

namespace Mtansk\Cp\Controllers\Company;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Models\Company\DepartmentModel;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Services\Company\DepartmentsService;

class DepartmentController
{
    private DepartmentsService $departmentsService;

    public function __construct(DepartmentsService $departmentsService)
    {
        $this->departmentsService = $departmentsService;
    }

    public function index(?SearchParams $searchParams = null)
    {
        $data = ($this->departmentsService->findAll($searchParams));
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function store()
    {
        $data = $this->departmentsService->createFromJson();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function update(string $id)
    {
        $json = Router::getInstance()->json;
        $dept = new DepartmentModel($json);
        $data = $this->departmentsService->update($dept, $id);
        $response = new Response();
        $response->data = $data;
        $response->send();
    }

    public function findMy()
    {
        $data = $this->departmentsService->findMy();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }
}