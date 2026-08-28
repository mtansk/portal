<?php
namespace Mtansk\Cp\Controllers\Access;

use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Services\Access\SubscriptionService;

class SubscriptionController
{

    private SubscriptionService $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    public function findAll()
    {
        $user = Router::getInstance()->user;
        $data = $this->subscriptionService->findAll($user["company_id"]);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function findAndCalculateAccountPlans()
    {
        $user = Router::getInstance()->user;
        $data = $this->subscriptionService->calculateAccountPlansByCompany($user["company_id"]);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }
}