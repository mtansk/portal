<?php
namespace Mtansk\Cp\Services\Finance;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Models\Finance\AccrualModel;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Repositories\Finance\AccrualRepository;

class AccrualService
{

    private AccrualRepository $accrualRepository;

    public function __construct(AccrualRepository $accrualRepository)
    {
        $this->accrualRepository = $accrualRepository;
    }

    public function findAll(?SearchParams $searchParams = null)
    {
        return $this->accrualRepository->findAll($searchParams);
    }

    public function findById(string $id)
    {
        return $this->accrualRepository->findById($id);
    }

    public function update(AccrualModel $accrual, string $id)
    {
        $res = $this->accrualRepository->update($accrual, $id);
        $data = [
            [
                "id" => $id,
                "count" => $res
            ]
        ];

        return $data;
    }

    public function delete(string $id)
    {
        $res = $this->accrualRepository->delete($id);
        $data = [
            [
                "id" => $id,
                "count" => $res
            ]
        ];

        return $data;
    }

    public function createFromJson()
    {
        $json = Router::getInstance()->json;
        $user = Router::getInstance()->user;

        $ids = [];
        $rows = [];

        foreach ($json as $accrual) {
            $model = new AccrualModel($accrual);
            $id = Crypto::UUID4();
            $ids[] = $id;

            $rows[] = [
                $model->user_id,
                $model->accrual_date,
                $id,
                $model->accrual_name,
                $model->accrual_rate,
                $model->accrual_qty,
                $model->accrual_desc,
                $model->accrual_group_id,
                $model->payslip_id,
                $user["company_id"]
            ];
        }

        $res = $this->accrualRepository->create($rows);
        $data = [
            [
                "count" => $res,
                "id" => $ids
            ]
        ];

        return $data;


    }







}