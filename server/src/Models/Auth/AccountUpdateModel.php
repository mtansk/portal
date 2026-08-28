<?php
namespace Mtansk\Cp\Models\Auth;

use Mtansk\Cp\Helpers\Other\Filter;

class AccountUpdateModel
{
    public string $firstName;
    public ?string $telegram;

    public function __construct(array $inputAccount)
    {
        $filter = new Filter($inputAccount);

        $this->firstName = $filter->validate("first_name", "first_name");
        $this->telegram = $filter->validate("account_telegram", "telegram");
    }

}