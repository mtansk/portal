<?php
namespace Mtansk\Cp\Models\Company;

use Mtansk\Cp\Helpers\Other\Filter;

class AccrualGroupModel
{
    public string $accrual_group_name;

    public function __construct(array $inputGroup)
    {
        $filter = new Filter($inputGroup);

        $this->accrual_group_name = $filter->validate("accrual_group_name", "name");
    }
}