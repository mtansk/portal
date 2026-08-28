<?php
namespace Mtansk\Cp\Models\Finance;

use Mtansk\Cp\Helpers\Other\Filter;

class TaxDeductionModel
{
    public string $name;
    public string $rate;
    public string $qty;
    public string $payslip_id;
    public string $is_round;

    public function __construct(array $inputTax)
    {
        $filter = new Filter($inputTax);

        $this->name = $filter->validate("name", "name");
        $this->rate = $filter->validate("rate", "rate");
        $this->qty = "1";
        $this->payslip_id = $filter->validateWithCustomOptions("payslip_id", [
            "required" => true
        ]);
        $this->is_round = $filter->validate("is_round", "bool");
    }
}