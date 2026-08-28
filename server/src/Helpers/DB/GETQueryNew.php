<?php

namespace Mtansk\Cp\Helpers\DB;

use PDOException;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;

class GETQueryNew extends SQLQueryNew
{
    public ?string $DBName = null;
    public ?string $tableName = null;
    public ?string $prefix = null;


    public ?string $afterQuery = null;

    public ?SearchParams $searchParams = null;

    public function __construct(
        string $sql,
        array $bindings = [],
        ?string $DBName = null,
        ?string $tableName = null,
        ?string $prefix = null,
    ) {
        parent::__construct($sql, $bindings);

        $DBName ? $this->DBName = $DBName : null;
        $tableName ? $this->tableName = $tableName : null;
        $prefix ? $this->prefix = $prefix : null;
    }

    public function prepare()
    {
        try {
            $conn = PDOConnection::getInstance()->getConnection();

            $queryFilter = new SqlQueryFilter($this->searchParams, $this->prefix, $this->tableName, $this->DBName);
            $this->sql = $queryFilter->addFilterQueryToSql($this->sql);

            if ($this->afterQuery) {
                $this->sql .= $this->afterQuery;
            }

            $this->stmt = $conn->prepare($this->sql);

            foreach ($this->bindings as $key => $value) {
                $this->stmt->bindValue($key, $value);
            }

            $this->stmt = $queryFilter->bindFilterValues($this->stmt);

        } catch (PDOException $e) {
            DB::catchPDOException($e);
        }
    }

    public function execute()
    {
        try {
            if ($this->stmt === null) {
                $this->prepare();
            }
            $this->stmt->execute();
            $data = $this->stmt->fetchAll();

            return $data;
        } catch (PDOException $e) {
            DB::catchPDOException($e);
        }
    }





    public static function addEFOFields(string $prefix)
    {
        $rate = "TRIM(TRAILING '.' FROM (TRIM(TRAILING '0' FROM {$prefix}_rate))) AS rate";
        $qty = "TRIM(TRAILING '.' FROM (TRIM(TRAILING '0' FROM {$prefix}_qty))) AS qty";

        $array = [
            "date" => "{$prefix}_date AS date",
            "formattedDate" => "DATE_FORMAT({$prefix}_date, '%d.%m.%Y') AS formattedDate",
            "name" => "{$prefix}_name AS name",
            "id" => "{$prefix}_id AS id",
            "rate" => "{$rate}",
            "qty" => "{$qty}",
            "total" => "{$prefix}_total AS total",
            "desc" => "{$prefix}_desc AS `desc`",
        ];

        return implode(", ", $array);
    }

    public static function addNow()
    {
        return "NOW() AS now";
    }


    public static function addFoFields(string $prefix)
    {
        $rate = "TRIM(TRAILING '.' FROM (TRIM(TRAILING '0' FROM {$prefix}_rate))) AS rate";
        $qty = "TRIM(TRAILING '.' FROM (TRIM(TRAILING '0' FROM {$prefix}_qty))) AS qty";
        $array = [
            "name" => "{$prefix}_name AS name",
            "id" => "{$prefix}_id AS id",
            "rate" => "{$rate}",
            "qty" => "{$qty}",
            "total" => "{$prefix}_total AS total",
        ];

        return implode(", ", $array);
    }

    public static function userJoins(string $tableName)
    {
        return "LEFT JOIN users ON {$tableName}.user_id = main.users.user_id
		LEFT JOIN departments ON main.users.department_id = main.departments.department_id";
    }

    public static function userJoinsFields()
    {
        return "
			users.first_name,
			users.last_name,
			users.middle_name,
			users.user_title,
			users.department_id,
			departments.department_name,
			departments.department_color
		";
    }


    public static function trim(string $column, ?string $tableName)
    {
        if (!$tableName) {
            return "TRIM(TRAILING '.' FROM (TRIM(TRAILING '0' FROM {$column}))) AS {$column}";
        }
        return "TRIM(TRAILING '.' FROM (TRIM(TRAILING '0' FROM {$tableName}.{$column}))) AS {$column}";
    }
}