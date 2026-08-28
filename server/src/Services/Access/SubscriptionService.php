<?php
namespace Mtansk\Cp\Services\Access;

use DateTime;
use DateTimeZone;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Repositories\Access\SubscriptionRepository;

class SubscriptionService
{

    private SubscriptionRepository $subscriptionRepository;

    public function __construct(SubscriptionRepository $subscriptionRepository)
    {
        $this->subscriptionRepository = $subscriptionRepository;
    }

    public function findAll(string $companyId)
    {
        $data = $this->subscriptionRepository->findAll($companyId);
        return $data;
    }

    public function calculateAccountPlansByCompany(string $company_id)
    {
        $data = $this->subscriptionRepository->calculateAccountPlansByCompany($company_id);
        if (!$data) {
            $res = new Response();
            $res->code = 500;
            $res->error_code = "ACCOUNT-PLANS-GET";
            $res->send();
        }

        $freeSlots = $data["total_limit"] - $data["active_users_count"] - $data["active_invites_count"];

        $data["free_account_slots"] = $freeSlots;

        return $data;
    }

    public function createSubscription(int $months, string $companyId, string $transactionId)
    {
        $dates = $this->calculateStartAndEndDates($months);
        $id = Crypto::UUID4();

        $rows = [
            [
                "subscription_id" => $id,
                "subscription_type" => "basic",
                "users_limit" => 100,
                "subscription_st_date" => $dates["startDate"],
                "subscription_en_date" => $dates["endDate"],
                "company_id" => $companyId,
                "transaction_id" => $transactionId
            ]
        ];
        $res = $this->subscriptionRepository->store($rows);
        return $res ? $id : null;
    }

    private function calculateStartAndEndDates(int $months)
    {
        $startDate = $this->calculateStartDate();
        $endDate = (new DateTime($startDate, new DateTimeZone('UTC')))->modify("+$months months")->format('Y-m-d');

        return [
            "startDate" => $startDate,
            "endDate" => $endDate
        ];
    }

    private function calculateStartDate()
    {
        $user = Router::getInstance()->user;
        $subscriptions = $this->subscriptionRepository->findAll($user["company_id"]);
        $latestEndDate = $subscriptions[0]["subscription_en_date"];

        $today = (new DateTime('now', new DateTimeZone('UTC')))->format('Y-m-d');

        return ($latestEndDate >= $today) ? $latestEndDate : $today;
    }





}