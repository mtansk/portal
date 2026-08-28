<?php
namespace Mtansk\Cp\Helpers\Redis;

use Predis\Client;


class Redis
{
    private static ?Client $instance = null;

    private function __construct()
    {
    }

    public static function getInstance(): Client
    {
        if (self::$instance === null) {
            $host = redisHost;
            $port = redisPort;
            $password = redisPassword;


            self::$instance = new Client([
                'scheme' => 'tcp',
                'host' => $host,
                'port' => $port,
                'password' => $password,
            ]);
        }

        return self::$instance;
    }
}
