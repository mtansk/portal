<?php
namespace Mtansk\Cp\Services\Finance;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Models\Finance\ReductionModel;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Repositories\Finance\ReductionRepository;

class ReductionService
{
    private ReductionRepository $reductionRepository;

    public function __construct(ReductionRepository $reductionRepository)
    {
        $this->reductionRepository = $reductionRepository;
    }

    public function findAll(?SearchParams $searchParams = null)
    {
        return $this->reductionRepository->findAll($searchParams);
    }

    public function findById(string $id)
    {
        return $this->reductionRepository->findById($id);
    }

    public function update(ReductionModel $reduction, string $id)
    {
        $res = $this->reductionRepository->update($reduction, $id);
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

    public function create(array $inputReductions)
    {
        $user = Router::getInstance()->user;

        $ids = [];
        $rows = [];

        foreach ($inputReductions as $inputRed) {
            $payment = new ReductionModel($inputRed);

            $id = Crypto::UUID4();
            $ids[] = $id;

            $rows[] = [
                "user_id" => $payment->user_id,
                "reduction_date" => $payment->reduction_date,
                $id,
                "reduction_name" => $payment->reduction_name,
                "reduction_rate" => $payment->reduction_rate,
                "reduction_qty" => $payment->reduction_qty,
                "reduction_desc" => $payment->reduction_desc,
                "debt_id" => $payment->debt_id,
                "payslip_id" => $payment->payslip_id,
                "company_id" => $user["company_id"]
            ];
        }

        $res = $this->reductionRepository->create($rows);
        $data = [
            "count" => $res,
            "ids" => $ids
        ];

        return $data;
    }

    public function delete(string $id)
    {
        $res = $this->reductionRepository->delete($id);
        $data = [
            "count" => $res,
            "id" => $id
        ];
        return $data;
    }


}