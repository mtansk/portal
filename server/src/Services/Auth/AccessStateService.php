<?php
namespace Mtansk\Cp\Services\Auth;

use Mtansk\Cp\Helpers\Redis\Redis;
use Mtansk\Cp\Repositories\Auth\AccessStateRepository;

class AccessStateService
{

    private AccessStateRepository $accessStateRepository;

    public function __construct(AccessStateRepository $accessStateRepository)
    {
        $this->accessStateRepository = $accessStateRepository;
    }

    public function getCachedAccessState(string $user_id): ?array
    {
        $redis = Redis::getInstance();
        $key = "access_state_{$user_id}";
        $cachedState = $redis->get($key);
        if ($cachedState) {
            return json_decode($cachedState, true);
        }

        $freshData = $this
            ->accessStateRepository
            ->getUserAccessData($user_id);
        $accessState = $this
            ->calculateAccessStateFromData($freshData);

        $redis->setex($key, 15, json_encode($accessState));
        return $accessState;
    }
    private function calculateAccessStateFromData(?array $data)
    {
        if (!$data) {
            return [
                "access_level" => "guest",
                "access_state" => "none",
                "company_id" => null,
                "user_id" => null,
                "account_id" => null,
                "credentials_changed" => null
            ];
        }


        $access_level = $data["access_level"] ?? "guest";
        $account_status = $data["account_status"] ?? null;
        $user_deleted_at = $data["user_deleted_at"] ?? null;
        $company_deleted_at = $data["company_deleted_at"] ?? null;
        $account_deleted_at = $data["account_deleted_at"] ?? null;
        $subscription_type = $data["subscription_type"] ?? null;

        if ($company_deleted_at) {
            return [
                "access_level" => $access_level,
                "access_state" => "download-only",
                "company_id" => $data["company_id"],
                "user_id" => $data["user_id"],
                "account_id" => $data["account_id"],
                "credentials_changed" => $data["credentials_changed"]
            ];
        }

        if ($user_deleted_at) {
            return [
                "access_level" => $access_level,
                "access_state" => "download-only",
                "company_id" => $data["company_id"],
                "user_id" => $data["user_id"],
                "account_id" => $data["account_id"],
                "credentials_changed" => $data["credentials_changed"]
            ];
        }

        if (!$subscription_type) {
            return [
                "access_level" => $access_level,
                "access_state" => "sub-expired",
                "company_id" => $data["company_id"],
                "user_id" => $data["user_id"],
                "account_id" => $data["account_id"],
                "credentials_changed" => $data["credentials_changed"]
            ];
        }

        if ($account_status === "suspended") {
            return [
                "access_level" => $access_level,
                "access_state" => "download-only",
                "company_id" => $data["company_id"],
                "user_id" => $data["user_id"],
                "account_id" => $data["account_id"],
                "credentials_changed" => $data["credentials_changed"]
            ];
        }

        return [
            "access_level" => $access_level,
            "access_state" => "active",
            "company_id" => $data["company_id"],
            "user_id" => $data["user_id"],
            "account_id" => $data["account_id"],
            "credentials_changed" => $data["credentials_changed"]
        ];

    }






}