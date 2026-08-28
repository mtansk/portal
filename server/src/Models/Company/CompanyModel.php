<?php
namespace Mtansk\Cp\Models\Company;

use Mtansk\Cp\Helpers\Other\Filter;

class CompanyModel
{
    public string $company_name;


    public function __construct(array $inputCompany)
    {
        $filter = new Filter($inputCompany);

        $this->company_name = $filter->validateWithCustomOptions("company_name", [
            "type" => "string",
            "required" => true,
            "maxLength" => 100,
        ]);
    }

}