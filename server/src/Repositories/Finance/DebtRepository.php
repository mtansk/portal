<?php
namespace Mtansk\Cp\Repositories\Finance;

use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Models\Finance\DebtModel;
use Mtansk\Cp\Routes\Router;

class DebtRepository
{

    public function __construct()
    {
    }

    public function findAll(?SearchParams $searchParams = null)
    {
        $user = Router::getInstance()->user;

        $joins = GETQueryNew::userJoins("debts");
        $now = GETQueryNew::addNow();
        $joinFields = GETQueryNew::userJoinsFields();

        $sql = "SELECT 
            debts.debt_id,
            debts.debt_date,
            debts.debt_name,
            debts.debt_total,
            debts.is_settled,
            debts.debt_desc,
            debts.user_id,
            debts.created_at,
            debts.deleted_at,
            debts.company_id,
    
            {$joinFields},
            {$now},
    
            COALESCE(r.reductions_total, 0) AS reductions_total
    
            FROM debts 
                LEFT JOIN (
                SELECT debt_id, SUM(reduction_total) AS reductions_total
                FROM reductions
                WHERE deleted_at IS NULL
                GROUP BY debt_id
            ) r ON debts.debt_id = r.debt_id
            {$joins}
            WHERE debts.company_id=:company_id ";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "debts", "debt");
        $get->searchParams = $searchParams;
        $data = $get->execute();

        return $data;
    }

    public function findById(string $id, ?SearchParams $searchParams = null)
    {
        $user = Router::getInstance()->user;

        $joins = GETQueryNew::userJoins("debts");
        $now = GETQueryNew::addNow();
        $joinFields = GETQueryNew::userJoinsFields();

        $sql = "SELECT 
            debts.debt_id,
            debts.debt_date,
            debts.debt_name,
            debts.debt_total,
            debts.is_settled,
            debts.debt_desc,
            debts.user_id,
            debts.created_at,
            debts.deleted_at,
            debts.company_id,
    
            {$joinFields},
            {$now},
    
            COALESCE(r.reductions_total, 0) AS reductions_total
    
            FROM debts 
                LEFT JOIN (
                SELECT debt_id, SUM(reduction_total) AS reductions_total
                FROM reductions
                WHERE deleted_at IS NULL
                GROUP BY debt_id
            ) r ON debts.debt_id = r.debt_id
            {$joins}
            WHERE debts.company_id=:company_id 
            AND debts.debt_id=:debt_id ";

        $bindings = [
            ":company_id" => $user["company_id"],
            ":debt_id" => $id,
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "debts", "debt");
        $get->searchParams = $searchParams;
        $data = $get->execute();

        return $data;
    }

    public function update(DebtModel $debt, string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "UPDATE debts 
 		SET debt_date = :debt_date,
 		debt_name = :debt_name,
 		debt_total = :debt_total,
 		debt_desc = :debt_desc,
 		is_settled = :is_settled,
 		user_id = :user_id
 		WHERE debt_id = :debt_id
		AND company_id = :company_id";

        $bindings = [
            ":debt_id" => $id,
            ":debt_date" => $debt->debt_date,
            ":debt_name" => $debt->debt_name,
            ":debt_total" => $debt->debt_total,
            ":debt_desc" => $debt->debt_desc,
            ":is_settled" => $debt->is_settled,
            ":user_id" => $debt->user_id,
            ":company_id" => $user["company_id"]
        ];


        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();

        return $res;
    }

    public function create(array $rows)
    {

        $sql = "INSERT INTO debts

                (debt_id,
                debt_date,
                debt_name,
                debt_total,
                is_settled,
                debt_desc,
                user_id,
                company_id)

                VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }

    public function delete(string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "UPDATE debts

				SET deleted_at = NOW()

				WHERE debt_id = :debt_id 
				AND company_id = :company_id";

        $bindings = [
            ":debt_id" => $id,
            ":company_id" => $user["company_id"],
        ];

        $PUT = new PUTQueryNew($sql, $bindings);
        $res = $PUT->execute();

        return $res;
    }


    public function removeAllReductionsFromDebt(string $debt_id)
    {
        $user = Router::getInstance()->user;

        $sql = "UPDATE reductions
        SET debt_id = NULL
        WHERE debt_id = :debt_id
        AND company_id = :company_id
        AND deleted_at IS NULL";

        $bindings = [
            ":debt_id" => $debt_id,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();
        return $res;
    }

}