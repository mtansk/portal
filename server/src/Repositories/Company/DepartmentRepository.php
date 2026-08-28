<?php
namespace Mtansk\Cp\Repositories\Company;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Models\Company\DepartmentModel;

class DepartmentRepository
{


    public function __construct()
    {
    }

    public function findAll(?SearchParams $searchParams = null)
    {
        $user = Router::getInstance()->user;

        $sql = "SELECT 
        
        departments.department_id,
        departments.department_name,
        departments.department_color,
        departments.company_id
    
        FROM departments 
        WHERE departments.company_id=:company_id";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "departments", "department", );
        $get->searchParams = $searchParams;
        $get->afterQuery = " ORDER BY departments.department_name ASC";

        return $get->execute();
    }

    public function create(array $rows)
    {
        $sql = "INSERT INTO departments 
        (department_id,
        department_name, 
        department_color, 
        company_id)
        VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }

    public function update(DepartmentModel $dept, string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "UPDATE departments 
		SET department_name = :department_name,
		department_color = :department_color
		WHERE department_id = :department_id
		AND company_id = :company_id";

        $bindings = [
            ":department_id" => $id,
            ":department_name" => $dept->department_name,
            ":department_color" => $dept->department_color,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();
        return $res;
    }


    public function findMy()
    {
        $user = Router::getInstance()->user;

        $sql = "SELECT 
        
        departments.department_id,
        departments.department_name,
        departments.department_color,
        departments.company_id
    
        FROM departments 
        WHERE departments.company_id=:company_id ";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "departments", "department", );
        $get->afterQuery = " ORDER BY departments.department_name ASC";

        $data = $get->execute();
        return $data;
    }

}