<?php
namespace Mtansk\Cp\Models\Company;

use Mtansk\Cp\Helpers\Other\Filter;

class SheetRateModel
{
    public string $sheet_rate_name;
    public string $sheet_rate_rate;
    public ?string $sheet_rate_desc;
    public string $sheet_rate_is_public;
    public string $measure_type;


    public function __construct(array $inputSheet)
    {
        $filter = new Filter($inputSheet);

        $this->sheet_rate_name = $filter->validate("sheet_rate_name", "name");
        $this->sheet_rate_rate = $filter->validate("sheet_rate_rate", "rate");
        $this->sheet_rate_desc = $filter->validate("sheet_rate_desc", "desc");
        $this->sheet_rate_is_public = $filter->validate("sheet_rate_is_public", "bool");
        $this->measure_type = $filter->validateWithCustomOptions("measure_type", [
            "allowedValues" => ["hour", "sheet"],
            "required" => true,
        ]);
    }


}
