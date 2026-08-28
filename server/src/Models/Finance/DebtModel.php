<?php
namespace Mtansk\Cp\Models\Finance;

use Mtansk\Cp\Helpers\Other\Filter;

class DebtModel
{
    public string $debt_date;
    public string $debt_name;
    public string $debt_total;
    public ?string $debt_desc;
    public string $is_settled;
    public string $user_id;

    public function __construct(array $inputDebt)
    {
        $filter = new Filter($inputDebt);

        $this->debt_date = $filter->validate("debt_date", "date");
        $this->debt_name = $filter->validate("debt_name", "name");

        $this->debt_total = $filter->validateWithCustomOptions("debt_total", [
            "type" => "float",
            "required" => true,
            "minValue" => 0,
            "maxValue" => 10000000,
        ]);
        $this->debt_desc = $filter->validate("debt_desc", "desc");
        $this->is_settled = $filter->validate("is_settled", "bool");
        $this->user_id = $filter->validateWithCustomOptions("user_id", [
            "required" => true
        ]);
    }

}