<?php
namespace Mtansk\Cp\Controllers\Finance;

use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Services\Finance\TotalService;

class TotalController
{

    private TotalService $totalService;

    public function __construct()
    {
        $this->totalService = new TotalService();
    }

    public function getAccrualTotals()
    {
        $searchParams = new SearchParams($_GET);
        $basis = $_GET['basis'] ?? 'monthly';
        $data = $this->totalService->getAccrualTotals($searchParams, $basis);
        $response = new Response();
        $response->data = $data;
        $response->send();
    }

    public function getReductionTotals()
    {
        $searchParams = new SearchParams($_GET);
        $basis = $_GET['basis'] ?? 'monthly';
        $data = $this->totalService->getReductionTotals($searchParams, $basis);
        $response = new Response();
        $response->data = $data;
        $response->send();
    }

    public function getPaymentTotals()
    {
        $searchParams = new SearchParams($_GET);
        $basis = $_GET['basis'] ?? 'monthly';
        $data = $this->totalService->getPaymentTotals($searchParams, $basis);
        $response = new Response();
        $response->data = $data;
        $response->send();
    }


}