<?php
namespace Mtansk\Cp\Repositories\Finance;

use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;

class TaxDeductionRepository
{

    public function __construct()
    {
    }

    public function findAll(?SearchParams $searchParams = null)
    {
        $user = Router::getInstance()->user;

        $fo = GETQueryNew::addFoFields("tax_deduction");
        $qty = GETQueryNew::trim("tax_deduction_qty", "tax_deductions");
        $rate = GETQueryNew::trim("tax_deduction_rate", "tax_deductions");

        $sql = "SELECT
    
        tax_deductions.tax_deduction_id,
        tax_deductions.tax_deduction_name,
        {$rate},
        {$qty},
        tax_deductions.tax_deduction_total,
        tax_deductions.is_round,
        tax_deductions.payslip_id,
        tax_deductions.created_at,
        tax_deductions.deleted_at,
        tax_deductions.company_id,
    
        {$fo},

        payslips.payslip_date,
        payslips.user_id,

        users.first_name,
        users.last_name,
        users.middle_name
    
        FROM tax_deductions 

                LEFT JOIN payslips ON payslips.payslip_id = tax_deductions.payslip_id
                LEFT JOIN users ON users.user_id = payslips.user_id

        WHERE tax_deductions.company_id = :company_id ";


        $bindings = [
            ":company_id" => $user["company_id"]
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "payslips", "tax_deduction");
        $get->searchParams = $searchParams;
        $data = $get->execute();
        return $data;
    }


    public function findByPayslipId(string $payslip_id)
    {
        $user = Router::getInstance()->user;

        $fo = GETQueryNew::addFoFields("tax_deduction");
        $qty = GETQueryNew::trim("tax_deduction_qty", "tax_deductions");
        $rate = GETQueryNew::trim("tax_deduction_rate", "tax_deductions");

        $sql = "SELECT
    
        tax_deductions.tax_deduction_id,
        tax_deductions.tax_deduction_name,
        {$rate},
        {$qty},
        tax_deductions.tax_deduction_total,
        tax_deductions.is_round,
        tax_deductions.payslip_id,
        tax_deductions.created_at,
        tax_deductions.deleted_at,
        tax_deductions.company_id,
    
        {$fo}
    
        FROM tax_deductions 
        WHERE company_id = :company_id
        AND payslip_id = :payslip_id
        AND deleted_at IS NULL";


        $bindings = [
            ":company_id" => $user["company_id"],
            ":payslip_id" => $payslip_id
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "tax_deductions", "tax_deduction");
        $data = $get->execute();
        return $data;
    }


    public function create(array $rows)
    {
        $sql = "INSERT INTO tax_deductions 

        (tax_deduction_id, 
        tax_deduction_name, 
        tax_deduction_rate, 
        tax_deduction_qty, 
        is_round, 
        payslip_id, 
        company_id) 
    
        VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }

}