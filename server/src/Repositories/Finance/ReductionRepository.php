<?php
namespace Mtansk\Cp\Repositories\Finance;

use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Models\Finance\ReductionModel;
use Mtansk\Cp\Routes\Router;

class ReductionRepository
{

    public function __construct()
    {

    }
    public function findAll(?SearchParams $searchParams = null)
    {
        $user = Router::getInstance()->user;

        $efo = GETQueryNew::addEFOFields("reduction");
        $joins = GETQueryNew::userJoins("reductions");
        $now = GETQueryNew::addNow();
        $joinFields = GETQueryNew::userJoinsFields();
        $rate = GETQueryNew::trim("reduction_rate", "reductions", );
        $qty = GETQueryNew::trim("reduction_qty", "reductions", );


        $sql = "SELECT 
                reductions.reduction_id,
                reductions.reduction_date,
                reductions.reduction_name,
                {$rate},
                {$qty},
                reductions.reduction_total,
                reductions.reduction_desc,
                reductions.debt_id,
                reductions.user_id,
                reductions.payslip_id,
                reductions.created_at,
                reductions.deleted_at,
                reductions.company_id,

                debts.debt_name,
                debts.debt_total,
                debts.debt_desc,
                debts.debt_date,
                debts.is_settled,

                {$efo},
                {$now},
                {$joinFields}

                FROM reductions 
                {$joins}
                LEFT JOIN debts ON reductions.debt_id=debts.debt_id
                WHERE reductions.company_id=:company_id ";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        if (isset($_GET["debt_id"])) {
            $sql .= " AND reductions.debt_id=:debt_id";
            $bindings[":debt_id"] = $_GET["debt_id"];
        }

        $get = new GETQueryNew($sql, $bindings, "main", "reductions", "reduction");
        $get->searchParams = $searchParams;
        $res = $get->execute();

        return $res;
    }
    public function findById(string $id)
    {
        $user = Router::getInstance()->user;

        $efo = GETQueryNew::addEFOFields("reduction");
        $joins = GETQueryNew::userJoins("reductions");
        $now = GETQueryNew::addNow();
        $joinFields = GETQueryNew::userJoinsFields();
        $rate = GETQueryNew::trim("reduction_rate", "reductions", );
        $qty = GETQueryNew::trim("reduction_qty", "reductions", );


        $sql = "SELECT 
                reductions.reduction_id,
                reductions.reduction_date,
                reductions.reduction_name,
                {$rate},
                {$qty},
                reductions.reduction_total,
                reductions.reduction_desc,
                reductions.debt_id,
                reductions.user_id,
                reductions.payslip_id,
                reductions.created_at,
                reductions.deleted_at,
                reductions.company_id,

                debts.debt_name,
                debts.debt_total,
                debts.debt_desc,
                debts.debt_date,
                debts.is_settled,

                {$efo},
                {$now},
                {$joinFields}

                FROM reductions 
                {$joins}
                LEFT JOIN debts ON reductions.debt_id=debts.debt_id
                WHERE reductions.company_id=:company_id
                AND reductions.reduction_id=:reduction_id 
                AND reductions.deleted_at IS NULL ";

        $bindings = [
            ":company_id" => $user["company_id"],
            ":reduction_id" => $id,
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "reductions", "reduction");
        $res = $get->execute();

        return $res;
    }

    public function update(ReductionModel $reduction, string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "UPDATE reductions 

                SET reduction_date = :reduction_date,
                reduction_name = :reduction_name,
                reduction_rate = :reduction_rate,
                reduction_qty = :reduction_qty,
                reduction_desc = :reduction_desc,
                debt_id = :debt_id,
                user_id = :user_id,
                payslip_id = :payslip_id	
                					
                WHERE reduction_id = :reduction_id
                AND company_id = :company_id";

        $bindings = [
            ":reduction_id" => $id,
            ":reduction_date" => $reduction->reduction_date,
            ":reduction_name" => $reduction->reduction_name,
            ":reduction_rate" => $reduction->reduction_rate,
            ":reduction_qty" => $reduction->reduction_qty,
            ":reduction_desc" => $reduction->reduction_desc,
            ":debt_id" => $reduction->debt_id,
            ":user_id" => $reduction->user_id,
            ":payslip_id" => $reduction->payslip_id,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();
        return $res;
    }

    public function create(array $rows)
    {
        $sql = "INSERT INTO reductions 
			(user_id, 
			reduction_date, 
			reduction_id, 
			reduction_name, 
			reduction_rate, 
			reduction_qty, 
			reduction_desc, 
			debt_id, 
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

        $sql = "UPDATE reductions 
                SET deleted_at = NOW()
                WHERE reduction_id = :reduction_id
                AND company_id = :company_id";


        $bindings = [
            ":reduction_id" => $id,
            ":company_id" => $user["company_id"],
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();
        return $res;
    }









}