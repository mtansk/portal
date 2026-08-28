<?php
namespace Mtansk\Cp\Models\Auth;

use Mtansk\Cp\Helpers\Other\Filter;

class CompanyRegModel
{
    public string $email;
    public string $first_name;
    public string $company_name;
    public string $use_template;
    public string $password;


    public function __construct($inputReg)
    {
        $filter = new Filter($inputReg);

        $this->email = $filter->validateWithCustomOptions("email", [
            "type" => "email",
            "required" => true,
        ]);

        $this->first_name = $filter->validateWithCustomOptions("first_name", [
            "type" => "string",
            "required" => true,
            "maxLength" => 30,
        ]);

        $this->company_name = $filter->validateWithCustomOptions("company_name", [
            "type" => "string",
            "required" => true,
            "maxLength" => 100,
        ]);

        $this->use_template = $inputReg["use_template"] ?? 0;

        $this->password = $filter->validate("password", "password");
    }
}