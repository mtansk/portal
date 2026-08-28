<?php
namespace Mtansk\Cp\Models\Auth;

use Mtansk\Cp\Helpers\Other\Filter;

class UserRegModel
{
    public string $email;
    public string $first_name;
    public string $password;


    public function __construct(array $inputArray)
    {
        $filter = new Filter($inputArray);

        $this->email = $filter->validateWithCustomOptions("email", [
            "type" => "email",
            "required" => true,
        ]);

        $this->first_name = $filter->validateWithCustomOptions("first_name", [
            "type" => "string",
            "required" => true,
            "maxLength" => 30,
        ]);

        $this->password = $filter->validate("password", "password");
    }



}