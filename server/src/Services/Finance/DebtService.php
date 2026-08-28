<?php
namespace Mtansk\Cp\Services\Finance;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Helpers\DB\PDOConnection;
use Mtansk\Cp\Models\Finance\DebtModel;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Repositories\Finance\DebtRepository;

class DebtService
{
    private DebtRepository $debtRepository;

    public function __construct(DebtRepository $debtRepository)
    {
        $this->debtRepository = $debtRepository;
    }

    public function findAll(?SearchParams $searchParams = null)
    {
        return $this->debtRepository->findAll($searchParams);
    }

    public function findById(string $id, ?SearchParams $searchParams = null)
    {
        return $this->debtRepository->findById($id, $searchParams);
    }

    public function update(DebtModel $debtModel, string $id)
    {
        $res = $this->debtRepository->update($debtModel, $id);
        $data = [
            [
                "count" => $res,
                "id" => $id
            ]
        ];
        return $data;
    }

    public function createFromJson()
    {
        $json = Router::getInstance()->json;
        return $this->create($json);
    }

    public function create(array $inputDebt)
    {
        $user = Router::getInstance()->user;
        $debtModel = new DebtModel($inputDebt);

        $debt_id = Crypto::UUID4();

        $rows = [
            [
                "debt_id" => $debt_id,
                "debt_date" => $debtModel->debt_date,
                "debt_name" => $debtModel->debt_name,
                "debt_total" => $debtModel->debt_total,
                "is_settled" => $debtModel->is_settled,
                "debt_desc" => $debtModel->debt_desc,
                "user_id" => $debtModel->user_id,
                "company_id" => $user["company_id"],
            ]
        ];

        $res = $this->debtRepository->create($rows);
        $data = [
            [
                "count" => $res,
                "id" => $debt_id
            ]
        ];
        return $data;
    }

    public function delete(string $id)
    {
        PDOConnection::beginTransaction();

        $resDelete = $this->debtRepository->delete($id);
        $resRemove = $this->debtRepository->removeAllReductionsFromDebt($id);

        PDOConnection::commit();

        return [
            [
                "deleted" => $resDelete,
                "reductionsRemoved" => $resRemove,
                "id" => $id
            ]
        ];
    }
}