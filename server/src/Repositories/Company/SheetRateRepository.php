<?php
namespace Mtansk\Cp\Repositories\Company;

use Mtansk\Cp\Helpers\DB\DELETEQueryNew;
use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Models\Company\SheetRateModel;

class SheetRateRepository
{


    public function __construct()
    {
    }

    public function findAll()
    {
        $user = Router::getInstance()->user;

        $rate = GETQueryNew::trim("sheet_rate_rate", "sheet_rates");

        $sql = "SELECT
	        sheet_rates.sheet_rate_id,
            sheet_rates.sheet_rate_name,
            {$rate},
            sheet_rates.sheet_rate_desc,
            sheet_rates.sheet_rate_is_public,
            sheet_rates.measure_type,
            sheet_rates.company_id

	        FROM sheet_rates 
	        WHERE sheet_rates.company_id=:company_id";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "sheet_rates", "sheet_rate");

        $data = $get->execute();

        return $data;
    }

    public function create(array $rows)
    {
        $sql = "INSERT INTO sheet_rates 
        (sheet_rate_id,
        sheet_rate_name, 
        sheet_rate_rate,
        sheet_rate_desc,
        sheet_rate_is_public,
        measure_type,
        company_id) 
        VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }

    public function update(SheetRateModel $rate, string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "UPDATE sheet_rates 

		        SET sheet_rate_name = :sheet_rate_name,
		        sheet_rate_rate = :sheet_rate_rate,
		        sheet_rate_desc = :sheet_rate_desc,
		        sheet_rate_is_public = :sheet_rate_is_public,
		        measure_type = :measure_type

		        WHERE sheet_rate_id = :sheet_rate_id
		        AND company_id = :company_id";

        $bindings = [
            ":sheet_rate_id" => $id,
            ":sheet_rate_name" => $rate->sheet_rate_name,
            ":sheet_rate_rate" => $rate->sheet_rate_rate,
            ":sheet_rate_desc" => $rate->sheet_rate_desc,
            ":sheet_rate_is_public" => $rate->sheet_rate_is_public,
            ":measure_type" => $rate->measure_type,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();

        return $res;
    }

    public function delete(string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "DELETE FROM sheet_rates 
        WHERE sheet_rate_id = :sheet_rate_id 
        AND company_id = :company_id";

        $bindings = [
            ":sheet_rate_id" => $id,
            ":company_id" => $user["company_id"]
        ];

        $delete = new DELETEQueryNew($sql, $bindings);
        $res = $delete->execute();

        return $res;
    }









}