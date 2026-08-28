<?php
namespace Mtansk\Cp\Repositories\Company;

use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;
use Mtansk\Cp\Models\Company\GeneralRateModel;
use Mtansk\Cp\Routes\Router;

class GeneralRateRepository
{

    public function __construct()
    {
    }

    public function findAll()
    {
        $user = Router::getInstance()->user;

        $rate = GETQueryNew::trim("general_rate_rate", "general_rates");

        $sql = "SELECT
        general_rates.general_rate_id,
        general_rates.general_rate_name,
        {$rate},
        general_rates.general_rate_desc,
        general_rates.general_rate_is_public,
        general_rates.accrual_group_id,
        general_rates.company_id
    
        FROM general_rates 
        WHERE general_rates.company_id=:company_id";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "general_rates", "general_rate");
        $data = $get->execute();

        return $data;
    }

    public function update(GeneralRateModel $rate, string $id)
    {

        $user = Router::getInstance()->user;

        $sql = "UPDATE general_rates 
		SET general_rate_name = :general_rate_name,
		general_rate_rate = :general_rate_rate,
		general_rate_desc = :general_rate_desc,
		general_rate_is_public = :general_rate_is_public,
		accrual_group_id = :accrual_group_id
		WHERE general_rate_id = :general_rate_id
		AND company_id = :company_id";

        $bindings = [
            ":general_rate_id" => $id,
            ":general_rate_name" => $rate->general_rate_name,
            ":general_rate_rate" => $rate->general_rate_rate,
            ":general_rate_desc" => $rate->general_rate_desc,
            ":general_rate_is_public" => $rate->general_rate_is_public,
            ":accrual_group_id" => $rate->accrual_group_id,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();

        return $res;
    }

    public function delete(string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "DELETE FROM general_rates 
                WHERE general_rate_id = :general_rate_id
                AND company_id = :company_id";

        $bindings = [
            ":general_rate_id" => $id,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();

        return $res;
    }

    public function create(array $rows)
    {
        $sql = "INSERT INTO general_rates 
        (general_rate_id,
        general_rate_name, 
        general_rate_rate, 
        general_rate_desc, 
        general_rate_is_public, 
        accrual_group_id, 
        company_id) 
        VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }
}