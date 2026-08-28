<?php
namespace Mtansk\Cp\Repositories\Sheets;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Models\Sheets\SheetModel;

class SheetRepository
{

    public function __construct()
    {
    }


    public function findAll(?SearchParams $searchParams = null)
    {
        $user = Router::getInstance()->user;

        $rate = GETQueryNew::trim("sheet_rate", "sheets");
        $overtimeRate = GETQueryNew::trim("sheet_overtime_rate", "sheets");
        $joins = GETQueryNew::userJoins("sheets");
        $now = GETQueryNew::addNow();
        $joinFields = GETQueryNew::userJoinsFields();

        $sql = "SELECT
                sheets.sheet_id,
                sheets.sheet_date,
                sheets.sheet_p_st,
                sheets.sheet_p_en,
                sheets.break_dur_p,
                sheets.sheet_plus_day_p,
                sheets.sheet_f_st,
                sheets.sheet_f_en,
                sheets.break_dur_f,
                sheets.sheet_plus_day_f,
     
                {$rate},
     
                sheets.sheet_payment_p,
                sheets.sheet_payment_f,
                sheets.use_f_payment,
                sheets.use_f_dur,
                sheets.use_overtime_dur,
                sheets.measure_type,
                sheets.sheet_desc,
     
                {$overtimeRate},
     
                sheets.sheet_overtime_time,
                sheets.sheet_overtime_total,
                sheets.sheet_total,
                sheets.sheet_total_dur,
                sheets.sheet_status,
                sheets.payslip_id,
                sheets.user_id,
                sheets.created_at,
                sheets.deleted_at,
                sheets.company_id,
     
                DATE_FORMAT(sheet_date, '%d.%m.%Y') AS formattedDate,
                sheet_date AS date,
                sheet_rate AS rate,
                '1' AS qty,
                sheet_total AS total,
                CONCAT('Смена от ', DATE_FORMAT(sheet_date, '%d.%m.%Y')) AS name,
                sheet_id AS id,
                null AS accrual_group_id,
                'Смены' AS accrual_group_name,
     
                -- Расчет длительности плановой смены в секундах
                IF(sheet_p_st IS NOT NULL AND sheet_p_en IS NOT NULL,
                   (sheet_p_en - sheet_p_st) + IF(sheet_plus_day_p = '1', 24 * 60 * 60, 0)
                   - IF(break_dur_p IS NOT NULL, break_dur_p, 0),
                   0
                ) AS sheet_dur_p,
     
                {$joinFields},
     
                {$now}
     
            FROM sheets
            {$joins}
            WHERE sheets.company_id = :company_id ";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        $sheet_status_param = $_GET["sheet_status"] ?? null;
        if ($sheet_status_param) {
            $sql .= " AND sheet_status = :sheet_status ";
            $bindings[":sheet_status"] = filter_var(
                $sheet_status_param,
                FILTER_SANITIZE_SPECIAL_CHARS
            );
        }

        $get = new GETQueryNew(
            $sql,
            $bindings,
            "main",
            "sheets",
            "sheet"
        );
        $get->searchParams = $searchParams;
        $get->afterQuery = " ORDER BY sheet_date ";
        $data = $get->execute();

        return $data;
    }

    public function findById(string $id, ?SearchParams $searchParams = null)
    {
        $user = Router::getInstance()->user;

        $rate = GETQueryNew::trim("sheet_rate", "sheets");
        $overtimeRate = GETQueryNew::trim("sheet_overtime_rate", "sheets");
        $joins = GETQueryNew::userJoins("sheets");
        $now = GETQueryNew::addNow();
        $joinFields = GETQueryNew::userJoinsFields();

        $sql = "SELECT
                sheets.sheet_id,
                sheets.sheet_date,
                sheets.sheet_p_st,
                sheets.sheet_p_en,
                sheets.break_dur_p,
                sheets.sheet_plus_day_p,
                sheets.sheet_f_st,
                sheets.sheet_f_en,
                sheets.break_dur_f,
                sheets.sheet_plus_day_f,
     
                {$rate},
     
                sheets.sheet_payment_p,
                sheets.sheet_payment_f,
                sheets.use_f_payment,
                sheets.use_f_dur,
                sheets.use_overtime_dur,
                sheets.measure_type,
                sheets.sheet_desc,
     
                {$overtimeRate},
     
                sheets.sheet_overtime_time,
                sheets.sheet_overtime_total,
                sheets.sheet_total,
                sheets.sheet_total_dur,
                sheets.sheet_status,
                sheets.payslip_id,
                sheets.user_id,
                sheets.created_at,
                sheets.deleted_at,
                sheets.company_id,
     
                DATE_FORMAT(sheet_date, '%d.%m.%Y') AS formattedDate,
                sheet_date AS date,
                sheet_rate AS rate,
                '1' AS qty,
                sheet_total AS total,
                CONCAT('Смена от ', DATE_FORMAT(sheet_date, '%d.%m.%Y')) AS name,
                sheet_id AS id,
                null AS accrual_group_id,
                'Смены' AS accrual_group_name,
     
                -- Расчет длительности плановой смены в секундах
                IF(sheet_p_st IS NOT NULL AND sheet_p_en IS NOT NULL,
                   (sheet_p_en - sheet_p_st) + IF(sheet_plus_day_p = '1', 24 * 60 * 60, 0)
                   - IF(break_dur_p IS NOT NULL, break_dur_p, 0),
                   0
                ) AS sheet_dur_p,
     
                {$joinFields},
     
                {$now}
     
            FROM sheets
            {$joins}
            WHERE sheets.company_id = :company_id 
            AND sheets.sheet_id = :sheet_id ";

        $bindings = [
            ":company_id" => $user["company_id"],
            ":sheet_id" => $id
        ];

        $sheet_status_param = $_GET["sheet_status"] ?? null;
        if ($sheet_status_param) {
            $sql .= " AND sheet_status = :sheet_status ";
            $bindings[":sheet_status"] = filter_var(
                $sheet_status_param,
                FILTER_SANITIZE_SPECIAL_CHARS
            );
        }

        $get = new GETQueryNew(
            $sql,
            $bindings,
            "main",
            "sheets",
            "sheet"
        );
        $get->searchParams = $searchParams;
        $get->afterQuery = " ORDER BY sheet_date ";
        $data = $get->execute();

        return $data;
    }


    public function update(SheetModel $sheet, string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "UPDATE sheets 
                SET sheet_status = :sheet_status, 
                    sheet_date = :sheet_date, 
    
                    sheet_p_st = :sheet_p_st, 
                    sheet_p_en = :sheet_p_en, 
                    break_dur_p = :break_dur_p, 
                    sheet_plus_day_p = :sheet_plus_day_p,
    
                    sheet_f_st = :sheet_f_st, 
                    sheet_f_en = :sheet_f_en, 
                    break_dur_f = :break_dur_f, 
                    sheet_plus_day_f = :sheet_plus_day_f,
    
                    sheet_rate = :sheet_rate, 
                    measure_type = :measure_type, 
    
                    use_f_dur = :use_f_dur,
                    use_f_payment = :use_f_payment,
                    use_overtime_dur = :use_overtime_dur,
    
                    sheet_overtime_rate = :sheet_overtime_rate,
                    sheet_overtime_time = :sheet_overtime_time,
    
                    sheet_desc = :sheet_desc,
                    payslip_id = :payslip_id
    
                WHERE sheet_id = :sheet_id AND company_id = :company_id";

        $bindings = [
            ":sheet_id" => $id,
            ":sheet_status" => $sheet->sheet_status,
            ":sheet_date" => $sheet->sheet_date,

            ":sheet_p_st" => $sheet->sheet_p_st,
            ":sheet_p_en" => $sheet->sheet_p_en,
            ":break_dur_p" => $sheet->break_dur_p,
            ":sheet_plus_day_p" => $sheet->sheet_plus_day_p,

            ":sheet_f_st" => $sheet->sheet_f_st,
            ":sheet_f_en" => $sheet->sheet_f_en,
            ":break_dur_f" => $sheet->break_dur_f,
            ":sheet_plus_day_f" => $sheet->sheet_plus_day_f,

            ":sheet_rate" => $sheet->sheet_rate,
            ":measure_type" => $sheet->measure_type,

            ":use_f_dur" => $sheet->use_f_dur,
            ":use_f_payment" => $sheet->use_f_payment,
            ":use_overtime_dur" => $sheet->use_overtime_dur,

            ":sheet_overtime_rate" => $sheet->sheet_overtime_rate,
            ":sheet_overtime_time" => $sheet->sheet_overtime_time,

            ":sheet_desc" => $sheet->sheet_desc,
            ":payslip_id" => $sheet->payslip_id,
            ":company_id" => $user["company_id"],
        ];


        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();
        return $res;
    }

    public function create(array $rows)
    {
        $sql = "INSERT INTO sheets 
        (user_id,
	    sheet_date,
        sheet_id,

        sheet_p_st,
        sheet_p_en,
        break_dur_p,
        sheet_plus_day_p,

        sheet_f_st,
        sheet_f_en,
        break_dur_f,
        sheet_plus_day_f,

        sheet_rate,
        measure_type,

        use_f_dur,
        use_f_payment,
        use_overtime_dur,

        sheet_desc,

        sheet_overtime_rate,
        sheet_overtime_time,

        sheet_status,
        payslip_id,
        company_id) 
        VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }

    public function delete(string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "UPDATE sheets 
                SET deleted_at = NOW()
                WHERE sheet_id = :sheet_id AND company_id = :company_id";

        $bindings = [
            ":sheet_id" => $id,
            ":company_id" => $user["company_id"],
        ];

        $update = new PUTQueryNew($sql, $bindings);
        $res = $update->execute();
        return $res;

    }

    public function getReservedDates()
    {
        $user = Router::getInstance()->user;

        $sql = "SELECT 
                user_id,
                GROUP_CONCAT(sheet_date ORDER BY sheet_date ASC) AS reserved_dates
                FROM 
                    sheets
                WHERE
                    company_id = :company_id 
                    AND deleted_at IS NULL ";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "sheets", "sheet");
        $get->afterQuery = " GROUP BY user_id ";

        $data = $get->execute();
        return $data;
    }

    public function findMyTeamSheets(?SearchParams $searchParams = null)
    {
        $user = Router::getInstance()->user;
        $joins = GETQueryNew::userJoins("sheets");
        $joinFields = GETQueryNew::userJoinsFields();

        $sql = "SELECT
                sheets.sheet_id,
                sheets.sheet_date,
                sheets.sheet_p_st,
                sheets.sheet_p_en,
                sheets.break_dur_p,
                sheets.sheet_plus_day_p,

                sheets.sheet_status,
                sheets.user_id,
                sheets.deleted_at,
                sheets.company_id,
     
                IF(sheet_p_st IS NOT NULL AND sheet_p_en IS NOT NULL,
                   (sheet_p_en - sheet_p_st) + IF(sheet_plus_day_p = '1', 24 * 60 * 60, 0)
                   - IF(break_dur_p IS NOT NULL, break_dur_p, 0),
                   0
                ) AS sheet_dur_p,
     
                {$joinFields}

            FROM sheets
            
                {$joins}

            WHERE sheets.company_id = :company_id ";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        $get = new GETQueryNew(
            $sql,
            $bindings,
            "main",
            "sheets",
            "sheet"
        );
        $get->afterQuery = " ORDER BY sheet_date ";
        $get->searchParams = $searchParams;
        $data = $get->execute();

        return $data;
    }
}


