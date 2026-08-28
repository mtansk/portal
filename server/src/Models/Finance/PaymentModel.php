<?php
namespace Mtansk\Cp\Models\Finance;

use Mtansk\Cp\Helpers\Other\Filter;

class PaymentModel
{
    public string $payment_name;
    public string $payment_rate;
    public string $payment_qty;
    public ?string $payment_desc;
    public ?string $payslip_id;
    public string $payment_date;
    public string $user_id;

    public function __construct(array $inputPayment)
    {
        $filter = new Filter($inputPayment);

        $this->payment_name = $filter->validate("payment_name", "name");
        $this->payment_rate = $filter->validate("payment_rate", "rate");
        $this->payment_qty = "1";
        $this->payment_desc = $filter->validate("payment_desc", "desc");
        $this->payslip_id = $filter->validateWithCustomOptions("payslip_id", [
            "nullOnEmpty" => true,
        ]);
        $this->payment_date = $filter->validate("payment_date", "date");
        $this->user_id = $filter->validateWithCustomOptions("user_id", [
            "required" => true
        ]);

        Filter::validateTotal($this->payment_rate, 1);
    }

}
