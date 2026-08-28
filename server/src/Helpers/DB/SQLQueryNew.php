<?php

namespace Mtansk\Cp\Helpers\DB;

use PDOStatement;

class SQLQueryNew
{
    public string $sql;
    public array $bindings;

    public ?PDOStatement $stmt = null;


    public function __construct(string $sql, array $bindings = [])
    {
        $this->sql = $sql;
        $this->bindings = $bindings;
    }
}
