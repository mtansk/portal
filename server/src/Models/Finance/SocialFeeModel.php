<?php
namespace Mtansk\Cp\Models\Finance;

use Mtansk\Cp\Helpers\Other\Filter;

class SocialFeeModel
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
        $this->rate = $filter->validate("rate", "percent");
        $this->qty = $filter->validate("qty", "qty");
        $this->payslip_id = $filter->validateWithCustomOptions("payslip_id", [
            "required" => true
        ]);
        $this->is_round = $filter->validate("is_round", "bool");
    }
}