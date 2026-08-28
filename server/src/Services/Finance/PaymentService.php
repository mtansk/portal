<?php
namespace Mtansk\Cp\Services\Finance;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Models\Finance\PaymentModel;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Repositories\Finance\PaymentRepository;

class PaymentService
{

    private PaymentRepository $paymentRepository;

    public function __construct(PaymentRepository $paymentRepository)
    {
        $this->paymentRepository = $paymentRepository;
    }

    public function findAll(?SearchParams $searchParams)
    {
        return $this->paymentRepository->findAll($searchParams);
    }

    public function find($id)
    {
        return $this->paymentRepository->findById($id);
    }

    public function update(PaymentModel $payment, string $id)
    {
        $res = $this->paymentRepository->update($payment, $id);
        $data = [
            "count" => $res,
            "id" => $id
        ];
        return $data;
    }

    public function delete(string $id)
    {
        $res = $this->paymentRepository->delete($id);
        $data = [
            "count" => $res,
            "id" => $id
        ];
        return $data;
    }

    public function createFromJson()
    {
        $json = Router::getInstance()->json;
        return $this->create($json);
    }

    public function create(array $inputPayments, ?string $payslip_id = null)
    {
        if (!$inputPayments) {
            return [
                "count" => 0,
                "ids" => []
            ];
        }
        $user = Router::getInstance()->user;

        $ids = [];
        $rows = [];

        foreach ($inputPayments as $inputPayment) {
            if ($payslip_id) {
                $inputPayment["payslip_id"] = $payslip_id;
            }
            $payment = new PaymentModel($inputPayment);

            $id = Crypto::UUID4();
            $ids[] = $id;

            $rows[] = [
                "user_id" => $payment->user_id,
                "payment_date" => $payment->payment_date,
                "payment_id" => $id,
                "payment_name" => $payment->payment_name,
                "payment_rate" => $payment->payment_rate,
                "payment_qty" => $payment->payment_qty,
                "payment_desc" => $payment->payment_desc,
                "payslip_id" => $payment->payslip_id,
                "company_id" => $user["company_id"],
            ];
        }

        $res = $this->paymentRepository->create($rows);
        $data = [
            "count" => $res,
            "ids" => $ids
        ];

        return $data;
    }






}