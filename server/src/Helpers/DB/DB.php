<?php
namespace Mtansk\Cp\Helpers\DB;

use Mtansk\Cp\Helpers\DB\PDOConnection;
use Mtansk\Cp\Helpers\Response\Response;


class DB
{

	public static function catchPDOException($e)
	{
		$response = new Response();
		$response->code = 500;
		$response->message = $e->getMessage();
		$response->send();
	}

	public static function simulateSlowConnection()
	{
		for ($i = 0; $i < 500000000; $i++) {
		}
	}
}
