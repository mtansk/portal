<?php
namespace Mtansk\Cp\Repositories\Finance;

use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Models\Finance\PayslipModel;
use Mtansk\Cp\Routes\Router;


class PayslipRepository
{



    public function __construct()
    {
    }

    public function findAll(?SearchParams $searchParams = null)
    {
        $user = Router::getInstance()->user;

        $joins = GETQueryNew::userJoins("payslips");
        $now = GETQueryNew::addNow();
        $joinFields = GETQueryNew::userJoinsFields();

        $sql = "SELECT 
                payslips.payslip_id,
                payslips.payslip_date,
                payslips.payslip_name,
                payslips.payslip_st_date,
                payslips.payslip_en_date,
                payslips.user_id,
                payslips.created_at,
                payslips.deleted_at,
                payslips.company_id,

                {$joinFields},

                {$now},

                COALESCE(a.accruals_total, 0) AS accruals_total,
                COALESCE(s.sheets_total, 0) AS sheets_total,
                COALESCE(r.reductions_total, 0) AS reductions_total,
                COALESCE(t.taxes_total, 0) AS taxes_total,
                COALESCE(pp.payments_total, 0) AS payments_total,
                (
                    COALESCE(a.accruals_total, 0) +
                    COALESCE(s.sheets_total, 0) -
                    COALESCE(r.reductions_total, 0) -
                    COALESCE(t.taxes_total, 0)
                ) AS total
                FROM payslips
                    LEFT JOIN (
                        SELECT payslip_id, SUM(accrual_total) AS accruals_total
                        FROM accruals
                        WHERE deleted_at IS NULL
                        GROUP BY payslip_id
                    ) a ON payslips.payslip_id = a.payslip_id
                    LEFT JOIN (
                        SELECT payslip_id, SUM(sheet_total) AS sheets_total
                        FROM sheets
                        WHERE deleted_at IS NULL
                        GROUP BY payslip_id
                    ) s ON payslips.payslip_id = s.payslip_id
                    LEFT JOIN (
                        SELECT payslip_id, SUM(reduction_total) AS reductions_total
                        FROM reductions
                        WHERE deleted_at IS NULL
                        GROUP BY payslip_id
                    ) r ON payslips.payslip_id = r.payslip_id
                    LEFT JOIN (
                        SELECT payslip_id, SUM(tax_total) AS taxes_total
                        FROM taxes
                        WHERE deleted_at IS NULL
                        GROUP BY payslip_id
                    ) t ON payslips.payslip_id = t.payslip_id
                    LEFT JOIN (
                        SELECT payslip_id, SUM(payment_total) AS payments_total
                        FROM payments
                        WHERE deleted_at IS NULL
                        GROUP BY payslip_id
                    ) pp ON payslips.payslip_id = pp.payslip_id
                    {$joins}
                WHERE payslips.company_id = :company_id ";

        $bindings = [
            ":company_id" => $user["company_id"]
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "payslips", "payslip");
        $get->searchParams = $searchParams;
        $get->afterQuery = " ORDER BY payslips.payslip_date";

        $data = $get->execute();
        return $data;
    }
    public function findById(string $id, ?SearchParams $searchParams = null)
    {
        $user = Router::getInstance()->user;

        $joins = GETQueryNew::userJoins("payslips");
        $now = GETQueryNew::addNow();
        $joinFields = GETQueryNew::userJoinsFields();

        $sql = "SELECT 
                payslips.payslip_id,
                payslips.payslip_date,
                payslips.payslip_name,
                payslips.payslip_st_date,
                payslips.payslip_en_date,
                payslips.user_id,
                payslips.created_at,
                payslips.deleted_at,
                payslips.company_id,

                {$joinFields},

                {$now},

                COALESCE(a.accruals_total, 0) AS accruals_total,
                COALESCE(s.sheets_total, 0) AS sheets_total,
                COALESCE(r.reductions_total, 0) AS reductions_total,
                COALESCE(t.taxes_total, 0) AS taxes_total,
                COALESCE(pp.payments_total, 0) AS payments_total,
                (
                    COALESCE(a.accruals_total, 0) +
                    COALESCE(s.sheets_total, 0) -
                    COALESCE(r.reductions_total, 0) -
                    COALESCE(t.taxes_total, 0)
                ) AS total
                FROM payslips
                    LEFT JOIN (
                        SELECT payslip_id, SUM(accrual_total) AS accruals_total
                        FROM accruals
                        WHERE deleted_at IS NULL
                        GROUP BY payslip_id
                    ) a ON payslips.payslip_id = a.payslip_id
                    LEFT JOIN (
                        SELECT payslip_id, SUM(sheet_total) AS sheets_total
                        FROM sheets
                        WHERE deleted_at IS NULL
                        GROUP BY payslip_id
                    ) s ON payslips.payslip_id = s.payslip_id
                    LEFT JOIN (
                        SELECT payslip_id, SUM(reduction_total) AS reductions_total
                        FROM reductions
                        WHERE deleted_at IS NULL
                        GROUP BY payslip_id
                    ) r ON payslips.payslip_id = r.payslip_id
                    LEFT JOIN (
                        SELECT payslip_id, SUM(tax_total) AS taxes_total
                        FROM taxes
                        WHERE deleted_at IS NULL
                        GROUP BY payslip_id
                    ) t ON payslips.payslip_id = t.payslip_id
                    LEFT JOIN (
                        SELECT payslip_id, SUM(payment_total) AS payments_total
                        FROM payments
                        WHERE deleted_at IS NULL
                        GROUP BY payslip_id
                    ) pp ON payslips.payslip_id = pp.payslip_id
                    {$joins}
                WHERE payslips.company_id = :company_id 
                AND payslips.payslip_id = :payslip_id 
                AND payslips.deleted_at IS NULL";

        $bindings = [
            ":company_id" => $user["company_id"],
            ":payslip_id" => $id
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "payslips", "payslip");
        $get->searchParams = $searchParams;
        $data = $get->execute();
        return $data;
    }
    public function update(PayslipModel $payslip, string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "UPDATE payslips SET

                payslip_name = :payslip_name,
                payslip_date = :payslip_date,
                payslip_st_date = :payslip_st_date,
                payslip_en_date = :payslip_en_date

                WHERE payslip_id = :payslip_id 
                AND company_id = :company_id ";

        $bindings = [
            ":payslip_id" => $id,
            ":payslip_name" => $payslip->payslip_name,
            ":payslip_date" => $payslip->payslip_date,
            ":payslip_st_date" => $payslip->payslip_st_date,
            ":payslip_en_date" => $payslip->payslip_en_date,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();

        return $res;
    }
    public function create(array $rows)
    {
        $sql = "INSERT INTO payslips 

        (payslip_id, 
        payslip_name, 
        payslip_date, 
        payslip_st_date, 
        payslip_en_date, 
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

        $sql = "UPDATE payslips 
        SET deleted_at = NOW() 
        WHERE payslip_id = :payslip_id 
        AND company_id = :company_id
        AND deleted_at IS NULL";

        $bindings = [
            ":payslip_id" => $id,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();
        return $res;
    }





    public function setObjectsPayslipID(
        string $table,
        string $prefix,
        array $ids,
        string|null $payslip_id
    ) {
        if (count($ids) === 0) {
            return 0;
        }
        $user = Router::getInstance()->user;

        $placeholders = implode(',', array_map(function ($index) {
            return ":id_{$index}";
        }, array_keys($ids)));

        $bindings = [
            ":payslip_id" => $payslip_id,
            ":company_id" => $user["company_id"],
        ];
        foreach ($ids as $index => $id) {
            $bindings[":id_{$index}"] = $id;
        }

        $sql = "UPDATE {$table} 

        SET payslip_id = :payslip_id

        WHERE {$table}.{$prefix}_id IN ($placeholders)
        AND deleted_at IS NULL
        AND {$table}.company_id = :company_id";

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();
        return $res;
    }

    public function deleteObjectsByIds(
        string $table,
        string $prefix,
        array $ids
    ) {
        if (count($ids) === 0) {
            return 0;
        }
        $user = Router::getInstance()->user;

        $placeholders = implode(',', array_map(function ($index) {
            return ":id_{$index}";
        }, array_keys($ids)));

        $bindings = [
            ":company_id" => $user["company_id"]
        ];
        foreach ($ids as $index => $id) {
            $bindings[":id_{$index}"] = $id;
        }

        $sql = "UPDATE {$table} 

        SET deleted_at = NOW()

        WHERE {$table}.{$prefix}_id IN ($placeholders)
        AND deleted_at IS NULL
        AND {$table}.company_id = :company_id";

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();
        return $res;
    }

    public function deleteAllPayslipObjects(
        string $table,
        string $payslip_id
    ) {
        $sql = "UPDATE {$table} 

        SET deleted_at = NOW()

        WHERE {$table}.payslip_id = :payslip_id
        AND {$table}.payslip_id IS NOT NULL
        AND deleted_at IS NULL
        AND {$table}.company_id = :company_id";


        $user = Router::getInstance()->user;
        $bindings = [
            ":company_id" => $user["company_id"],
            ":payslip_id" => $payslip_id
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();
        return $res;
    }

    public function removeAllPayslipObjects(
        string $table,
        string $payslip_id
    ) {
        $sql = "UPDATE {$table} 

            SET payslip_id = NULL 

            WHERE payslip_id = :payslip_id
            AND payslip_id IS NOT NULL
            AND company_id = :company_id
            AND deleted_at IS NULL";

        $user = Router::getInstance()->user;
        $bindings = [
            ":payslip_id" => $payslip_id,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();
        return $res;
    }

    public function addAllActiveObjectsToPayslip(
        string $table,
        string $prefix,
        PayslipModel $payslip,
        string $payslip_id,
        string $user_id
    ) {
        $sql = "UPDATE {$table} 
        SET payslip_id = :payslip_id

        WHERE user_id = :user_id 

        AND {$prefix}_date BETWEEN :st_date AND :en_date

        AND payslip_id IS NULL
        AND company_id=:company_id 
        AND deleted_at IS NULL";

        if ($table === "sheets") {
            $sql .= " AND sheet_status = 'workday'";
        }

        $user = Router::getInstance()->user;
        $bindings = [
            ":payslip_id" => $payslip_id,
            ":user_id" => $user_id,
            ":st_date" => $payslip->payslip_st_date,
            ":en_date" => $payslip->payslip_en_date,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();
        return $res;
    }

}