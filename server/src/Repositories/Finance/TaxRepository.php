<?php
namespace Mtansk\Cp\Repositories\Finance;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;

class TaxRepository
{

    public function __construct()
    {
    }

    public function findAll(?SearchParams $searchParams = null)
    {
        $user = Router::getInstance()->user;

        $fo = GETQueryNew::addFoFields("tax");
        $qty = GETQueryNew::trim("tax_qty", "taxes");
        $rate = GETQueryNew::trim("tax_rate", "taxes");

        $sql = "SELECT

            taxes.tax_id,
            taxes.tax_name,
            {$rate},
            {$qty},
            taxes.tax_total,
            taxes.is_round,
            taxes.payslip_id,
            taxes.created_at,
            taxes.deleted_at,
            taxes.company_id,

            {$fo},

            payslips.payslip_date,
            payslips.user_id,

            users.first_name,
            users.last_name,
            users.middle_name

            FROM taxes 

                LEFT JOIN payslips ON payslips.payslip_id = taxes.payslip_id
                LEFT JOIN users ON users.user_id = payslips.user_id
                
            WHERE taxes.company_id = :company_id ";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "payslips", "tax");
        $get->searchParams = $searchParams;
        $data = $get->execute();
        return $data;
    }


    public function findByPayslipId(string $payslip_id)
    {
        $user = Router::getInstance()->user;

        $fo = GETQueryNew::addFoFields("tax");
        $qty = GETQueryNew::trim("tax_qty", "taxes");
        $rate = GETQueryNew::trim("tax_rate", "taxes");

        $sql = "SELECT

            taxes.tax_id,
            taxes.tax_name,
            {$rate},
            {$qty},
            taxes.tax_total,
            taxes.is_round,
            taxes.payslip_id,
            taxes.created_at,
            taxes.deleted_at,
            taxes.company_id,

            {$fo}

            FROM taxes 
            WHERE company_id = :company_id 
            AND payslip_id = :payslip_id
            AND deleted_at IS NULL";

        $bindings = [
            ":company_id" => $user["company_id"],
            ":payslip_id" => $payslip_id
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "taxes", "tax");
        $data = $get->execute();
        return $data;
    }

    public function create(array $rows)
    {
        $sql = "INSERT INTO taxes 

        (tax_id, 
        tax_name, 
        tax_rate, 
        tax_qty, 
        is_round, 
        payslip_id, 
        company_id) 
    
        VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }


}