<?php
namespace Mtansk\Cp\Services\Finance;

use Mtansk\Cp\Helpers\DB\PDOConnection;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Models\Finance\PayslipModel;
use Mtansk\Cp\Repositories\Finance\PayslipRepository;
use Mtansk\Cp\Routes\Router;

class PayslipService
{

    private PayslipRepository $payslipRepository;
    private TaxService $taxService;
    private TaxDeductionService $taxDeductionService;
    private SocialFeeService $socialFeeService;
    private PaymentService $paymentService;



    public function __construct(
        PayslipRepository $payslipRepository,
        TaxService $taxService,
        TaxDeductionService $taxDeductionService,
        SocialFeeService $socialFeeService,
        PaymentService $paymentService
    ) {
        $this->payslipRepository = $payslipRepository;
        $this->taxService = $taxService;
        $this->taxDeductionService = $taxDeductionService;
        $this->socialFeeService = $socialFeeService;
        $this->paymentService = $paymentService;
    }

    public function findAll(?SearchParams $searchParams = null)
    {
        return $this->payslipRepository->findAll($searchParams);
    }

    public function findById(string $id, ?SearchParams $searchParams = null)
    {
        return $this->payslipRepository->findById($id, $searchParams);
    }

    public function update(PayslipModel $payslip, string $id, array $payslipObjects)
    {
        $pdo = PDOConnection::getInstance()->getConnection();
        $pdo->beginTransaction();

        $payslipSelfUpdateRes = $this->payslipRepository->update($payslip, $id);
        $res = $this->createPayslipObjects($payslipObjects, $id);

        $this->selectPayslipObjects($payslipObjects, $id);
        $this->removePayslipObjects($payslipObjects);

        PDOConnection::commit();

        return [
            [
                "count1" => $payslipSelfUpdateRes,
                "count2" => $res
            ]
        ];
    }


    public function createFromJson()
    {
        $json = Router::getInstance()->json;
        return $this->create($json);
    }
    public function create(array $inputPayslip)
    {
        $pdo = PDOConnection::getInstance()->getConnection();
        $pdo->beginTransaction();

        $user = Router::getInstance()->user;
        $payslipModel = new PayslipModel($inputPayslip);

        $payslip_id = Crypto::UUID4();
        $rows = [
            [
                $payslip_id,
                $payslipModel->payslip_name,
                $payslipModel->payslip_date,
                $payslipModel->payslip_st_date,
                $payslipModel->payslip_en_date,
                $payslipModel->user_id,
                $user["company_id"]
            ]
        ];
        $res = $this->payslipRepository->create($rows);
        if (!$res) {
            $response = new Response();
            $response->code = 500;
            $response->error_code = "PAYSLIP-CREATE";
            $response->send();
        }

        $createRes = $this->createPayslipObjects($inputPayslip, $payslip_id);
        $selectRes = $this->selectPayslipObjects($inputPayslip, $payslip_id);

        PDOConnection::commit();
        $data = [
            [
                "count" => $res,
                "id" => $payslip_id,
                "createRes" => $createRes,
                "selectRes" => $selectRes
            ]
        ];

        return $data;
    }

    public function delete(string $id)
    {
        $pdo = PDOConnection::getInstance()->getConnection();
        $pdo->beginTransaction();

        $user = Router::getInstance()->user;

        $res = $this->payslipRepository->delete($id);
        $this->removeAndDeleteAllPayslipObjects($id);

        PDOConnection::commit();

        return [
            [
                "count" => $res
            ]
        ];
    }

    public function autoCreate(array $ids, array $options)
    {
        PDOConnection::beginTransaction();

        $payslipIds = [];
        foreach ($ids as $id) {
            $id = $this->autoCreateForUser($id, $options);
            $payslipIds[] = $id;
        }

        PDOConnection::commit();

        $data = [
            [
                "ids" => $payslipIds
            ]
        ];

        return $data;
    }

    public function autoCreateForUser(string $user_id, array $options)
    {
        PDOConnection::beginTransaction();

        $st_date = $options["st_date"] ?? null;
        $en_date = $options["en_date"] ?? null;
        $date = $options["date"] ?? null;

        $payslipFields = [
            "payslip_name" => "Автоматический расчетный лист",
            "payslip_st_date" => $st_date,
            "payslip_en_date" => $en_date,
            "payslip_date" => $date,
            "user_id" => $user_id
        ];

        $model = new PayslipModel($payslipFields);
        $payslip_id = Crypto::UUID4();
        $user = Router::getInstance()->user;

        $rows = [
            [
                $payslip_id,
                $model->payslip_name,
                $model->payslip_date,
                $model->payslip_st_date,
                $model->payslip_en_date,
                $user_id,
                $user["company_id"],
            ]
        ];
        $res = $this->payslipRepository->create($rows);
        if (!$res) {
            $response = new Response();
            $response->code = 500;
            $response->error_code = "PAYSLIP-CREATE";
            $response->send();
        }

        $this->addAllActiveObjectsToPayslip($model, $payslip_id, $user_id);

        return $payslip_id;
    }







    public function createPayslipObjects(array $json, string $payslip_id)
    {
        $addedObjects = $json["addedObjects"] ?? [];

        $res1 = $this->taxService->create($addedObjects["tax"] ?? [], $payslip_id);
        $res2 = $this->taxDeductionService->create($addedObjects["taxDeduction"] ?? [], $payslip_id);
        $res3 = $this->socialFeeService->create($addedObjects["socialFee"] ?? [], $payslip_id);
        $res4 = $this->paymentService->create($addedObjects["payment"] ?? [], $payslip_id);

        return [
            "tax" => $res1,
            "taxDeduction" => $res2,
            "socialFee" => $res3,
            "payment" => $res4
        ];
    }
    public function selectPayslipObjects(array $json, string $payslip_id)
    {
        $selectedObjects = $json["selectedObjects"] ?? [];

        $res1 = $this->payslipRepository->setObjectsPayslipID("accruals", "accrual", $selectedObjects["accrual"] ?? [], $payslip_id);
        $res2 = $this->payslipRepository->setObjectsPayslipID("sheets", "sheet", $selectedObjects["accrual"] ?? [], $payslip_id);
        $res3 = $this->payslipRepository->setObjectsPayslipID("reductions", "reduction", $selectedObjects["reduction"] ?? [], $payslip_id);
        $res4 = $this->payslipRepository->setObjectsPayslipID("payments", "payment", $selectedObjects["payment"] ?? [], $payslip_id);

        return [
            "accrual" => $res1,
            "sheet" => $res2,
            "reduction" => $res3,
            "payment" => $res4
        ];
    }
    public function removePayslipObjects(array $json)
    {
        $removedObjects = $json["removedObjects"] ?? [];

        $this->payslipRepository->setObjectsPayslipID("accruals", "accrual", $removedObjects["accrual"] ?? [], null);
        $this->payslipRepository->setObjectsPayslipID("sheets", "sheet", $removedObjects["accrual"] ?? [], null);
        $this->payslipRepository->setObjectsPayslipID("reductions", "reduction", $removedObjects["reduction"] ?? [], null);
        $this->payslipRepository->setObjectsPayslipID("payments", "payment", $removedObjects["payment"] ?? [], null);

        $this->payslipRepository->deleteObjectsByIds("taxes", "tax", $removedObjects["tax"] ?? []);
        $this->payslipRepository->deleteObjectsByIds("tax_deductions", "tax_deduction", $removedObjects["taxDeduction"] ?? []);
        $this->payslipRepository->deleteObjectsByIds("social_fees", "social_fee", $removedObjects["socialFee"] ?? []);
    }
    public function removeAndDeleteAllPayslipObjects(string $payslip_id)
    {
        $this->payslipRepository->removeAllPayslipObjects("accruals", $payslip_id);
        $this->payslipRepository->removeAllPayslipObjects("sheets", $payslip_id);
        $this->payslipRepository->removeAllPayslipObjects("reductions", $payslip_id);
        $this->payslipRepository->removeAllPayslipObjects("payments", $payslip_id);

        $this->payslipRepository->deleteAllPayslipObjects("taxes", $payslip_id);
        $this->payslipRepository->deleteAllPayslipObjects("tax_deductions", $payslip_id);
        $this->payslipRepository->deleteAllPayslipObjects("social_fees", $payslip_id);
    }
    public function addAllActiveObjectsToPayslip(
        PayslipModel $payslip,
        string $payslip_id,
        string $user_id
    ) {
        $this->payslipRepository->addAllActiveObjectsToPayslip("accruals", "accrual", $payslip, $payslip_id, $user_id);
        $this->payslipRepository->addAllActiveObjectsToPayslip("sheets", "sheet", $payslip, $payslip_id, $user_id);
        $this->payslipRepository->addAllActiveObjectsToPayslip("reductions", "reduction", $payslip, $payslip_id, $user_id);
        $this->payslipRepository->addAllActiveObjectsToPayslip("payments", "payment", $payslip, $payslip_id, $user_id);
    }



}