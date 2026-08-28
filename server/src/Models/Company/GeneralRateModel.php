<?php
namespace Mtansk\Cp\Models\Company;

use Mtansk\Cp\Helpers\Other\Filter;

class GeneralRateModel
{
    public string $general_rate_name;
    public string $general_rate_rate;
    public ?string $general_rate_desc;
    public string $general_rate_is_public;
    public ?string $accrual_group_id;

    public function __construct(array $inputRate)
    {
        $filter = new Filter($inputRate);

        $this->general_rate_name = $filter->validate("general_rate_name", "name");
        $this->general_rate_rate = $filter->validate("general_rate_rate", "rate");
        $this->general_rate_desc = $filter->validate("general_rate_desc", "desc");
        $this->general_rate_is_public = $filter->validate("general_rate_is_public", "bool");
        $this->accrual_group_id = $filter->validateWithCustomOptions("accrual_group_id", [
            "nullOnEmpty" => true,
        ]);
    }
}