<?php
namespace Mtansk\Cp\Models\Finance;

use Mtansk\Cp\Helpers\Other\Filter;

class AccrualModel
{
    public string $accrual_name;
    public string $accrual_rate;
    public string $accrual_qty;
    public ?string $accrual_desc;
    public ?string $accrual_group_id;
    public ?string $payslip_id;
    public ?string $accrual_time;
    public string $accrual_date;
    public string $user_id;

    public function __construct(array $inputAccrual)
    {
        $filter = new Filter($inputAccrual);

        $this->accrual_name = $filter->validate("accrual_name", "name");
        $this->accrual_rate = $filter->validate("accrual_rate", "rate");
        $this->accrual_qty = $filter->validate("accrual_qty", "qty");
        $this->accrual_desc = $filter->validate("accrual_desc", "desc");
        $this->accrual_group_id = $filter->validateWithCustomOptions("accrual_group_id", [
            "nullOnEmpty" => true,
        ]);
        $this->payslip_id = $filter->validateWithCustomOptions("payslip_id", [
            "nullOnEmpty" => true,
        ]);
        $this->accrual_time = $filter->validateWithCustomOptions("accrual_time", [
            "type" => "time"
        ]);
        $this->accrual_date = $filter->validate("accrual_date", "date");
        $this->user_id = $filter->validateWithCustomOptions("user_id", [
            "required" => true
        ]);

        Filter::validateTotal($this->accrual_rate, $this->accrual_qty);
    }
}