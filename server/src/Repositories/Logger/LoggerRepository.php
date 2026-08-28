<?php
namespace Mtansk\Cp\Repositories\Logger;


use Mtansk\Cp\Helpers\DB\POSTQueryNew;

class LoggerRepository
{
    public function __construct()
    {
    }


    public function createLog(array $rows)
    {
        $sql = "INSERT INTO logs.object_logs(
                    log_id,
                    object,
                    action,
                    user_id,
                    json,
                    description,
                    author_id
                )
                VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }



}
