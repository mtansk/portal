<?php
namespace Mtansk\Cp\Repositories\Auth;

use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;


class UserRegRepository
{

    public function __construct()
    {
    }

    public function create(array $rows)
    {
        $sql = "INSERT INTO auth.reg_user(
                    reg_id,
                    invite_id,
                    first_name,
                    email,
                    password,
                    user_id,
                    company_id
                )
                VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }

    public function findById(string $regId)
    {
        $sql = "SELECT
                reg_id,
                invite_id,
                first_name,
                email,
                password,
                user_id,
                company_id,
                created_at
            FROM
                auth.reg_user 
            WHERE reg_id = :reg_id";

        $bindings = [
            ":reg_id" => $regId
        ];

        $get = new GETQueryNew($sql, $bindings);
        $data = $get->execute();
        return $data[0] ?? null;
    }


}