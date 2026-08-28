<?php
namespace Mtansk\Cp\Models\Finance;

use Mtansk\Cp\Helpers\Other\Filter;

class ReductionModel
{
    public string $reduction_name;
    public string $reduction_rate;
    public string $reduction_qty;
    public ?string $reduction_desc;
    public ?string $debt_id;
    public ?string $payslip_id;
    public string $reduction_date;
    public string $user_id;


    public function __construct(array $inputReduction)
    {
        $filter = new Filter($inputReduction);

        $this->reduction_name = $filter->validate("reduction_name", "name");
        $this->reduction_rate = $filter->validate("reduction_rate", "rate");
        $this->reduction_qty = $filter->validate("reduction_qty", "qty");
        $this->reduction_desc = $filter->validate("reduction_desc", "desc");

        $this->debt_id = $filter->validateWithCustomOptions("debt_id", [
            "nullOnEmpty" => true,
        ]);
        $this->payslip_id = $filter->validateWithCustomOptions("payslip_id", [
            "nullOnEmpty" => true,
        ]);

        $this->reduction_date = $filter->validate("reduction_date", "date");
        $this->user_id = $filter->validateWithCustomOptions("user_id", [
            "required" => true,
        ]);

        Filter::validateTotal($this->reduction_rate, $this->reduction_qty);
    }


}