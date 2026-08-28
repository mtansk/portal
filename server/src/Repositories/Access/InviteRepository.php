<?php
namespace Mtansk\Cp\Repositories\Access;

use Mtansk\Cp\Helpers\DB\DELETEQueryNew;
use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Routes\Router;

class InviteRepository
{


    public function __construct()
    {
    }

    public function findByUser(string $userId): ?int
    {
        $user = Router::getInstance()->user;

        $sql = "SELECT COUNT(*) AS count 
                FROM auth.invites 
                WHERE user_id = :user_id 
                AND expires_at >= NOW() 
                AND company_id = :company_id";


        $bindings = [
            ":user_id" => $userId,
            ":company_id" => $user["company_id"]
        ];

        $get = new GETQueryNew($sql, $bindings);
        $data = $get->execute();

        return $data[0] ? $data[0]["count"] : null;
    }

    public function findByCode(string $code): ?int
    {

        $sql = "SELECT COUNT(*) AS count 
                FROM auth.invites 
                WHERE code = :code 
                AND expires_at >= NOW() 
                AND company_id = :company_id";

        $user = Router::getInstance()->user;

        $bindings = [
            ":code" => $code,
            ":company_id" => $user["company_id"]
        ];

        $get = new GETQueryNew($sql, $bindings);
        $data = $get->execute();

        return $data[0] ? $data[0]["count"] : null;
    }

    public function findByCodeAndFirstName(string $code, string $firstName)
    {
        $sql = "SELECT 
                    auth.invites.invite_id, 
                    auth.invites.invite_code, 
                    auth.invites.created_at,
                    auth.invites.expires_at,
                    auth.invites.user_id, 
                    auth.invites.company_id,

                    main.users.first_name,
                    main.users.account_id

                FROM auth.invites 

                LEFT JOIN main.users ON auth.invites.user_id = main.users.user_id 

                WHERE auth.invites.invite_code = :invite_code 
                AND main.users.first_name = :first_name 
                AND auth.invites.expires_at >= NOW()
                AND main.users.account_id IS NULL";

        $bindings = [
            ":invite_code" => $code,
            ":first_name" => $firstName
        ];

        $get = new GETQueryNew($sql, $bindings);
        $data = $get->execute();

        return $data[0] ?? null;
    }

    public function store(string $code, string $userId)
    {
        $user = Router::getInstance()->user;

        $sql = "INSERT INTO auth.invites 
                (invite_id, invite_code, user_id, company_id)
                VALUES ";

        $rows = [
            [
                Crypto::UUID4(),
                $code,
                $userId,
                $user["company_id"]
            ]
        ];

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);

        return $res;
    }

    public function delete(string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "DELETE FROM auth.invites 
                WHERE invite_id = :invite_id 
                AND company_id = :company_id";

        $bindings = [
            ":invite_id" => $id,
            ":company_id" => $user["company_id"]
        ];

        $delete = new DELETEQueryNew($sql, $bindings);
        $res = $delete->execute();

        return $res;

    }

    public function deleteAllUserInvites(string $userId)
    {
        $sql = "DELETE FROM auth.invites 
        WHERE user_id = :user_id ";

        $bindings = [
            ":user_id" => $userId
        ];

        $delete = new DELETEQueryNew($sql, $bindings);
        $res = $delete->execute();

        return $res;
    }


}