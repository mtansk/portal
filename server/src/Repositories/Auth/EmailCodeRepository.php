<?php
namespace Mtansk\Cp\Repositories\Auth;

use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;

class EmailCodeRepository
{

    public function __construct()
    {
    }

    public function findValidCode(string $code, string $account_or_reg_id, string $typeOfAction)
    {
        $sql = "SELECT
                code_id,
                code,
                created_at,
                expires_at,
                account_or_reg_id,
                code_type
                
                FROM auth.email_codes
                WHERE code = :code 
                AND code_type = :code_type
                AND account_or_reg_id = :account_or_reg_id
                AND expires_at > NOW()";

        $bindings = [
            ":code" => $code,
            ":code_type" => $typeOfAction,
            ":account_or_reg_id" => $account_or_reg_id
        ];

        $get = new GETQueryNew($sql, $bindings);
        $data = $get->execute();

        return $data[0] ?? null;
    }

    public function create(string $code, string $account_or_reg_id, string $typeOfCode, string $email)
    {
        $sql = "INSERT INTO auth.email_codes 

        (code_id,
        code,
        account_or_reg_id,
        email,
        code_type) 

        VALUES ";

        $id = Crypto::UUID4();

        $rows = [
            [
                $id,
                $code,
                $account_or_reg_id,
                $email,
                $typeOfCode
            ]
        ];

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);

        return $res;
    }

    public function findLatestCode(string $subId, string $type)
    {
        $sql = "SELECT
                    code_id,
                    code,
                    created_at,
                    expires_at,
                    email,
                    account_or_reg_id,
                    code_type
                FROM
                    auth.email_codes
                WHERE account_or_reg_id = :account_or_reg_id
                AND code_type = :code_type
                ORDER BY created_at DESC
                LIMIT 1";

        $bindings = [
            ":account_or_reg_id" => $subId,
            ":code_type" => $type
        ];

        $get = new GETQueryNew($sql, $bindings);
        $data = $get->execute();

        return $data[0] ?? null;
    }






}