<?php
namespace Mtansk\Cp\Models\Company;

use Mtansk\Cp\Helpers\Other\Filter;

class DefaultSheetModel
{

    public string $def_sheet_name;
    public string $def_sheet_st;
    public string $def_sheet_en;
    public string $def_sheet_break;
    public string $def_sheet_plus_day;
    public ?string $def_sheet_desc;

    public function __construct(array $inputSheet)
    {
        $filter = new Filter($inputSheet);

        $this->def_sheet_name = $filter->validate("def_sheet_name", "name");
        $this->def_sheet_st = $filter->validate("def_sheet_st", "time");
        $this->def_sheet_en = $filter->validate("def_sheet_en", "time");
        $this->def_sheet_break = $filter->validate("def_sheet_break", "time");
        $this->def_sheet_plus_day = $filter->validate("def_sheet_plus_day", "bool");
        $this->def_sheet_desc = $filter->validate("def_sheet_desc", "desc");

        Filter::validateSheetDur(
            $this->def_sheet_st,
            $this->def_sheet_en,
            $this->def_sheet_break,
            $this->def_sheet_plus_day
        );
    }


}
