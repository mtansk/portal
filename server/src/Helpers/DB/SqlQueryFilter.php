<?php

namespace Mtansk\Cp\Helpers\DB;

use Mtansk\Cp\Helpers\SearchParams\SearchParams;

class SqlQueryFilter
{
    public ?SearchParams $searchParams = null;

    public ?string $prefix = null;
    public ?string $tableName = null;
    public ?string $DBName = null;

    public ?string $sql = null;
    public ?\PDOStatement $stmt = null;


    public function __construct(?SearchParams $searchParams = null, ?string $prefix = null, ?string $tableName = null, ?string $DBName = null)
    {
        $this->searchParams = $searchParams;
        $this->prefix = $prefix;
        $this->tableName = $tableName;
        $this->DBName = $DBName;
    }

    public function addFilterQueryToSql(string $sql)
    {
        if (!$this->searchParams) {
            return $sql;
        }

        $this->sql = $sql;

        if ($this->searchParams->id) {
            $this->addIDFiltering();
        }

        if ($this->searchParams->user_id) {
            $this->addUIDFiltering();
        }

        if ($this->searchParams->payslip_id) {
            $this->addPIDFiltering();
        }

        if ($this->searchParams->show_only_active) {
            $this->addActiveFiltering();
        }

        if ($this->searchParams->start && $this->searchParams->end) {
            $this->addDateFiltering();
        }

        $this->addDeletedFiltering($this->searchParams->show_deleted === "true");

        if ($this->searchParams->extended_payslip_id) {
            $this->addExtendedPIDFiltering();
        }

        return $this->sql;
    }

    public function bindFilterValues(\PDOStatement $stmt)
    {
        if (!$this->searchParams) {
            return $stmt;
        }

        $this->stmt = $stmt;

        if ($this->searchParams->id) {
            $this->bindIDValue();
        }

        if ($this->searchParams->user_id) {
            $this->bindUIDValue();
        }

        if ($this->searchParams->payslip_id) {
            $this->bindPIDValue();
        }

        if ($this->searchParams->extended_payslip_id) {
            $this->bindExtendedPIDValue();
        }

        if ($this->searchParams->start && $this->searchParams->end) {
            $this->bindDateValues();
        }

        return $this->stmt;
    }



    /* add filters */

    private function addDateFiltering()
    {
        $this->sql .= " AND {$this->prefix}_date BETWEEN :start AND :end";
    }

    private function addIDFiltering()
    {
        $this->sql .= " AND {$this->tableName}.{$this->prefix}_id = :id";
    }
    private function addDeletedFiltering(bool $showDeleted)
    {
        if ($showDeleted) {
            return;
        } else {
            $this->sql .= " AND {$this->DBName}.{$this->tableName}.deleted_at IS NULL";
        }
    }
    private function addUIDFiltering()
    {
        $this->sql .= " AND {$this->DBName}.{$this->tableName}.user_id = :user_id";
    }
    private function addPIDFiltering()
    {
        $this->sql .= " AND {$this->DBName}.{$this->tableName}.payslip_id = :payslip_id";
    }
    private function addActiveFiltering()
    {
        $this->sql .= " AND {$this->DBName}.{$this->tableName}.payslip_id IS NULL";
    }

    private function addExtendedPIDFiltering()
    {
        $this->sql .= " AND ({$this->DBName}.{$this->tableName}.payslip_id = :payslip_id 
            OR {$this->DBName}.{$this->tableName}.payslip_id IS NULL)";
    }

    /* bindings */

    private function bindDateValues()
    {
        if (!$this->stmt) {
            return;
        }
        $start = $this->searchParams->start;
        $end = $this->searchParams->end;

        $this->stmt->bindValue(":start", $start);
        $this->stmt->bindValue(":end", $end);
    }
    private function bindIDValue()
    {
        if (!$this->stmt) {
            return;
        }
        $this->stmt->bindValue(":id", $this->searchParams->id);
    }
    private function bindUIDValue()
    {
        $uid = $this->searchParams->user_id;
        $this->stmt->bindValue(":user_id", $uid);
    }
    private function bindPIDValue()
    {
        $pid = $this->searchParams->payslip_id;
        $this->stmt->bindValue(":payslip_id", $pid);
    }

    private function bindExtendedPIDValue()
    {
        $pid = $this->searchParams->extended_payslip_id;
        $this->stmt->bindValue(":payslip_id", $pid);
    }

}