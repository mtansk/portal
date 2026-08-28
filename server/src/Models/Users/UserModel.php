<?php
namespace Mtansk\Cp\Models\Users;

use Mtansk\Cp\Helpers\Other\Filter;

class UserModel
{
    public ?string $last_name;
    public string $first_name;
    public ?string $middle_name;
    public string $user_title;
    public string $department_id;
    public ?string $user_email;
    public ?string $user_phone;
    public ?string $user_telegram;

    public function __construct(array $inputUser)
    {
        $filter = new Filter($inputUser);

        $this->last_name = $filter->validateWithCustomOptions("last_name", [
            "type" => "string",
            "maxLength" => 30,
            "required" => false,
        ]);
        $this->first_name = $filter->validateWithCustomOptions("first_name", [
            "type" => "string",
            "maxLength" => 30,
            "required" => true,
        ]);
        $this->middle_name = $filter->validateWithCustomOptions("middle_name", [
            "type" => "string",
            "maxLength" => 30,
            "required" => false,
        ]);

        $this->user_title = $filter->validateWithCustomOptions("user_title", [
            "type" => "string",
            "maxLength" => 50,
            "required" => true,
        ]);
        $this->department_id = $filter->validateWithCustomOptions("department_id", [
            "type" => "string",
            "required" => true,
        ]);

        $this->user_email = $filter->validateWithCustomOptions("user_email", [
            "type" => "string",
            "required" => false,
            "maxLength" => 30,
        ]);
        $this->user_phone = $filter->validateWithCustomOptions("user_phone", [
            "type" => "string",
            "required" => false,
            "maxLength" => 30,
        ]);
        $this->user_telegram = $filter->validateWithCustomOptions("user_telegram", [
            "type" => "string",
            "required" => false,
            "maxLength" => 30,
        ]);
    }






}
