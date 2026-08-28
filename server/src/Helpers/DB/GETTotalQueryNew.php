<?php
namespace Mtansk\Cp\Helpers\DB;

use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;

class GETTotalQueryNew extends GETQueryNew
{
    public function __construct($bindings, string $prefix, SearchParams $searchParams, string $basis)
    {

        if ($basis !== "daily" && $basis !== "monthly" && $basis !== "weekly") {
            $basis = "monthly";
        }

        if ($basis === "daily") {
            $sql = "SELECT
                {$prefix}s.user_id,
                users.department_id,
                {$prefix}s.{$prefix}_date AS date,
                SUM({$prefix}s.{$prefix}_total) AS total,
                SUM(CASE WHEN payslip_id IS NULL THEN {$prefix}s.{$prefix}_total ELSE 0 END) AS active_total,
                SUM(CASE WHEN payslip_id IS NOT NULL THEN {$prefix}s.{$prefix}_total ELSE 0 END) AS archive_total
                FROM {$prefix}s
                LEFT JOIN users ON {$prefix}s.user_id = users.user_id
                WHERE 
                {$prefix}s.company_id = :company_id";

            $additionalQuery = "
                GROUP BY {$prefix}s.user_id, {$prefix}s.{$prefix}_date
                ORDER BY {$prefix}s.user_id, {$prefix}s.{$prefix}_date
            ";
        } elseif ($basis === "weekly") {
            $sql = "SELECT
                {$prefix}s.user_id,
                users.department_id,
                YEAR({$prefix}s.{$prefix}_date) AS year,
                WEEK({$prefix}s.{$prefix}_date, 1) AS week,
                SUM({$prefix}s.{$prefix}_total) AS total,
                SUM(CASE WHEN payslip_id IS NULL THEN {$prefix}s.{$prefix}_total ELSE 0 END) AS active_total,
                SUM(CASE WHEN payslip_id IS NOT NULL THEN {$prefix}s.{$prefix}_total ELSE 0 END) AS archive_total
                FROM {$prefix}s
                LEFT JOIN users ON {$prefix}s.user_id = users.user_id
                WHERE 
                {$prefix}s.company_id = :company_id";

            $additionalQuery = "
                GROUP BY 
                {$prefix}s.user_id, year, week
                ORDER BY 
                year, week, {$prefix}s.user_id
            ";
        } else {
            $sql = "SELECT
                {$prefix}s.user_id,
                users.department_id,
                YEAR({$prefix}s.{$prefix}_date) AS year,
                MONTH({$prefix}s.{$prefix}_date) AS month,
                SUM({$prefix}s.{$prefix}_total) AS total,
                SUM(CASE WHEN payslip_id IS NULL THEN {$prefix}s.{$prefix}_total ELSE 0 END) AS active_total,
                SUM(CASE WHEN payslip_id IS NOT NULL THEN {$prefix}s.{$prefix}_total ELSE 0 END) AS archive_total
                FROM {$prefix}s
                LEFT JOIN users ON {$prefix}s.user_id = users.user_id
                WHERE 
                {$prefix}s.company_id = :company_id";

            $additionalQuery = "
                GROUP BY 
                {$prefix}s.user_id, year, month
                ORDER BY 
                year, month, {$prefix}s.user_id
            ";
        }

        if ($prefix === "sheet") {
            $sql .= " AND sheets.sheet_status = 'workday'";
        }

        parent::__construct($sql, $bindings, "main", "{$prefix}s", $prefix);

        $this->afterQuery = $additionalQuery;
        $this->searchParams = $searchParams;
    }
}
