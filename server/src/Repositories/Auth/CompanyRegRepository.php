<?php
namespace Mtansk\Cp\Repositories\Auth;

use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Models\Auth\CompanyRegModel;

class CompanyRegRepository
{


    public function __construct()
    {
    }

    public function storeRegInfo(CompanyRegModel $regModel, string $regId)
    {
        $sql = "INSERT INTO auth.reg_company 
        (reg_id,
        first_name,
        company_name,
        use_template,
        email,
        password) VALUES ";

        $hash = password_hash($regModel->password, PASSWORD_DEFAULT);

        $rows = [
            [
                $regId,
                $regModel->first_name,
                $regModel->company_name,
                $regModel->use_template,
                $regModel->email,
                $hash
            ]
        ];

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);

        return $res;
    }
    public function findRegInfo(string $regId)
    {
        $sql = "SELECT
                reg_id,
                first_name,
                company_name,
                use_template,
                email,
                password,
                created_at
            FROM auth.reg_company
            WHERE reg_id = :reg_id";

        $bindings = [
            ":reg_id" => $regId
        ];

        $get = new GETQueryNew($sql, $bindings);
        $data = $get->execute();

        return $data[0] ?? null;
    }



    public function storeCompany(string $id, array $company)
    {
        $sql = "INSERT INTO main.companies 
        (company_id,
        company_name) VALUES ";

        $rows = [
            [
                $id,
                $company["company_name"]
            ]
        ];

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);

        return $res;
    }
    public function storeDept(string $company_id, string $dept_id, )
    {
        $sql = "INSERT INTO main.departments

                (department_id,
                department_name,
                department_color,
                company_id)

            VALUES ";

        $rows = [
            [
                $dept_id,
                "Ваш первый отдел",
                "#efdfff",
                $company_id
            ]
        ];
        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);

        return $res;
    }
    public function storeUser(
        string $company_id,
        string $dept_id,
        string $account_id,
        string $user_id,
        array $user
    ) {
        $sql = "INSERT INTO users(
                    user_id,
                    first_name,
                    last_name,
                    middle_name,
                    user_title,
                    user_email,
                    user_phone,
                    user_telegram,
                    access_level,
                    account_status,
                    account_id,
                    company_id,
                    department_id
                )
                VALUES";

        $rows = [
            [
                $user_id,
                $user["first_name"],
                NULL,
                NULL,
                $user["user_title"],
                $user["user_email"],
                NULL,
                NULL,
                $user["access_level"],
                $user["account_status"],
                $account_id,
                $company_id,
                $dept_id
            ]
        ];

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }
    public function storeRootUser(string $company_id, string $user_id)
    {
        $sql = "INSERT INTO auth.root_users
        (company_id, 
        user_id)
        VALUES ";

        $rows = [
            [
                $company_id,
                $user_id
            ]
        ];

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);

        return $res;
    }
    public function storeSubscription(string $company_id)
    {
        $sql = "INSERT INTO finance.subscriptions(
        subscription_id,
        subscription_type,
        users_limit,
        subscription_st_date,
        subscription_en_date,
        company_id
        )
        VALUES ";

        $subId = Crypto::UUID4();

        $rows = [
            [
                $subId,
                "trial",
                100,
                gmdate("Y-m-d"),
                gmdate("Y-m-d", strtotime("+1 month UTC")),
                $company_id
            ]
        ];

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }



}