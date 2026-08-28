<?php
namespace Mtansk\Cp\Helpers\DB;

use PDOException;
use Mtansk\Cp\Helpers\DB\DB;
use Mtansk\Cp\Helpers\DB\SQLQueryNew;
use Mtansk\Cp\Helpers\DB\PDOConnection;



class POSTQueryNew extends SQLQueryNew
{

	public function __construct($sql)
	{
		parent::__construct($sql, []);
	}


	public static function createRowsArrayFromIds($idsAndDatesArray, $bindings)
	{
		$arrayOfRows = [];

		foreach ($idsAndDatesArray as $id => $dates) {
			if (!empty($dates)) {
				foreach ($dates as $date) {
					$arrayOfRows[] = array_merge([$id, $date, UUID4()], $bindings);
				}
			}
		}

		return $arrayOfRows;
	}

	public function executeWithRows(array $arrayOfRows)
	{
		try {
			$conn = PDOConnection::getInstance()->getConnection();

			$data = [];
			foreach ($arrayOfRows as $row) {
				$row = array_values($row);
				$placeholders = rtrim(str_repeat("?, ", count($row)), ", ");
				$this->sql .= "($placeholders), ";

				$data = array_merge($data, $row);
			}
			$this->sql = rtrim($this->sql, ", ");

			$stmt = $conn->prepare($this->sql);
			$stmt->execute($data);
			$count = $stmt->rowCount();

			return $count;
		} catch (PDOException $e) {
			DB::catchPDOException($e);
		}
	}

}