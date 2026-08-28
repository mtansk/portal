<?php
namespace Mtansk\Cp\Repositories\Auth;

use Mtansk\Cp\Helpers\DB\GETQueryNew;

class AccessStateRepository
{



    public function __construct()
    {
    }

    public function getUserAccessData(string $user_id): ?array
    {
        $sql = "SELECT

            main.users.user_id,
            main.users.access_level,
            main.users.account_status,
            main.users.deleted_at AS user_deleted_at,

            main.users.company_id,
            main.users.account_id,

            main.companies.deleted_at AS company_deleted_at,
            auth.accounts.deleted_at AS account_deleted_at,
            auth.accounts.credentials_changed,

            finance.subscriptions.subscription_id,
            finance.subscriptions.subscription_type

            FROM main.users

                LEFT JOIN main.companies ON main.users.company_id = main.companies.company_id
                LEFT JOIN auth.accounts ON main.users.account_id = auth.accounts.account_id
                LEFT JOIN finance.subscriptions ON main.companies.company_id = finance.subscriptions.company_id
                    AND CURDATE() BETWEEN finance.subscriptions.subscription_st_date
                                AND finance.subscriptions.subscription_en_date

            WHERE main.users.user_id = :user_id";

        $bindings = [
            ":user_id" => $user_id
        ];

        $get = new GETQueryNew($sql, $bindings);
        $data = $get->execute();

        return $data[0] ?? null;
    }




}