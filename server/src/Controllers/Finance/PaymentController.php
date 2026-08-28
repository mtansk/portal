<?php
namespace Mtansk\Cp\Controllers\Finance;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Models\Finance\PaymentModel;
use Mtansk\Cp\Services\Finance\PaymentService;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;

class PaymentController
{

    private PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function index()
    {
        $searchParams = new SearchParams($_GET);
        $data = $this->paymentService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function show($id)
    {
        $data = $this->paymentService->find($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function update($id)
    {
        $json = Router::getInstance()->json;
        $payment = new PaymentModel($json);
        $data = $this->paymentService->update($payment, $id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function delete($id)
    {
        $data = $this->paymentService->delete($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function store()
    {
        $data = $this->paymentService->createFromJson();
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
        $data = $this->paymentService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }



}