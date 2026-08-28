<?php
namespace Mtansk\Cp\Controllers\Finance;

use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Models\Finance\DebtModel;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Services\Finance\DebtService;

class DebtController
{
    private DebtService $debtService;

    public function __construct(DebtService $debtService)
    {
        $this->debtService = $debtService;
    }

    public function index()
    {
        $searchParams = new SearchParams($_GET);
        $data = $this->debtService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function show($id)
    {
        $data = $this->debtService->findById($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function update($id)
    {
        $json = Router::getInstance()->json;
        $debtModel = new DebtModel($json);
        $data = $this->debtService->update($debtModel, $id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function store()
    {
        $data = $this->debtService->createFromJson();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function destroy($id)
    {
        $data = $this->debtService->delete($id);
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
        $data = $this->debtService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function showMy($id)
    {
        $user = Router::getInstance()->user;
        $getCopy = $_GET;
        $getCopy["user_id"] = $user["user_id"];
        $searchParams = new SearchParams($getCopy);
        $data = $this->debtService->findById($id, $searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }
}