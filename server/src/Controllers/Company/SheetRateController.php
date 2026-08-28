<?php
namespace Mtansk\Cp\Controllers\Company;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Models\Company\SheetRateModel;
use Mtansk\Cp\Services\Company\SheetRateService;

class SheetRateController
{

    private SheetRateService $sheetRateService;

    public function __construct()
    {
        $this->sheetRateService = new SheetRateService();
    }

    public function index()
    {
        $data = $this->sheetRateService->findAll();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function store()
    {
        $data = $this->sheetRateService->createFromJson();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function update(string $id)
    {
        $json = Router::getInstance()->json;
        $rate = new SheetRateModel($json);
        $data = $this->sheetRateService->update($rate, $id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function delete(string $id)
    {
        $data = $this->sheetRateService->delete($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

}