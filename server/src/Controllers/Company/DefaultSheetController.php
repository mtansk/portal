<?php
namespace Mtansk\Cp\Controllers\Company;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Models\Company\DefaultSheetModel;
use Mtansk\Cp\Services\Company\DefaultSheetService;

class DefaultSheetController
{
    private DefaultSheetService $defaultSheetService;

    public function __construct()
    {
        $this->defaultSheetService = new DefaultSheetService();
    }

    public function index()
    {
        $data = $this->defaultSheetService->findAll();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function update(string $id)
    {
        $json = Router::getInstance()->json;
        $sheet = new DefaultSheetModel($json);
        $data = $this->defaultSheetService->update($sheet, $id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function store()
    {
        $data = $this->defaultSheetService->createFromJson();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function delete(string $id)
    {
        $data = $this->defaultSheetService->delete($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }
}