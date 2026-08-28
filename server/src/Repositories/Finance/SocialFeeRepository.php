<?php
namespace Mtansk\Cp\Repositories\Finance;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;

class SocialFeeRepository
{

    public function __construct()
    {
    }

    public function findAll(?SearchParams $searchParams = null)
    {
        $user = Router::getInstance()->user;

        $fo = GETQueryNew::addFoFields("social_fee");
        $qty = GETQueryNew::trim("social_fee_qty", "social_fees");
        $rate = GETQueryNew::trim("social_fee_rate", "social_fees");

        $sql = "SELECT

            social_fees.social_fee_id,
            social_fees.social_fee_name,
            {$rate},
            {$qty},
            social_fees.social_fee_total,
            social_fees.is_round,
            social_fees.payslip_id,
            social_fees.created_at,
            social_fees.deleted_at,
            social_fees.company_id,
               
            {$fo},

            payslips.payslip_date,
            payslips.user_id,

            users.first_name,
            users.last_name,
            users.middle_name
               
            FROM social_fees 

                LEFT JOIN payslips ON payslips.payslip_id = social_fees.payslip_id
                LEFT JOIN users ON users.user_id = payslips.user_id

            WHERE social_fees.company_id = :company_id ";

        $bindings = [
            ":company_id" => $user["company_id"]
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "payslips", "social_fee");
        $get->searchParams = $searchParams;
        $data = $get->execute();
        return $data;
    }


    public function findByPayslipId(string $payslip_id)
    {
        $user = Router::getInstance()->user;

        $fo = GETQueryNew::addFoFields("social_fee");
        $qty = GETQueryNew::trim("social_fee_qty", "social_fees");
        $rate = GETQueryNew::trim("social_fee_rate", "social_fees");

        $sql = "SELECT

            social_fees.social_fee_id,
            social_fees.social_fee_name,
            {$rate},
            {$qty},
            social_fees.social_fee_total,
            social_fees.is_round,
            social_fees.payslip_id,
            social_fees.created_at,
            social_fees.deleted_at,
            social_fees.company_id,
               
            {$fo}
               
            FROM social_fees 
            WHERE company_id = :company_id
            AND payslip_id = :payslip_id
            AND deleted_at IS NULL";

        $bindings = [
            ":company_id" => $user["company_id"],
            ":payslip_id" => $payslip_id
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "social_fees", "social_fee");
        $data = $get->execute();
        return $data;
    }

    public function create(array $rows)
    {
        $sql = "INSERT INTO social_fees 

        (social_fee_id, 
        social_fee_name, 
        social_fee_rate, 
        social_fee_qty, 
        is_round, 
        payslip_id, 
        company_id) 
    
        VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }

}