<?php
namespace Mtansk\Cp\Services\Finance;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Models\Finance\SocialFeeModel;
use Mtansk\Cp\Repositories\Finance\SocialFeeRepository;

class SocialFeeService
{

    private SocialFeeRepository $socialFeeRepository;

    public function __construct(SocialFeeRepository $socialFeeRepository)
    {
        $this->socialFeeRepository = $socialFeeRepository;
    }

    public function findByPayslipId(string $payslip_id)
    {
        return $this->socialFeeRepository->findByPayslipId($payslip_id);
    }

    public function create(array $inputTaxes, ?string $payslip_id = null)
    {
        if (!$inputTaxes) {
            return [
                "count" => 0,
                "ids" => []
            ];
        }
        $user = Router::getInstance()->user;

        $ids = [];
        $rows = [];

        foreach ($inputTaxes as $taxObject) {
            if ($payslip_id) {
                $taxObject["payslip_id"] = $payslip_id;
            }
            $tax = new SocialFeeModel($taxObject);

            $id = Crypto::UUID4();
            $ids[] = $id;

            $rows[] = [
                "tax_id" => $id,
                "tax_name" => $tax->name,
                "tax_rate" => $tax->rate,
                "tax_qty" => $tax->qty,
                "is_round" => $tax->is_round,
                "payslip_id" => $tax->payslip_id,
                "company_id" => $user["company_id"]
            ];
        }

        $res = $this->socialFeeRepository->create($rows);
        $data = [
            "count" => $res,
            "ids" => $ids
        ];

        return $data;
    }

    public function findAll(?SearchParams $searchParams)
    {
        return $this->socialFeeRepository->findAll($searchParams);
    }


}