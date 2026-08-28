<?php
namespace Mtansk\Cp\Repositories\Company;

use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;

class CompanyRepository
{

    public function __construct()
    {
    }

    public function create(array $rows)
    {
        $sql = "INSERT INTO main.companies(
                    company_id,
                    company_name
                )
                VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);

        return $res;
    }

    public function update(string $name, string $id)
    {
        $sql = "UPDATE main.companies
                SET company_name = :company_name
                WHERE company_id = :company_id";

        $bindings = [
            'company_name' => $name,
            'company_id' => $id
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();
        return $res;
    }
}