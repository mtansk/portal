<?php
namespace Mtansk\Cp\Repositories\Transaction;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;

class TransactionRepository
{



    public function __construct()
    {
    }

    public function findPending()
    {
        $user = Router::getInstance()->user;
        $sql = "SELECT
                    transaction_id,
                    transaction_product,
                    transaction_qty,
                    transaction_total,
                    transaction_status,
                    transaction_time,
                    user_id,
                    company_id,
                    payment_id
                FROM
                    finance.transactions
                WHERE
                    company_id = :company_id
                AND transaction_status = 'pending'
                AND transaction_time > NOW() - INTERVAL 1 HOUR
                ";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        $get = new GETQueryNew($sql, $bindings);
        $data = $get->execute();

        return $data;
    }

    public function find(string $transactionId)
    {
        $user = Router::getInstance()->user;
        $sql = "SELECT
                    transaction_id,
                    transaction_product,
                    transaction_qty,
                    transaction_total,
                    transaction_status,
                    user_id,
                    company_id,
                    payment_id
                FROM
                    finance.transactions
                WHERE
                    transaction_id = :transaction_id
                AND company_id = :company_id
                ";

        $bindings = [
            ":transaction_id" => $transactionId,
            ":company_id" => $user["company_id"],
        ];

        $get = new GETQueryNew($sql, $bindings);
        $data = $get->execute();

        return $data[0] ?? null;
    }

    public function store(array $rows)
    {
        $sql = "INSERT INTO finance.transactions(
                    transaction_id,
                    transaction_product,
                    transaction_qty,
                    transaction_total,
                    transaction_status,
                    user_id,
                    company_id,
                    payment_id
                )
                VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }

    public function updateStatus(array $data)
    {
        $user = Router::getInstance()->user;
        $sql = "UPDATE finance.transactions
                SET
                    transaction_status = :tr_status
                WHERE
                    transaction_id = :transaction_id
                AND company_id = :company_id
                ";

        $bindings = [
            ":tr_status" => $data["status"],
            ":transaction_id" => $data["transaction_id"],
            ":company_id" => $user["company_id"],
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();
        return $res;
    }

}