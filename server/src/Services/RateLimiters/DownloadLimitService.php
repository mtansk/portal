<?php
namespace Mtansk\Cp\Services\RateLimiters;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Redis\Redis;
use Mtansk\Cp\Helpers\Response\Response;

class DownloadLimitService
{


    public function __construct()
    {
    }

    public function writeAndCheck()
    {
        $user = Router::getInstance()->user;
        $companyId = $user["company_id"];

        $redis = Redis::getInstance();
        $dailyKey = "download_{$companyId}";

        $dailyCount = $redis->get($dailyKey);
        if ($dailyCount >= 7) {
            $res = new Response();
            $res->code = 429;
            $res->error_code = "LIMIT-DOWNLOAD";
            $res->send();
        }

        $redis->incr($dailyKey);
        if ($redis->ttl($dailyKey) === -1) {
            $redis->expire($dailyKey, 86400);
        }
    }
}