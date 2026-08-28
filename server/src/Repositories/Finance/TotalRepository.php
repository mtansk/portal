<?php
namespace Mtansk\Cp\Repositories\Finance;

use Mtansk\Cp\Helpers\DB\GETTotalQueryNew;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Routes\Router;

class TotalRepository
{

    public function __construct()
    {
    }


    public function getAccrualsTotals(SearchParams $searchParams, string $basis)
    {
        $user = Router::getInstance()->user;
        $bindings = [
            ":company_id" => $user["company_id"],
        ];
        $get = new GETTotalQueryNew($bindings, "accrual", $searchParams, $basis);
        $data = $get->execute();
        return $data;
    }

    public function getSheetsTotals(SearchParams $searchParams, string $basis)
    {
        $user = Router::getInstance()->user;
        $bindings = [
            ":company_id" => $user["company_id"],
        ];
        $get = new GETTotalQueryNew($bindings, "sheet", $searchParams, $basis);
        $data = $get->execute();
        return $data;
    }

    public function getReductionsTotals(SearchParams $searchParams, string $basis)
    {
        $user = Router::getInstance()->user;
        $bindings = [
            ":company_id" => $user["company_id"],
        ];
        $get = new GETTotalQueryNew($bindings, "reduction", $searchParams, $basis);
        $data = $get->execute();
        return $data;
    }

    public function getPaymentsTotals(SearchParams $searchParams, string $basis)
    {
        $user = Router::getInstance()->user;
        $bindings = [
            ":company_id" => $user["company_id"],
        ];
        $get = new GETTotalQueryNew($bindings, "payment", $searchParams, $basis);
        $data = $get->execute();
        return $data;
    }







}