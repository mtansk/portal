<?php
namespace Mtansk\Cp\Helpers\DB;

use PDOException;
use PDOStatement;
use Mtansk\Cp\Helpers\DB\DB;
use Mtansk\Cp\Helpers\DB\SQLQueryNew;
use Mtansk\Cp\Helpers\DB\PDOConnection;

class DELETEQueryNew extends SQLQueryNew
{
	public ?PDOStatement $stmt = null;

	public function __construct($sql, $bindings)
	{
		parent::__construct($sql, $bindings);
	}

	public function prepare()
	{
		try {
			$conn = PDOConnection::getInstance()->getConnection();
			$this->stmt = $conn->prepare($this->sql);

			foreach ($this->bindings as $key => $value) {
				$this->stmt->bindValue($key, $value);
			}


		} catch (PDOException $e) {
			DB::catchPDOException($e);
		}
	}

	public function execute()
	{
		try {
			if (!$this->stmt) {
				$this->prepare();
			}

			$this->stmt->execute();
			$count = $this->stmt->rowCount();

			return $count;
		} catch (PDOException $e) {
			DB::catchPDOException($e);
		}
	}
}
