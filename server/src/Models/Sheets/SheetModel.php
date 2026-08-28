<?php
namespace Mtansk\Cp\Models\Sheets;

use Mtansk\Cp\Helpers\Other\Filter;

class SheetModel
{
    public string $sheet_status;
    public ?string $sheet_desc;
    public string $sheet_date;
    public string $user_id;

    public ?string $sheet_p_st;
    public ?string $sheet_p_en;
    public ?string $break_dur_p;
    public ?string $sheet_plus_day_p;

    public ?string $sheet_f_st;
    public ?string $sheet_f_en;
    public ?string $break_dur_f;
    public ?string $sheet_plus_day_f;

    public ?string $sheet_rate;
    public string $measure_type;

    public ?string $use_f_dur;
    public ?string $use_f_payment;
    public ?string $use_overtime_dur;

    public ?string $sheet_overtime_rate;
    public ?string $sheet_overtime_time;

    public ?string $payslip_id;


    public function __construct(array $inputSheet)
    {
        $filter = new Filter($inputSheet);

        $this->sheet_status = $filter->validateWithCustomOptions("sheet_status", [
            "allowedValues" => ["workday", "dayoff", "vacation", "absence", "excused"],
            "required" => true,
        ]);

        $isWorkday = $this->sheet_status === "workday";

        $this->sheet_desc = $filter->validate("sheet_desc", "desc");
        $this->sheet_date = $filter->validate("sheet_date", "date");
        $this->user_id = $filter->validateWithCustomOptions("user_id", [
            "required" => true
        ]);

        if ($isWorkday) {
            $this->sheet_p_st = $filter->validate("sheet_p_st", "time");
            $this->sheet_p_en = $filter->validate("sheet_p_en", "time");
            $this->break_dur_p = $filter->validate("break_dur_p", "time");
            $this->sheet_plus_day_p = $filter->validate("sheet_plus_day_p", "bool");

            Filter::validateSheetDur($this->sheet_p_st, $this->sheet_p_en, $this->break_dur_p, $this->sheet_plus_day_p);

            $this->sheet_f_st = $filter->validateWithCustomOptions("sheet_f_st", ["type" => "time"]);
            $this->sheet_f_en = $filter->validateWithCustomOptions("sheet_f_en", ["type" => "time"]);
            $this->break_dur_f = $filter->validateWithCustomOptions("break_dur_f", ["type" => "time"]);
            $this->sheet_plus_day_f = $filter->validate("sheet_plus_day_f", "bool");

            $f_st = $this->sheet_f_st;
            $f_en = $this->sheet_f_en;
            $break_f = $this->break_dur_f;

            if ($f_st !== null & $f_en !== null & $break_f !== null) {
                Filter::validateSheetDur($f_st, $f_en, $break_f, $this->sheet_plus_day_f);
            }

            $this->sheet_rate = $filter->validate("sheet_rate", "rate");
            $this->measure_type = $filter->validateWithCustomOptions("measure_type", [
                "allowedValues" => ["hour", "sheet"],
                "required" => true,
            ]);

            $this->use_f_dur = $filter->validate("use_f_dur", "bool");
            $this->use_f_payment = $filter->validate("use_f_payment", "bool");
            $this->use_overtime_dur = $filter->validate("use_overtime_dur", "bool");

            $this->sheet_overtime_rate = $filter->validateWithCustomOptions("sheet_overtime_rate", [
                "type" => "float",
                "required" => false,
                "minValue" => 0,
                "maxValue" => 1_000_000,
                "maxFraction" => 4,
            ]);
            $this->sheet_overtime_time = $filter->validateWithCustomOptions("sheet_overtime_time", ["type" => "time"]);

            $this->payslip_id = $filter->validate("payslip_id", "nullableId");
        } else {
            $this->sheet_p_st = null;
            $this->sheet_p_en = null;
            $this->break_dur_p = null;
            $this->sheet_plus_day_p = "0";

            $this->sheet_f_st = null;
            $this->sheet_f_en = null;
            $this->break_dur_f = null;
            $this->sheet_plus_day_f = "0";

            $this->sheet_rate = null;
            $this->measure_type = "hour";

            $this->use_f_dur = "0";
            $this->use_f_payment = "0";
            $this->use_overtime_dur = "0";

            $this->sheet_overtime_rate = null;
            $this->sheet_overtime_time = null;

            $this->payslip_id = null;
        }

    }

}



/* 

<!-- 
 
    $array = $inputSheet ?? Router_LEGACY::getInstance()->json;
    $filter = new Filter($array);

    $sheet = [];

    $sheet["sheet_status"] = $filter->validateWithCustomOptions("sheet_status", [
        "allowedValues" => ["workday", "dayoff", "vacation", "absence", "excused"],
        "required" => true,
    ]);

    $isWorkday = $sheet["sheet_status"] === "workday";

    $sheet["sheet_desc"] = $filter->validate("sheet_desc", "desc");
    if ($use_ids ?? false) {
        $sheet["ids"] = $filter->filterIds("ids");
    } else {
        $sheet["sheet_date"] = $filter->validate("sheet_date", "date");
        $sheet["user_id"] = $filter->validateWithCustomOptions("user_id", [
            "required" => true
        ]);
    }

    if ($isWorkday) {
        $sheet["sheet_p_st"] = $filter->validate("sheet_p_st", "time");
        $sheet["sheet_p_en"] = $filter->validate("sheet_p_en", "time");
        $sheet["break_dur_p"] = $filter->validate("break_dur_p", "time");
        $sheet["sheet_plus_day_p"] = $filter->validate("sheet_plus_day_p", "bool");

        validateSheetDur($sheet["sheet_p_st"], $sheet["sheet_p_en"], $sheet["break_dur_p"], $sheet["sheet_plus_day_p"]);

        $sheet["sheet_f_st"] = $filter->validateWithCustomOptions("sheet_f_st", ["type" => "time"]);
        $sheet["sheet_f_en"] = $filter->validateWithCustomOptions("sheet_f_en", ["type" => "time"]);
        $sheet["break_dur_f"] = $filter->validateWithCustomOptions("break_dur_f", ["type" => "time"]);
        $sheet["sheet_plus_day_f"] = $filter->validate("sheet_plus_day_f", "bool");

        $f_st = $sheet["sheet_f_st"];
        $f_en = $sheet["sheet_f_en"];
        $break_f = $sheet["break_dur_f"];

        if ($f_st !== null & $f_en !== null & $break_f !== null) {
            validateSheetDur($f_st, $f_en, $break_f, $sheet["sheet_plus_day_f"]);
        }

        $sheet["sheet_rate"] = $filter->validate("sheet_rate", "rate");
        $sheet["measure_type"] = $filter->validateWithCustomOptions("measure_type", [
            "allowedValues" => ["hour", "sheet"],
            "required" => true,
        ]);

        $sheet["use_f_dur"] = $filter->validate("use_f_dur", "bool");
        $sheet["use_f_payment"] = $filter->validate("use_f_payment", "bool");
        $sheet["use_overtime_dur"] = $filter->validate("use_overtime_dur", "bool");

        $sheet["sheet_overtime_rate"] = $filter->validateWithCustomOptions("sheet_overtime_rate", [
            "type" => "float",
            "required" => false,
            "minValue" => 0,
            "maxValue" => 1_000_000,
            "maxFraction" => 4,
        ]);
        $sheet["sheet_overtime_time"] = $filter->validateWithCustomOptions("sheet_overtime_time", ["type" => "time"]);

        $sheet["payslip_id"] = $filter->validate("payslip_id", "nullableId");
    } else {
        $sheet["sheet_p_st"] = null;
        $sheet["sheet_p_en"] = null;
        $sheet["break_dur_p"] = null;
        $sheet["sheet_plus_day_p"] = "0";

        $sheet["sheet_f_st"] = null;
        $sheet["sheet_f_en"] = null;
        $sheet["break_dur_f"] = null;
        $sheet["sheet_plus_day_f"] = "0";

        $sheet["sheet_rate"] = null;
        $sheet["measure_type"] = "hour";

        $sheet["use_f_dur"] = "0";
        $sheet["use_f_payment"] = "0";
        $sheet["use_overtime_dur"] = "0";

        $sheet["sheet_overtime_rate"] = null;
        $sheet["sheet_overtime_time"] = null;

        $sheet["payslip_id"] = null;
    }

    return $sheet;

--> */