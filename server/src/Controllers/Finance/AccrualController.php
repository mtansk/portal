<?php
namespace Mtansk\Cp\Controllers\Finance;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Models\Finance\AccrualModel;
use Mtansk\Cp\Services\Finance\AccrualService;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;

class AccrualController
{

    private AccrualService $accrualService;

    public function __construct(AccrualService $accrualService)
    {
        $this->accrualService = $accrualService;
    }

    public function index()
    {
        $searchParams = new SearchParams($_GET);
        $data = $this->accrualService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function show($id)
    {
        $data = $this->accrualService->findById($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }


    public function update(string $id)
    {
        $json = Router::getInstance()->json;
        $accrual = new AccrualModel($json);
        $data = $this->accrualService->update($accrual, $id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function delete(string $id)
    {
        $data = $this->accrualService->delete($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function store()
    {
        $data = $this->accrualService->createFromJson();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function findMy()
    {
        $user = Router::getInstance()->user;
        $getCopy = $_GET;
        $getCopy["user_id"] = $user["user_id"];
        $searchParams = new SearchParams($getCopy);
        $data = $this->accrualService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }


}