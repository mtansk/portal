<?php
namespace Mtansk\Cp\Services\Data;

use Mtansk\Cp\Repositories\Finance\PayslipRepository;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Repositories\Company\AccrualGroupRepository;
use Mtansk\Cp\Repositories\Company\DepartmentRepository;
use Mtansk\Cp\Repositories\Finance\AccrualRepository;
use Mtansk\Cp\Repositories\Finance\DebtRepository;
use Mtansk\Cp\Repositories\Finance\PaymentRepository;
use Mtansk\Cp\Repositories\Finance\ReductionRepository;
use Mtansk\Cp\Repositories\Finance\SocialFeeRepository;
use Mtansk\Cp\Repositories\Finance\TaxDeductionRepository;
use Mtansk\Cp\Repositories\Finance\TaxRepository;
use Mtansk\Cp\Repositories\Sheets\SheetRepository;
use Mtansk\Cp\Repositories\Users\UserRepository;
use Mtansk\Cp\Services\RateLimiters\DownloadLimitService;

class DownloadService
{
    private AccrualRepository $accrualRepository;
    private SheetRepository $sheetRepository;
    private ReductionRepository $reductionRepository;
    private PaymentRepository $paymentRepository;
    private PayslipRepository $payslipRepository;
    private TaxRepository $taxRepository;
    private TaxDeductionRepository $taxDeductionRepository;
    private SocialFeeRepository $socialFeeRepository;
    private DebtRepository $debtRepository;
    private AccrualGroupRepository $accrualGroupRepository;
    private UserRepository $userRepository;
    private DepartmentRepository $departmentRepository;

    private DownloadLimitService $downloadLimitService;


    public function __construct(
        AccrualRepository $accrualRepository,
        SheetRepository $sheetRepository,
        ReductionRepository $reductionRepository,
        PaymentRepository $paymentRepository,
        PayslipRepository $payslipRepository,
        TaxRepository $taxRepository,
        TaxDeductionRepository $taxDeductionRepository,
        SocialFeeRepository $socialFeeRepository,
        DebtRepository $debtRepository,
        AccrualGroupRepository $accrualGroupRepository,
        UserRepository $userRepository,
        DepartmentRepository $departmentRepository,
        DownloadLimitService $downloadLimitService
    ) {

        $this->accrualRepository = $accrualRepository;
        $this->sheetRepository = $sheetRepository;
        $this->reductionRepository = $reductionRepository;
        $this->paymentRepository = $paymentRepository;
        $this->payslipRepository = $payslipRepository;
        $this->taxRepository = $taxRepository;
        $this->taxDeductionRepository = $taxDeductionRepository;
        $this->socialFeeRepository = $socialFeeRepository;
        $this->debtRepository = $debtRepository;
        $this->accrualGroupRepository = $accrualGroupRepository;
        $this->userRepository = $userRepository;
        $this->departmentRepository = $departmentRepository;
        $this->downloadLimitService = $downloadLimitService;

    }



    public function downloadCustom()
    {
        $this->downloadLimitService->writeAndCheck();
        $searchParamsArray = [
            "start" => "2021-01-01",
            "end" => "2027-01-31",
            "show_deleted" => "true",
        ];
        $searchParams = new SearchParams($searchParamsArray);
        $deletedParams = new SearchParams(["show_deleted" => "true",]);

        $spreadsheet = new Spreadsheet();

        $this->writeAccruals($spreadsheet, $searchParams);
        $this->writeSheets($spreadsheet, $searchParams);
        $this->writeReductions($spreadsheet, $searchParams);
        $this->writePayments($spreadsheet, $searchParams);
        $this->writePayslips($spreadsheet, $searchParams);
        $this->writeTaxes($spreadsheet, $deletedParams);
        $this->writeTaxDeductions($spreadsheet, $deletedParams);
        $this->writeSocialFees($spreadsheet, $deletedParams);
        $this->writeDebts($spreadsheet);
        $this->writeAccrualGroups($spreadsheet);
        $this->writeUsers($spreadsheet, $deletedParams);
        $this->writeDepartments($spreadsheet);

        $writer = new Xlsx($spreadsheet);


        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="download_data.xlsx"');
        header('Cache-Control: max-age=0');

        // Отправляем файл на скачивание
        $writer->save('php://output');
    }

    private function writeAccruals(Spreadsheet &$spreadsheet, SearchParams $searchParams)
    {
        $accruals = $this->accrualRepository->findAll($searchParams);


        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle("Начисления");

        $sheet->setCellValue('A1', 'accrual_id');
        $sheet->setCellValue('B1', 'accrual_date');
        $sheet->setCellValue('C1', 'accrual_time');
        $sheet->setCellValue('D1', 'accrual_group_id');
        $sheet->setCellValue('E1', 'accrual_name');
        $sheet->setCellValue('F1', 'accrual_rate');
        $sheet->setCellValue('G1', 'accrual_qty');
        $sheet->setCellValue('H1', 'accrual_total');
        $sheet->setCellValue('I1', 'accrual_desc');
        $sheet->setCellValue('J1', 'user_id');
        $sheet->setCellValue('K1', 'payslip_id');
        $sheet->setCellValue('L1', 'company_id');
        $sheet->setCellValue('M1', 'created_at');
        $sheet->setCellValue('N1', 'deleted_at');
        $sheet->setCellValue('O1', 'accrual_group_name');
        $sheet->setCellValue('P1', 'first_name');
        $sheet->setCellValue('Q1', 'last_name');
        $sheet->setCellValue('R1', 'middle_name');
        $sheet->setCellValue('S1', 'user_title');
        $sheet->setCellValue('T1', 'department_id');
        $sheet->setCellValue('U1', 'department_name');

        $row = 2;
        foreach ($accruals as $accrual) {
            $sheet->setCellValue('A' . $row, $accrual['accrual_id']);
            $sheet->setCellValue('B' . $row, $accrual['accrual_date']);
            $sheet->setCellValue('C' . $row, $accrual['accrual_time']);
            $sheet->setCellValue('D' . $row, $accrual['accrual_group_id']);
            $sheet->setCellValue('E' . $row, $accrual['accrual_name']);
            $sheet->setCellValue('F' . $row, $accrual['accrual_rate']);
            $sheet->setCellValue('G' . $row, $accrual['accrual_qty']);
            $sheet->setCellValue('H' . $row, $accrual['accrual_total']);
            $sheet->setCellValue('I' . $row, $accrual['accrual_desc']);
            $sheet->setCellValue('J' . $row, $accrual['user_id']);
            $sheet->setCellValue('K' . $row, $accrual['payslip_id']);
            $sheet->setCellValue('L' . $row, $accrual['company_id']);
            $sheet->setCellValue('M' . $row, $accrual['created_at']);
            $sheet->setCellValue('N' . $row, $accrual['deleted_at']);
            $sheet->setCellValue('O' . $row, $accrual['accrual_group_name']);
            $sheet->setCellValue('P' . $row, $accrual['first_name']);
            $sheet->setCellValue('Q' . $row, $accrual['last_name']);
            $sheet->setCellValue('R' . $row, $accrual['middle_name']);
            $sheet->setCellValue('S' . $row, $accrual['user_title']);
            $sheet->setCellValue('T' . $row, $accrual['department_id']);
            $sheet->setCellValue('U' . $row, $accrual['department_name']);

            $row++;
        }

    }
    private function writeSheets(Spreadsheet &$spreadsheet, SearchParams $searchParams)
    {
        $sheets = $this->sheetRepository->findAll($searchParams);

        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle("Смены");

        $sheet->setCellValue('A1', 'sheet_id');
        $sheet->setCellValue('B1', 'sheet_date');
        $sheet->setCellValue('C1', 'sheet_p_st');
        $sheet->setCellValue('D1', 'sheet_p_en');
        $sheet->setCellValue('E1', 'break_dur_p');
        $sheet->setCellValue('F1', 'sheet_plus_day_p');
        $sheet->setCellValue('G1', 'sheet_f_st');
        $sheet->setCellValue('H1', 'sheet_f_en');
        $sheet->setCellValue('I1', 'break_dur_f');
        $sheet->setCellValue('J1', 'sheet_plus_day_f');
        $sheet->setCellValue('K1', 'sheet_payment_p');
        $sheet->setCellValue('L1', 'sheet_payment_f');
        $sheet->setCellValue('M1', 'use_f_payment');
        $sheet->setCellValue('N1', 'use_f_dur');
        $sheet->setCellValue('O1', 'use_overtime_dur');
        $sheet->setCellValue('P1', 'measure_type');
        $sheet->setCellValue('Q1', 'sheet_desc');
        $sheet->setCellValue('R1', 'sheet_overtime_time');
        $sheet->setCellValue('S1', 'sheet_overtime_total');
        $sheet->setCellValue('T1', 'sheet_total');
        $sheet->setCellValue('U1', 'sheet_total_dur');
        $sheet->setCellValue('V1', 'sheet_status');
        $sheet->setCellValue('W1', 'payslip_id');
        $sheet->setCellValue('X1', 'user_id');
        $sheet->setCellValue('Y1', 'created_at');
        $sheet->setCellValue('Z1', 'deleted_at');
        $sheet->setCellValue('AA1', 'company_id');
        $sheet->setCellValue('AB1', 'first_name');
        $sheet->setCellValue('AC1', 'last_name');
        $sheet->setCellValue('AD1', 'middle_name');
        $sheet->setCellValue('AE1', 'user_title');
        $sheet->setCellValue('AF1', 'department_id');
        $sheet->setCellValue('AG1', 'department_name');


        $row = 2;
        foreach ($sheets as $sheetData) {
            $sheet->setCellValue('A' . $row, $sheetData['sheet_id']);
            $sheet->setCellValue('B' . $row, $sheetData['sheet_date']);
            $sheet->setCellValue('C' . $row, $sheetData['sheet_p_st']);
            $sheet->setCellValue('D' . $row, $sheetData['sheet_p_en']);
            $sheet->setCellValue('E' . $row, $sheetData['break_dur_p']);
            $sheet->setCellValue('F' . $row, $sheetData['sheet_plus_day_p']);
            $sheet->setCellValue('G' . $row, $sheetData['sheet_f_st']);
            $sheet->setCellValue('H' . $row, $sheetData['sheet_f_en']);
            $sheet->setCellValue('I' . $row, $sheetData['break_dur_f']);
            $sheet->setCellValue('J' . $row, $sheetData['sheet_plus_day_f']);
            $sheet->setCellValue('K' . $row, $sheetData['sheet_payment_p']);
            $sheet->setCellValue('L' . $row, $sheetData['sheet_payment_f']);
            $sheet->setCellValue('M' . $row, $sheetData['use_f_payment']);
            $sheet->setCellValue('N' . $row, $sheetData['use_f_dur']);
            $sheet->setCellValue('O' . $row, $sheetData['use_overtime_dur']);
            $sheet->setCellValue('P' . $row, $sheetData['measure_type']);
            $sheet->setCellValue('Q' . $row, $sheetData['sheet_desc']);
            $sheet->setCellValue('R' . $row, $sheetData['sheet_overtime_time']);
            $sheet->setCellValue('S' . $row, $sheetData['sheet_overtime_total']);
            $sheet->setCellValue('T' . $row, $sheetData['sheet_total']);
            $sheet->setCellValue('U' . $row, $sheetData['sheet_total_dur']);
            $sheet->setCellValue('V' . $row, $sheetData['sheet_status']);
            $sheet->setCellValue('W' . $row, $sheetData['payslip_id']);
            $sheet->setCellValue('X' . $row, $sheetData['user_id']);
            $sheet->setCellValue('Y' . $row, $sheetData['created_at']);
            $sheet->setCellValue('Z' . $row, $sheetData['deleted_at']);
            $sheet->setCellValue('AA' . $row, $sheetData['company_id']);
            $sheet->setCellValue('AB' . $row, $sheetData['first_name']);
            $sheet->setCellValue('AC' . $row, $sheetData['last_name']);
            $sheet->setCellValue('AD' . $row, $sheetData['middle_name']);
            $sheet->setCellValue('AE' . $row, $sheetData['user_title']);
            $sheet->setCellValue('AF' . $row, $sheetData['department_id']);
            $sheet->setCellValue('AG' . $row, $sheetData['department_name']);

            $row++;
        }
    }
    private function writeReductions(Spreadsheet &$spreadsheet, SearchParams $searchParams)
    {
        $reductions = $this->reductionRepository->findAll($searchParams);

        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle("Удержания");

        $sheet->setCellValue('A1', 'reduction_id');
        $sheet->setCellValue('B1', 'reduction_date');
        $sheet->setCellValue('C1', 'reduction_name');
        $sheet->setCellValue('D1', 'reduction_rate');
        $sheet->setCellValue('E1', 'reduction_qty');
        $sheet->setCellValue('F1', 'reduction_total');
        $sheet->setCellValue('G1', 'reduction_desc');
        $sheet->setCellValue('H1', 'debt_id');
        $sheet->setCellValue('I1', 'debt_name');
        $sheet->setCellValue('J1', 'debt_total');
        $sheet->setCellValue('K1', 'debt_desc');
        $sheet->setCellValue('L1', 'debt_date');
        $sheet->setCellValue('M1', 'is_settled');
        $sheet->setCellValue('N1', 'user_id');
        $sheet->setCellValue('O1', 'payslip_id');
        $sheet->setCellValue('P1', 'company_id');
        $sheet->setCellValue('Q1', 'created_at');
        $sheet->setCellValue('R1', 'deleted_at');
        $sheet->setCellValue('S1', 'first_name');
        $sheet->setCellValue('T1', 'last_name');
        $sheet->setCellValue('U1', 'middle_name');
        $sheet->setCellValue('V1', 'user_title');
        $sheet->setCellValue('W1', 'department_id');
        $sheet->setCellValue('X1', 'department_name');

        $row = 2;
        foreach ($reductions as $reduction) {
            $sheet->setCellValue('A' . $row, $reduction['reduction_id']);
            $sheet->setCellValue('B' . $row, $reduction['reduction_date']);
            $sheet->setCellValue('C' . $row, $reduction['reduction_name']);
            $sheet->setCellValue('D' . $row, $reduction['reduction_rate']);
            $sheet->setCellValue('E' . $row, $reduction['reduction_qty']);
            $sheet->setCellValue('F' . $row, $reduction['reduction_total']);
            $sheet->setCellValue('G' . $row, $reduction['reduction_desc']);
            $sheet->setCellValue('H' . $row, $reduction['debt_id']);
            $sheet->setCellValue('I' . $row, $reduction['debt_name']);
            $sheet->setCellValue('J' . $row, $reduction['debt_total']);
            $sheet->setCellValue('K' . $row, $reduction['debt_desc']);
            $sheet->setCellValue('L' . $row, $reduction['debt_date']);
            $sheet->setCellValue('M' . $row, $reduction['is_settled']);
            $sheet->setCellValue('N' . $row, $reduction['user_id']);
            $sheet->setCellValue('O' . $row, $reduction['payslip_id']);
            $sheet->setCellValue('P' . $row, $reduction['company_id']);
            $sheet->setCellValue('Q' . $row, $reduction['created_at']);
            $sheet->setCellValue('R' . $row, $reduction['deleted_at']);
            $sheet->setCellValue('S' . $row, $reduction['first_name']);
            $sheet->setCellValue('T' . $row, $reduction['last_name']);
            $sheet->setCellValue('U' . $row, $reduction['middle_name']);
            $sheet->setCellValue('V' . $row, $reduction['user_title']);
            $sheet->setCellValue('W' . $row, $reduction['department_id']);
            $sheet->setCellValue('X' . $row, $reduction['department_name']);

            $row++;
        }
    }
    private function writePayments(Spreadsheet &$spreadsheet, SearchParams $searchParams)
    {
        $payments = $this->paymentRepository->findAll($searchParams);

        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle("Выплаты");

        $sheet->setCellValue('A1', 'payment_id');
        $sheet->setCellValue('B1', 'payment_date');
        $sheet->setCellValue('C1', 'payment_name');
        $sheet->setCellValue('D1', 'payment_rate');
        $sheet->setCellValue('E1', 'payment_qty');
        $sheet->setCellValue('F1', 'payment_total');
        $sheet->setCellValue('G1', 'payment_desc');
        $sheet->setCellValue('H1', 'payslip_id');
        $sheet->setCellValue('I1', 'user_id');
        $sheet->setCellValue('J1', 'company_id');
        $sheet->setCellValue('K1', 'created_at');
        $sheet->setCellValue('L1', 'deleted_at');
        $sheet->setCellValue('M1', 'first_name');
        $sheet->setCellValue('N1', 'last_name');
        $sheet->setCellValue('O1', 'middle_name');
        $sheet->setCellValue('P1', 'user_title');
        $sheet->setCellValue('Q1', 'department_id');
        $sheet->setCellValue('R1', 'department_name');

        $row = 2;
        foreach ($payments as $payment) {
            $sheet->setCellValue('A' . $row, $payment['payment_id']);
            $sheet->setCellValue('B' . $row, $payment['payment_date']);
            $sheet->setCellValue('C' . $row, $payment['payment_name']);
            $sheet->setCellValue('D' . $row, $payment['payment_rate']);
            $sheet->setCellValue('E' . $row, $payment['payment_qty']);
            $sheet->setCellValue('F' . $row, $payment['payment_total']);
            $sheet->setCellValue('G' . $row, $payment['payment_desc']);
            $sheet->setCellValue('H' . $row, $payment['payslip_id']);
            $sheet->setCellValue('I' . $row, $payment['user_id']);
            $sheet->setCellValue('J' . $row, $payment['company_id']);
            $sheet->setCellValue('K' . $row, $payment['created_at']);
            $sheet->setCellValue('L' . $row, $payment['deleted_at']);
            $sheet->setCellValue('M' . $row, $payment['first_name']);
            $sheet->setCellValue('N' . $row, $payment['last_name']);
            $sheet->setCellValue('O' . $row, $payment['middle_name']);
            $sheet->setCellValue('P' . $row, $payment['user_title']);
            $sheet->setCellValue('Q' . $row, $payment['department_id']);
            $sheet->setCellValue('R' . $row, $payment['department_name']);

            $row++;
        }
    }
    private function writePayslips(Spreadsheet &$spreadsheet, SearchParams $searchParams)
    {
        $payslips = $this->payslipRepository->findAll($searchParams);

        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle("Расчетные листы");

        $sheet->setCellValue('A1', 'payslip_id');
        $sheet->setCellValue('B1', 'payslip_date');
        $sheet->setCellValue('C1', 'payslip_name');
        $sheet->setCellValue('D1', 'payslip_st_date');
        $sheet->setCellValue('E1', 'payslip_en_date');
        $sheet->setCellValue('F1', 'user_id');
        $sheet->setCellValue('G1', 'created_at');
        $sheet->setCellValue('H1', 'deleted_at');
        $sheet->setCellValue('I1', 'company_id');
        $sheet->setCellValue('J1', 'accruals_total');
        $sheet->setCellValue('K1', 'sheets_total');
        $sheet->setCellValue('L1', 'reductions_total');
        $sheet->setCellValue('M1', 'taxes_total');
        $sheet->setCellValue('N1', 'payments_total');
        $sheet->setCellValue('O1', 'total');
        $sheet->setCellValue('P1', 'first_name');
        $sheet->setCellValue('Q1', 'last_name');
        $sheet->setCellValue('R1', 'middle_name');
        $sheet->setCellValue('S1', 'user_title');
        $sheet->setCellValue('T1', 'department_id');
        $sheet->setCellValue('U1', 'department_name');

        $row = 2;
        foreach ($payslips as $payslip) {
            $sheet->setCellValue('A' . $row, $payslip['payslip_id']);
            $sheet->setCellValue('B' . $row, $payslip['payslip_date']);
            $sheet->setCellValue('C' . $row, $payslip['payslip_name']);
            $sheet->setCellValue('D' . $row, $payslip['payslip_st_date']);
            $sheet->setCellValue('E' . $row, $payslip['payslip_en_date']);
            $sheet->setCellValue('F' . $row, $payslip['user_id']);
            $sheet->setCellValue('G' . $row, $payslip['created_at']);
            $sheet->setCellValue('H' . $row, $payslip['deleted_at']);
            $sheet->setCellValue('I' . $row, $payslip['company_id']);
            $sheet->setCellValue('J' . $row, $payslip['accruals_total']);
            $sheet->setCellValue('K' . $row, $payslip['sheets_total']);
            $sheet->setCellValue('L' . $row, $payslip['reductions_total']);
            $sheet->setCellValue('M' . $row, $payslip['taxes_total']);
            $sheet->setCellValue('N' . $row, $payslip['payments_total']);
            $sheet->setCellValue('O' . $row, $payslip['total']);
            $sheet->setCellValue('P' . $row, $payslip['first_name']);
            $sheet->setCellValue('Q' . $row, $payslip['last_name']);
            $sheet->setCellValue('R' . $row, $payslip['middle_name']);
            $sheet->setCellValue('S' . $row, $payslip['user_title']);
            $sheet->setCellValue('T' . $row, $payslip['department_id']);
            $sheet->setCellValue('U' . $row, $payslip['department_name']);

            $row++;
        }
    }
    private function writeTaxes(Spreadsheet &$spreadsheet, SearchParams $searchParams)
    {
        $taxes = $this->taxRepository->findAll($searchParams);

        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle("Налоги");

        $sheet->setCellValue('A1', 'tax_id');
        $sheet->setCellValue('B1', 'tax_name');
        $sheet->setCellValue('C1', 'tax_rate');
        $sheet->setCellValue('D1', 'tax_qty');
        $sheet->setCellValue('E1', 'tax_total');
        $sheet->setCellValue('F1', 'is_round');
        $sheet->setCellValue('G1', 'payslip_id');
        $sheet->setCellValue('H1', 'created_at');
        $sheet->setCellValue('I1', 'deleted_at');
        $sheet->setCellValue('J1', 'company_id');
        $sheet->setCellValue('K1', 'payslip_date');
        $sheet->setCellValue('L1', 'user_id');
        $sheet->setCellValue('M1', 'first_name');
        $sheet->setCellValue('N1', 'last_name');
        $sheet->setCellValue('O1', 'middle_name');

        $row = 2;
        foreach ($taxes as $tax) {
            $sheet->setCellValue('A' . $row, $tax['tax_id']);
            $sheet->setCellValue('B' . $row, $tax['tax_name']);
            $sheet->setCellValue('C' . $row, $tax['tax_rate']);
            $sheet->setCellValue('D' . $row, $tax['tax_qty']);
            $sheet->setCellValue('E' . $row, $tax['tax_total']);
            $sheet->setCellValue('F' . $row, $tax['is_round']);
            $sheet->setCellValue('G' . $row, $tax['payslip_id']);
            $sheet->setCellValue('H' . $row, $tax['created_at']);
            $sheet->setCellValue('I' . $row, $tax['deleted_at']);
            $sheet->setCellValue('J' . $row, $tax['company_id']);
            $sheet->setCellValue('K' . $row, $tax['payslip_date']);
            $sheet->setCellValue('L' . $row, $tax['user_id']);
            $sheet->setCellValue('M' . $row, $tax['first_name']);
            $sheet->setCellValue('N' . $row, $tax['last_name']);
            $sheet->setCellValue('O' . $row, $tax['middle_name']);

            $row++;
        }
    }
    private function writeTaxDeductions(Spreadsheet &$spreadsheet, SearchParams $searchParams)
    {
        $taxDeductions = $this->taxDeductionRepository->findAll($searchParams);

        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle("Налоговые вычеты");

        $sheet->setCellValue('A1', 'tax_deduction_id');
        $sheet->setCellValue('B1', 'tax_deduction_name');
        $sheet->setCellValue('C1', 'tax_deduction_rate');
        $sheet->setCellValue('D1', 'tax_deduction_qty');
        $sheet->setCellValue('E1', 'tax_deduction_total');
        $sheet->setCellValue('F1', 'is_round');
        $sheet->setCellValue('G1', 'payslip_id');
        $sheet->setCellValue('H1', 'created_at');
        $sheet->setCellValue('I1', 'deleted_at');
        $sheet->setCellValue('J1', 'company_id');
        $sheet->setCellValue('K1', 'payslip_date');
        $sheet->setCellValue('L1', 'user_id');
        $sheet->setCellValue('M1', 'first_name');
        $sheet->setCellValue('N1', 'last_name');
        $sheet->setCellValue('O1', 'middle_name');

        $row = 2;
        foreach ($taxDeductions as $taxDeduction) {
            $sheet->setCellValue('A' . $row, $taxDeduction['tax_deduction_id']);
            $sheet->setCellValue('B' . $row, $taxDeduction['tax_deduction_name']);
            $sheet->setCellValue('C' . $row, $taxDeduction['tax_deduction_rate']);
            $sheet->setCellValue('D' . $row, $taxDeduction['tax_deduction_qty']);
            $sheet->setCellValue('E' . $row, $taxDeduction['tax_deduction_total']);
            $sheet->setCellValue('F' . $row, $taxDeduction['is_round']);
            $sheet->setCellValue('G' . $row, $taxDeduction['payslip_id']);
            $sheet->setCellValue('H' . $row, $taxDeduction['created_at']);
            $sheet->setCellValue('I' . $row, $taxDeduction['deleted_at']);
            $sheet->setCellValue('J' . $row, $taxDeduction['company_id']);
            $sheet->setCellValue('K' . $row, $taxDeduction['payslip_date']);
            $sheet->setCellValue('L' . $row, $taxDeduction['user_id']);
            $sheet->setCellValue('M' . $row, $taxDeduction['first_name']);
            $sheet->setCellValue('N' . $row, $taxDeduction['last_name']);
            $sheet->setCellValue('O' . $row, $taxDeduction['middle_name']);

            $row++;
        }
    }
    private function writeSocialFees(Spreadsheet &$spreadsheet, SearchParams $searchParams)
    {
        $socialFees = $this->socialFeeRepository->findAll($searchParams);

        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle("Взносы");

        $sheet->setCellValue('A1', 'social_fee_id');
        $sheet->setCellValue('B1', 'social_fee_name');
        $sheet->setCellValue('C1', 'social_fee_rate');
        $sheet->setCellValue('D1', 'social_fee_qty');
        $sheet->setCellValue('E1', 'social_fee_total');
        $sheet->setCellValue('F1', 'is_round');
        $sheet->setCellValue('G1', 'payslip_id');
        $sheet->setCellValue('H1', 'created_at');
        $sheet->setCellValue('I1', 'deleted_at');
        $sheet->setCellValue('J1', 'company_id');
        $sheet->setCellValue('K1', 'payslip_date');
        $sheet->setCellValue('L1', 'user_id');
        $sheet->setCellValue('M1', 'first_name');
        $sheet->setCellValue('N1', 'last_name');
        $sheet->setCellValue('O1', 'middle_name');

        $row = 2;
        foreach ($socialFees as $socialFee) {
            $sheet->setCellValue('A' . $row, $socialFee['social_fee_id']);
            $sheet->setCellValue('B' . $row, $socialFee['social_fee_name']);
            $sheet->setCellValue('C' . $row, $socialFee['social_fee_rate']);
            $sheet->setCellValue('D' . $row, $socialFee['social_fee_qty']);
            $sheet->setCellValue('E' . $row, $socialFee['social_fee_total']);
            $sheet->setCellValue('F' . $row, $socialFee['is_round']);
            $sheet->setCellValue('G' . $row, $socialFee['payslip_id']);
            $sheet->setCellValue('H' . $row, $socialFee['created_at']);
            $sheet->setCellValue('I' . $row, $socialFee['deleted_at']);
            $sheet->setCellValue('J' . $row, $socialFee['company_id']);
            $sheet->setCellValue('K' . $row, $socialFee['payslip_date']);
            $sheet->setCellValue('L' . $row, $socialFee['user_id']);
            $sheet->setCellValue('M' . $row, $socialFee['first_name']);
            $sheet->setCellValue('N' . $row, $socialFee['last_name']);
            $sheet->setCellValue('O' . $row, $socialFee['middle_name']);

            $row++;
        }
    }
    private function writeDebts(Spreadsheet &$spreadsheet)
    {
        $debts = $this->debtRepository->findAll();

        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle("Задолженности");

        $sheet->setCellValue('A1', 'debt_id');
        $sheet->setCellValue('B1', 'debt_date');
        $sheet->setCellValue('C1', 'debt_name');
        $sheet->setCellValue('D1', 'debt_total');
        $sheet->setCellValue('E1', 'is_settled');
        $sheet->setCellValue('F1', 'debt_desc');
        $sheet->setCellValue('G1', 'user_id');
        $sheet->setCellValue('H1', 'created_at');
        $sheet->setCellValue('I1', 'deleted_at');
        $sheet->setCellValue('J1', 'company_id');
        $sheet->setCellValue('K1', 'reductions_total');
        $sheet->setCellValue('L1', 'first_name');
        $sheet->setCellValue('M1', 'last_name');
        $sheet->setCellValue('N1', 'middle_name');
        $sheet->setCellValue('O1', 'user_title');
        $sheet->setCellValue('P1', 'department_id');
        $sheet->setCellValue('Q1', 'department_name');

        $row = 2;
        foreach ($debts as $debt) {
            $sheet->setCellValue('A' . $row, $debt['debt_id']);
            $sheet->setCellValue('B' . $row, $debt['debt_date']);
            $sheet->setCellValue('C' . $row, $debt['debt_name']);
            $sheet->setCellValue('D' . $row, $debt['debt_total']);
            $sheet->setCellValue('E' . $row, $debt['is_settled']);
            $sheet->setCellValue('F' . $row, $debt['debt_desc']);
            $sheet->setCellValue('G' . $row, $debt['user_id']);
            $sheet->setCellValue('H' . $row, $debt['created_at']);
            $sheet->setCellValue('I' . $row, $debt['deleted_at']);
            $sheet->setCellValue('J' . $row, $debt['company_id']);
            $sheet->setCellValue('K' . $row, $debt['reductions_total']);
            $sheet->setCellValue('L' . $row, $debt['first_name']);
            $sheet->setCellValue('M' . $row, $debt['last_name']);
            $sheet->setCellValue('N' . $row, $debt['middle_name']);
            $sheet->setCellValue('O' . $row, $debt['user_title']);
            $sheet->setCellValue('P' . $row, $debt['department_id']);
            $sheet->setCellValue('Q' . $row, $debt['department_name']);
            $row++;
        }
    }
    private function writeAccrualGroups(Spreadsheet &$spreadsheet)
    {
        $groups = $this->accrualGroupRepository->findAll();

        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle("Группы начислений");

        $sheet->setCellValue('A1', 'accrual_group_id');
        $sheet->setCellValue('B1', 'accrual_group_name');

        $row = 2;
        foreach ($groups as $group) {
            $sheet->setCellValue('A' . $row, $group['accrual_group_id']);
            $sheet->setCellValue('B' . $row, $group['accrual_group_name']);
            $row++;
        }
    }
    private function writeUsers(Spreadsheet &$spreadsheet, SearchParams $searchParams)
    {
        $users = $this->userRepository->findAll($searchParams);

        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle("Сотрудники");

        $sheet->setCellValue('A1', 'user_id');
        $sheet->setCellValue('B1', 'first_name');
        $sheet->setCellValue('C1', 'last_name');
        $sheet->setCellValue('D1', 'middle_name');
        $sheet->setCellValue('E1', 'user_title');
        $sheet->setCellValue('F1', 'user_email');
        $sheet->setCellValue('G1', 'user_phone');
        $sheet->setCellValue('H1', 'user_telegram');
        $sheet->setCellValue('I1', 'access_level');
        $sheet->setCellValue('J1', 'account_status');
        $sheet->setCellValue('K1', 'account_id');
        $sheet->setCellValue('L1', 'created_at');
        $sheet->setCellValue('M1', 'deleted_at');
        $sheet->setCellValue('N1', 'company_id');
        $sheet->setCellValue('O1', 'department_id');
        $sheet->setCellValue('P1', 'department_name');

        $row = 2;
        foreach ($users as $user) {
            $sheet->setCellValue('A' . $row, $user['user_id']);
            $sheet->setCellValue('B' . $row, $user['first_name']);
            $sheet->setCellValue('C' . $row, $user['last_name']);
            $sheet->setCellValue('D' . $row, $user['middle_name']);
            $sheet->setCellValue('E' . $row, $user['user_title']);
            $sheet->setCellValue('F' . $row, $user['user_email']);
            $sheet->setCellValue('G' . $row, $user['user_phone']);
            $sheet->setCellValue('H' . $row, $user['user_telegram']);
            $sheet->setCellValue('I' . $row, $user['access_level']);
            $sheet->setCellValue('J' . $row, $user['account_status']);
            $sheet->setCellValue('K' . $row, $user['account_id']);
            $sheet->setCellValue('L' . $row, $user['created_at']);
            $sheet->setCellValue('M' . $row, $user['deleted_at']);
            $sheet->setCellValue('N' . $row, $user['company_id']);
            $sheet->setCellValue('O' . $row, $user['department_id']);
            $sheet->setCellValue('P' . $row, $user['department_name']);

            $row++;
        }
    }
    private function writeDepartments(Spreadsheet &$spreadsheet)
    {
        $departments = $this->departmentRepository->findAll();

        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle("Отделы");

        $sheet->setCellValue('A1', 'department_id');
        $sheet->setCellValue('B1', 'department_name');
        $sheet->setCellValue('C1', 'department_color');
        $sheet->setCellValue('D1', 'company_id');

        $row = 2;
        foreach ($departments as $department) {
            $sheet->setCellValue('A' . $row, $department['department_id']);
            $sheet->setCellValue('B' . $row, $department['department_name']);
            $sheet->setCellValue('C' . $row, $department['department_color']);
            $sheet->setCellValue('D' . $row, $department['company_id']);

            $row++;
        }
    }







}