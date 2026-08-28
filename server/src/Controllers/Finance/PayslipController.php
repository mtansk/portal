<?php
namespace Mtansk\Cp\Controllers\Finance;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Models\Finance\PayslipModel;
use Mtansk\Cp\Services\Finance\TaxService;
use Mtansk\Cp\Services\Finance\PayslipService;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Services\Finance\SocialFeeService;
use Mtansk\Cp\Services\Finance\TaxDeductionService;

class PayslipController
{

    private PayslipService $payslipService;
    private TaxService $taxService;
    private TaxDeductionService $taxDeductionService;
    private SocialFeeService $socialFeeService;

    public function __construct(
        PayslipService $payslipService,
        TaxService $taxService,
        TaxDeductionService $taxDeductionService,
        SocialFeeService $socialFeeService
    ) {
        $this->payslipService = $payslipService;
        $this->taxService = $taxService;
        $this->taxDeductionService = $taxDeductionService;
        $this->socialFeeService = $socialFeeService;
    }

    public function index()
    {
        $searchParams = new SearchParams($_GET);
        $data = $this->payslipService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function show($id)
    {
        $data = $this->payslipService->findById($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function update(string $id)
    {
        $json = Router::getInstance()->json;
        $payslip = new PayslipModel($json);
        $data = $this->payslipService->update($payslip, $id, $json);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function store()
    {
        $data = $this->payslipService->createFromJson();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function destroy(string $id)
    {
        $data = $this->payslipService->delete($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function createAutoPayslips()
    {
        $json = Router::getInstance()->json;
        $ids = $json["user_ids"] ?? [];

        $data = $this->payslipService->autoCreate($ids, $json);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function findMy()
    {
        $user = Router::getInstance()->user;
        $getCopy = $_GET;
        $getCopy["user_id"] = $user["user_id"];
        $searchParams = new SearchParams($getCopy);
        $data = $this->payslipService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function showMy($id)
    {
        $user = Router::getInstance()->user;
        $getCopy = $_GET;
        $getCopy["user_id"] = $user["user_id"];
        $searchParams = new SearchParams($getCopy);
        $data = $this->payslipService->findById($id, $searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }





    // objects

    public function findTaxesByPayslipId()
    {
        $payslip_id = $_GET['payslip_id'];
        $data = $this->taxService->findByPayslipId($payslip_id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function findTaxDeductionsByPayslipId()
    {
        $payslip_id = $_GET['payslip_id'];
        $data = $this->taxDeductionService->findByPayslipId($payslip_id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function findSocialFeesByPayslipId()
    {
        $payslip_id = $_GET['payslip_id'];
        $data = $this->socialFeeService->findByPayslipId($payslip_id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }



    public function findMyTaxes()
    {
        $user = Router::getInstance()->user;
        $getCopy = $_GET;
        $getCopy["user_id"] = $user["user_id"];
        $searchParams = new SearchParams($getCopy);
        $data = $this->taxService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function findMyTaxDeductions()
    {
        $user = Router::getInstance()->user;
        $getCopy = $_GET;
        $getCopy["user_id"] = $user["user_id"];
        $searchParams = new SearchParams($getCopy);
        $data = $this->taxDeductionService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function findMySocialFees()
    {
        $user = Router::getInstance()->user;
        $getCopy = $_GET;
        $getCopy["user_id"] = $user["user_id"];
        $searchParams = new SearchParams($getCopy);
        $data = $this->socialFeeService->findAll($searchParams);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

}