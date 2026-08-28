<?php
namespace Mtansk\Cp\Services\RateLimiters;

use Mtansk\Cp\Helpers\Redis\Redis;
use Mtansk\Cp\Helpers\Response\Response;

class CodeLimitService
{

    public function __construct()
    {
    }

    public function setRedisIncrement(string $subjectId, string $typeOfAction)
    {
        $redis = Redis::getInstance();
        $dailyKey = "daily_{$typeOfAction}_{$subjectId}";
        $minuteKey = "minute_{$typeOfAction}_{$subjectId}";

        $redis->incr($dailyKey);
        if ($redis->ttl($dailyKey) === -1) {
            $redis->expire($dailyKey, 86400);
        }

        $redis->incr($minuteKey);
        if ($redis->ttl($minuteKey) === -1) {
            $redis->expire($minuteKey, 55);
        }
    }

    public function validateRequestRate(string $subjectId, string $typeOfAction)
    {
        $redis = Redis::getInstance();
        $dailyKey = "daily_{$typeOfAction}_{$subjectId}";
        $minuteKey = "minute_{$typeOfAction}_{$subjectId}";

        $dailyCount = $redis->get($dailyKey);
        $minuteCount = $redis->get($minuteKey);

        if ($dailyCount >= 30) {
            $res = new Response();
            $res->code = 429;
            $res->error_code = "AUTH-CODE-LIMIT";
            $res->send();
        }

        if ($minuteCount >= 15) {
            $res = new Response();
            $res->code = 429;
            $res->error_code = "AUTH-CODE-EARLY";
            $res->send();
        }
    }

    public function setAndCheckRestoreIncrement(string $email)
    {
        $redis = Redis::getInstance();
        $key = "restore_{$email}";

        $dailyCount = $redis->get($key);
        if ($dailyCount >= 5) {
            $res = new Response();
            $res->code = 429;
            $res->error_code = "LIMIT-RESTORE";
            $res->send();
        }

        $redis->incr($key);
        if ($redis->ttl($key) === -1) {
            $redis->expire($key, 86400);
        }
    }







}