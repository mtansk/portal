<?php
namespace Mtansk\Cp\Controllers\Sheets;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Models\Sheets\SheetModel;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Services\Sheets\SheetService;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;

class SheetController
{

    private SheetService $sheetService;

    public function __construct(SheetService $sheetService)
    {
        $this->sheetService = $sheetService;
    }

    public function index()
    {
        $searchParams = new SearchParams($_GET);
        $data = $this->sheetService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function show(string $id)
    {
        $data = $this->sheetService->findById($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function update(string $id)
    {
        $json = Router::getInstance()->json;
        $sheet = new SheetModel($json);
        $data = $this->sheetService->update($sheet, $id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function store()
    {
        $data = $this->sheetService->createFromJson();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function delete(string $id)
    {
        $data = $this->sheetService->delete($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function reservedDates()
    {
        $data = $this->sheetService->getReservedDates();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function findMy()
    {
        $user = Router::getInstance()->user;
        $getCopy = $_GET;
        $getCopy['user_id'] = $user["user_id"];
        $searchParams = new SearchParams($getCopy);
        $data = $this->sheetService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function findMyTeamSheets()
    {
        $searchParams = new SearchParams($_GET);
        $data = $this->sheetService->findMyTeamSheets($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }


}