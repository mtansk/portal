<?php
namespace Mtansk\Cp\Models\Finance;

use Mtansk\Cp\Helpers\Other\Filter;

class PayslipModel
{

    public string $payslip_name;
    public string $payslip_date;
    public string $payslip_st_date;
    public string $payslip_en_date;
    public string $user_id;

    public function __construct(array $inputPayslip)
    {
        $filter = new Filter($inputPayslip);

        $this->payslip_name = $filter->validate("payslip_name", "name");
        $this->payslip_date = $filter->validate("payslip_date", "date");
        $this->payslip_st_date = $filter->validate("payslip_st_date", "date");
        $this->payslip_en_date = $filter->validate("payslip_en_date", "date");
        $this->user_id = $filter->validateWithCustomOptions("user_id", [
            "required" => true
        ]);
        Filter::isBefore($this->payslip_st_date, $this->payslip_en_date, true);
    }

}