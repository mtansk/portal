<?php
namespace Mtansk\Cp\Repositories\Access;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;

class SubscriptionRepository
{

    public function __construct()
    {
    }

    public function findAll(string $companyId)
    {
        $sql = "SELECT
        
            subscription_id,
            subscription_type,
            users_limit,
            subscription_st_date,
            subscription_en_date,
            company_id,
            created_at,
            transaction_id,
            (CURRENT_DATE BETWEEN subscription_st_date AND subscription_en_date) AS is_active

        FROM
            finance.subscriptions
        WHERE
            company_id = :company_id
        ORDER BY subscription_st_date DESC 
            "; // DO NOT CHANGE ORDER

        $bindings = [
            ":company_id" => $companyId,
        ];

        $get = new GETQueryNew($sql, $bindings, "finance", "subscriptions", "subscription");
        $data = $get->execute();

        return $data;
    }

    public function calculateAccountPlansByCompany(string $company_id)
    {

        $sql = "SELECT 
    
            CAST((IFNULL(SUM(account_plans.account_plan_amount), 0) + 1) AS UNSIGNED) AS total_limit,
            MAX(account_plans.account_plan_en_date) AS latest_end_date,
    
            (SELECT COUNT(*) 
            FROM main.users 
            WHERE account_status = 'active' 
            AND company_id = :company_id) AS active_users_count,
            (SELECT COUNT(*) 
            FROM auth.invites 
            WHERE expires_at >= NOW() 
            AND company_id = :company_id) AS active_invites_count
    
            FROM 
                finance.account_plans
    
            WHERE 
            account_plans.company_id = :company_id
            AND CURRENT_DATE BETWEEN account_plans.account_plan_st_date AND account_plans.account_plan_en_date;";


        $bindings = [
            ":company_id" => $company_id,
        ];

        $get = new GETQueryNew($sql, $bindings, "finance", "account_plans", "account_plan");
        $data = $get->execute();

        return $data[0] ?? null;
    }

    public function store(array $rows)
    {
        $sql = "INSERT INTO finance.subscriptions(
                subscription_id,
                subscription_type,
                users_limit,
                subscription_st_date,
                subscription_en_date,
                company_id,
                transaction_id
            )
            VALUES ";
        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }





}