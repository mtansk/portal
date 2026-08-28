<?php
namespace Mtansk\Cp\Repositories\Company;

use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;
use Mtansk\Cp\Models\Company\AccrualGroupModel;
use Mtansk\Cp\Routes\Router;

class AccrualGroupRepository
{

    public function __construct()
    {
    }

    public function findAll()
    {
        $user = Router::getInstance()->user;

        $sql = "SELECT 
            accrual_groups.accrual_group_id,
            accrual_groups.accrual_group_name
    
            FROM accrual_groups
            WHERE accrual_groups.company_id=:company_id";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "accrual_groups", "accrual_group");
        $data = $get->execute();
        return $data;
    }

    public function create(array $rows)
    {
        $sql = "INSERT INTO accrual_groups 
        (accrual_group_id,
        accrual_group_name, 
        company_id) 
        VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }

    public function update(AccrualGroupModel $group, string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "UPDATE accrual_groups 
                SET accrual_group_name = :accrual_group_name
                WHERE accrual_group_id = :accrual_group_id
                AND company_id = :company_id";

        $bindings = [
            ":accrual_group_id" => $id,
            ":accrual_group_name" => $group->accrual_group_name,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();

        return $res;
    }

}