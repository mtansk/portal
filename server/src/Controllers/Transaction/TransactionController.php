<?php
namespace Mtansk\Cp\Controllers\Transaction;

use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Services\Transaction\TransactionService;

class TransactionController
{
    private TransactionService $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    public function initialize()
    {
        $json = Router::getInstance()->json;
        $data = $this->transactionService->initializePayment($json);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function check()
    {
        $json = Router::getInstance()->json;
        $data = $this->transactionService->checkPayment($json);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function findPending()
    {
        $data = $this->transactionService->findPending();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

}