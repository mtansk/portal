<?php
namespace Mtansk\Cp\Repositories\Finance;

use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Models\Finance\PaymentModel;
use Mtansk\Cp\Routes\Router;

class PaymentRepository
{

    public function __construct()
    {
    }

    public function findAll(?SearchParams $searchParams = null)
    {
        $user = Router::getInstance()->user;

        $efo = GETQueryNew::addEFOFields("payment");
        $joins = GETQueryNew::userJoins("payments");
        $now = GETQueryNew::addNow();
        $joinFields = GETQueryNew::userJoinsFields();
        $rate = GETQueryNew::trim("payment_rate", "payments", );
        $qty = GETQueryNew::trim("payment_qty", "payments", );

        $sql = "SELECT
            payments.payment_id,
            payments.payment_date,
            payments.payment_name,
            {$rate},
            {$qty},
            payments.payment_total,
            payments.payment_desc,
            payments.payslip_id,
            payments.user_id,
            payments.created_at,
            payments.deleted_at,
            payments.company_id,

            {$joinFields},

            {$efo},
            {$now}

            FROM payments 
            {$joins}
            WHERE payments.company_id=:company_id ";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "payments", "payment");
        $get->searchParams = $searchParams;
        $get->afterQuery = " ORDER BY payments.payment_date ";
        $data = $get->execute();

        return $data;
    }

    public function findById(string $id)
    {
        $user = Router::getInstance()->user;

        $efo = GETQueryNew::addEFOFields("payment");
        $joins = GETQueryNew::userJoins("payments");
        $now = GETQueryNew::addNow();
        $joinFields = GETQueryNew::userJoinsFields();
        $rate = GETQueryNew::trim("payment_rate", "payments", );
        $qty = GETQueryNew::trim("payment_qty", "payments", );

        $sql = "SELECT
            payments.payment_id,
            payments.payment_date,
            payments.payment_name,
            {$rate},
            {$qty},
            payments.payment_total,
            payments.payment_desc,
            payments.payslip_id,
            payments.user_id,
            payments.created_at,
            payments.deleted_at,
            payments.company_id,

            {$joinFields},

            {$efo},
            {$now}

            FROM payments 
            {$joins}
            WHERE payments.company_id=:company_id 
            AND payments.payment_id=:payment_id
            AND payments.deleted_at IS NULL";

        $bindings = [
            ":company_id" => $user["company_id"],
            ":payment_id" => $id,
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "payments", "payment");
        $data = $get->execute();

        return $data;
    }

    public function update(PaymentModel $payment, string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "UPDATE payments 

 		SET payment_date = :payment_date,
 		payment_name = :payment_name,
 		payment_rate = :payment_rate,
 		payment_qty = :payment_qty,
 		payment_desc = :payment_desc,
 		user_id = :user_id,
 		payslip_id = :payslip_id
        
 		WHERE payment_id = :payment_id
		AND company_id = :company_id";

        $bindings = [
            ":payment_id" => $id,
            ":payment_date" => $payment->payment_date,
            ":payment_name" => $payment->payment_name,
            ":payment_rate" => $payment->payment_rate,
            ":payment_qty" => $payment->payment_qty,
            ":payment_desc" => $payment->payment_desc,
            ":user_id" => $payment->user_id,
            ":payslip_id" => $payment->payslip_id,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();

        return $res;
    }

    public function create(array $rows)
    {
        $sql = "INSERT INTO payments 
            (user_id,
            payment_date,
            payment_id,
            payment_name,
            payment_rate,
            payment_qty,
            payment_desc,
            payslip_id,
            company_id)
        VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }

    public function delete(string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "UPDATE payments

            SET deleted_at = NOW()

            WHERE payment_id = :payment_id
            AND company_id = :company_id";

        $bindings = [
            ":payment_id" => $id,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();

        return $res;
    }






}