<?php
namespace Mtansk\Cp\Services\Logger;

use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Models\Logger\LogModel;
use Mtansk\Cp\Repositories\Logger\LoggerRepository;
use Mtansk\Cp\Routes\Router;

class LoggerService
{

    private LoggerRepository $loggerRepository;

    public function __construct()
    {
        $this->loggerRepository = new LoggerRepository();
    }

    public function createLog(LogModel $logModel)
    {
        $user = Router::getInstance()->user;

        $logId = Crypto::UUID4();
        $rows = [
            [
                "log_id" => $logId,
                "object" => $logModel->object,
                "action" => $logModel->action,
                "user_id" => $logModel->user_id,
                "json" => $logModel->json,
                "description" => $logModel->description,
                "author_id" => $user ? $user["user_id"] : "system"
            ]
        ];

        return $this->loggerRepository->createLog($rows);
    }


}