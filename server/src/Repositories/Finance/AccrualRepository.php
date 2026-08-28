<?php
namespace Mtansk\Cp\Repositories\Finance;

use Mtansk\Cp\Models\Logger\LogModel;
use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;
use Mtansk\Cp\Models\Finance\AccrualModel;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Services\Logger\LoggerService;

class AccrualRepository
{
    private LoggerService $loggerService;

    public function __construct(LoggerService $loggerService)
    {
        $this->loggerService = $loggerService;
    }


    public function findAll(?SearchParams $searchParams = null)
    {
        $user = Router::getInstance()->user;

        $efo = GETQueryNew::addEFOFields("accrual");
        $joins = GETQueryNew::userJoins("accruals");
        $now = GETQueryNew::addNow();
        $joinFields = GETQueryNew::userJoinsFields();
        $rate = GETQueryNew::trim("accrual_rate", "accruals", );
        $qty = GETQueryNew::trim("accrual_qty", "accruals", );

        $sql = "SELECT 
                    accruals.accrual_id, 
                    accruals.accrual_date, 
                    accruals.accrual_time,
                    accruals.accrual_group_id, 
                    accruals.accrual_name, 
                    {$rate},
                    {$qty},
                    accruals.accrual_total, 
                    accruals.accrual_desc, 
                    accruals.user_id, 
                    accruals.payslip_id, 
                    accruals.company_id, 
                    accruals.created_at, 
                    accruals.deleted_at, 

                    accrual_groups.accrual_group_name,

                    {$joinFields},

                    {$now},

                    {$efo}
                FROM accruals 
                LEFT JOIN accrual_groups ON accruals.accrual_group_id = accrual_groups.accrual_group_id
                {$joins}
                WHERE accruals.company_id=:company_id ";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "accruals", "accrual");
        $get->searchParams = $searchParams;
        $get->afterQuery = " ORDER BY accruals.accrual_date";
        $get->prepare();
        /*        var_dump($get->sql); */
        $data = $get->execute();
        return $data;
    }

    public function findById(string $id)
    {
        $user = Router::getInstance()->user;

        $efo = GETQueryNew::addEFOFields("accrual");
        $joins = GETQueryNew::userJoins("accruals");
        $now = GETQueryNew::addNow();
        $joinFields = GETQueryNew::userJoinsFields();
        $rate = GETQueryNew::trim("accrual_rate", "accruals", );
        $qty = GETQueryNew::trim("accrual_qty", "accruals", );

        $sql = "SELECT 
                    accruals.accrual_id, 
                    accruals.accrual_date, 
                    accruals.accrual_time,
                    accruals.accrual_group_id, 
                    accruals.accrual_name, 
                    {$rate},
                    {$qty},
                    accruals.accrual_total, 
                    accruals.accrual_desc, 
                    accruals.user_id, 
                    accruals.payslip_id, 
                    accruals.company_id, 
                    accruals.created_at, 
                    accruals.deleted_at, 

                    accrual_groups.accrual_group_name,

                    {$joinFields},

                    {$now},

                    {$efo}
                FROM accruals 
                LEFT JOIN accrual_groups ON accruals.accrual_group_id = accrual_groups.accrual_group_id
                {$joins}
                WHERE accruals.company_id=:company_id 
                AND accruals.accrual_id = :accrual_id";

        $bindings = [
            ":company_id" => $user["company_id"],
            ":accrual_id" => $id
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "accruals", "accrual");
        $data = $get->execute();
        return $data;
    }

    public function update(AccrualModel $accrual, string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "UPDATE accruals

 		SET accrual_date = :accrual_date,
		accrual_time = :accrual_time,
 		accrual_name = :accrual_name,
 		accrual_rate = :accrual_rate,
 		accrual_qty = :accrual_qty,
 		accrual_desc = :accrual_desc,
 		accrual_group_id = :accrual_group_id,
 		user_id = :user_id,
 		payslip_id = :payslip_id
        
 		WHERE accrual_id = :accrual_id
		AND company_id = :company_id";

        $bindings = [
            ":accrual_id" => $id,
            ":accrual_date" => $accrual->accrual_date,
            ":accrual_time" => $accrual->accrual_time,
            ":accrual_name" => $accrual->accrual_name,
            ":accrual_rate" => $accrual->accrual_rate,
            ":accrual_qty" => $accrual->accrual_qty,
            ":accrual_desc" => $accrual->accrual_desc,
            ":accrual_group_id" => $accrual->accrual_group_id,
            ":user_id" => $accrual->user_id,
            ":payslip_id" => $accrual->payslip_id,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();

        $this->logUpdate($bindings);

        return $res;
    }

    public function delete(string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "UPDATE accruals

	        SET deleted_at = NOW()

	        WHERE accrual_id = :accrual_id 
	        AND company_id = :company_id";

        $bindings = [
            ":accrual_id" => $id,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();

        $this->logDelete($bindings);

        return $res;
    }

    public function create(array $rows)
    {
        $sql = "INSERT INTO accruals 
			(user_id, 
			accrual_date,
			accrual_id, 
			accrual_name, 
			accrual_rate, 
			accrual_qty, 
			accrual_desc, 
			accrual_group_id, 
			payslip_id,
			company_id) 
			VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);

        $this->logCreate($rows);

        return $res;
    }


    private function logUpdate(array $bindings)
    {
        $log = new LogModel();
        $log->object = "accrual";
        $log->action = "update";
        $log->user_id = $bindings[":user_id"];
        $log->json = json_encode($bindings);
        $this->loggerService->createLog($log);
    }
    private function logCreate(array $rows)
    {
        $log = new LogModel();
        $log->object = "accrual";
        $log->action = "create";
        $log->user_id = null;
        $log->json = json_encode($rows);
        $this->loggerService->createLog($log);
    }
    private function logDelete(array $bindings)
    {
        $log = new LogModel();
        $log->object = "accrual";
        $log->action = "delete";
        $log->user_id = null;
        $log->json = json_encode($bindings);
        $this->loggerService->createLog($log);
    }

}