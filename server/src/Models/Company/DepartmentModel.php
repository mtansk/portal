<?php
namespace Mtansk\Cp\Models\Company;

use Mtansk\Cp\Helpers\Other\Filter;

class DepartmentModel
{
    public string $department_name;
    public string $department_color;

    public function __construct(array $inputDept)
    {
        $filter = new Filter($inputDept);

        $this->department_name = $filter->validateWithCustomOptions("department_name", [
            "type" => "string",
            "maxLength" => 100,
            "required" => true,
        ]);

        $this->department_color = $filter->validateWithCustomOptions("department_color", [
            "type" => "string",
            "maxLength" => 12,
            "required" => true,
        ]);
    }
}
