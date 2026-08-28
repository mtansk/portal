<?php
namespace Mtansk\Cp\Controllers\Finance;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Models\Finance\ReductionModel;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Services\Finance\ReductionService;

class ReductionController
{
    private ReductionService $reductionService;

    public function __construct(ReductionService $reductionService)
    {
        $this->reductionService = $reductionService;
    }

    public function index()
    {
        $searchParams = new SearchParams($_GET);
        $data = $this->reductionService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function show($id)
    {
        $data = $this->reductionService->findById($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function update($id)
    {
        $json = Router::getInstance()->json;
        $reduction = new ReductionModel($json);
        $data = $this->reductionService->update($reduction, $id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function store()
    {
        $data = $this->reductionService->createFromJson();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function destroy($id)
    {
        $data = $this->reductionService->delete($id);
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
        $data = $this->reductionService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }
}