<?php
namespace Mtansk\Cp\Repositories\Auth;

use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Models\Auth\AccountUpdateModel;
use Mtansk\Cp\Routes\Router;

class AccountRepository
{

    public function __construct()
    {
    }

    public function findByEmail(string $email): ?array
    {
        $getSql = "SELECT

        auth.accounts.account_id,
        auth.accounts.username,
        auth.accounts.password,
        auth.accounts.first_name,
        auth.accounts.account_email,
        auth.accounts.account_telegram,
        auth.accounts.created_at,
        auth.accounts.deleted_at
    
        FROM auth.accounts
    
        WHERE auth.accounts.account_email = :username";

        $getBindings = [
            ":username" => $email
        ];

        $get = new GETQueryNew($getSql, $getBindings);
        $data = $get->execute();

        return $data[0] ?? null;
    }

    public function findById(string $id)
    {
        $sql = "SELECT

        auth.accounts.account_id,
        auth.accounts.username,
        auth.accounts.password,
        auth.accounts.first_name,
        auth.accounts.account_email,
        auth.accounts.account_telegram,
        auth.accounts.created_at,
        auth.accounts.deleted_at
    
        FROM auth.accounts
    
        WHERE auth.accounts.account_id = :account_id";

        $getBindings = [
            ":account_id" => $id
        ];

        $get = new GETQueryNew($sql, $getBindings);
        $data = $get->execute();

        return $data[0] ?? null;
    }

    public function updatePassword(string $newHash, string $account_id)
    {
        $putSql = "UPDATE auth.accounts 
        SET password = :password,
        credentials_changed = UNIX_TIMESTAMP() 
        WHERE account_id = :account_id";

        $putBindings = [
            ":password" => $newHash,
            ":account_id" => $account_id
        ];

        $put = new PUTQueryNew($putSql, $putBindings);
        $putRes = $put->execute();

        return $putRes;
    }

    public function create(array $rows)
    {
        $sql = "INSERT INTO auth.accounts(
                account_id,
                username,
                password,
                credentials_changed,
                first_name,
                account_email,
                account_telegram
                )
                VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }

    public function updateMy(AccountUpdateModel $account, string $id)
    {
        $sql = "UPDATE auth.accounts 

        SET first_name = :first_name, 
        account_telegram = :account_telegram
        
        WHERE account_id = :account_id";

        $bindings = [
            ":first_name" => $account->firstName,
            ":account_telegram" => $account->telegram,
            ":account_id" => $id
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $putRes = $put->execute();

        return $putRes;
    }

    public function findMy()
    {
        $user = Router::getInstance()->user;

        $sql = "SELECT
                    account_id,
                    first_name,
                    account_email,
                    account_telegram,
                    created_at
                FROM
                    auth.accounts 
                WHERE account_id = :account_id";

        $bindings = [
            ":account_id" => $user["account_id"]
        ];

        $get = new GETQueryNew($sql, $bindings);
        $data = $get->execute();

        return $data;
    }

}