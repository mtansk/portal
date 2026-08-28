<?php
namespace Mtansk\Cp\Controllers\Company;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Models\Company\GeneralRateModel;
use Mtansk\Cp\Services\Company\GeneralRateService;

class GeneralRateController
{
    private GeneralRateService $generalRateService;

    public function __construct(GeneralRateService $generalRateService)
    {
        $this->generalRateService = $generalRateService;
    }

    public function index()
    {
        $data = $this->generalRateService->findAll();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function update(string $id)
    {
        $json = Router::getInstance()->json;
        $rate = new GeneralRateModel($json);
        $data = $this->generalRateService->update($rate, $id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function delete(string $id)
    {
        $data = $this->generalRateService->delete($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function store()
    {
        $data = $this->generalRateService->createFromJson();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }
}