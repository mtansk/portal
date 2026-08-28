<?php
namespace Mtansk\Cp\Repositories\Company;

use Mtansk\Cp\Helpers\DB\DELETEQueryNew;
use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;
use Mtansk\Cp\Models\Company\DefaultSheetModel;
use Mtansk\Cp\Routes\Router;

class DefaultSheetRepository
{


    public function __construct()
    {
    }

    public function findAll()
    {
        $user = Router::getInstance()->user;

        $sql = "SELECT
	        def_sheets.def_sheet_id,
            def_sheets.def_sheet_name,
            def_sheets.def_sheet_st,
            def_sheets.def_sheet_en,
            def_sheets.def_sheet_break,
            def_sheets.def_sheet_plus_day,
            def_sheets.def_sheet_desc,
            def_sheets.created_at,
            def_sheets.deleted_at,
            def_sheets.company_id,

	        def_sheet_en - def_sheet_st - def_sheet_break + def_sheet_plus_day * 24 * 60 * 60
	        AS def_sheet_dur

	        FROM def_sheets 
	        WHERE def_sheets.company_id=:company_id";

        $bindings = [
            ":company_id" => $user["company_id"],
        ];

        $get = new GETQueryNew($sql, $bindings, "main", "def_sheets", "def_sheet");
        $data = $get->execute();
        return $data;
    }

    public function update(DefaultSheetModel $sheet, string $id)
    {

        $user = Router::getInstance()->user;

        $sql = "UPDATE def_sheets 
		        SET def_sheet_name = :def_sheet_name,
		        def_sheet_st = :def_sheet_st,
		        def_sheet_en = :def_sheet_en,
		        def_sheet_break = :def_sheet_break,
		        def_sheet_plus_day = :def_sheet_plus_day,
		        def_sheet_desc = :def_sheet_desc
		        WHERE def_sheet_id = :def_sheet_id
		        AND company_id = :company_id";

        $bindings = [
            ":def_sheet_id" => $id,
            ":def_sheet_name" => $sheet->def_sheet_name,
            ":def_sheet_st" => $sheet->def_sheet_st,
            ":def_sheet_en" => $sheet->def_sheet_en,
            ":def_sheet_break" => $sheet->def_sheet_break,
            ":def_sheet_plus_day" => $sheet->def_sheet_plus_day,
            ":def_sheet_desc" => $sheet->def_sheet_desc,
            ":company_id" => $user["company_id"]
        ];

        $put = new PUTQueryNew($sql, $bindings);
        $res = $put->execute();
        return $res;
    }

    public function create(array $rows)
    {
        $sql = "INSERT INTO def_sheets 
			(def_sheet_id,
			def_sheet_name, 
			def_sheet_st, 
			def_sheet_en,
			def_sheet_break,
			def_sheet_plus_day,
			def_sheet_desc,
			company_id)
			VALUES ";

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }

    public function delete(string $id)
    {
        $user = Router::getInstance()->user;

        $sql = "DELETE FROM def_sheets 
                WHERE def_sheet_id = :def_sheet_id 
                AND company_id = :company_id";

        $bindings = [
            ":def_sheet_id" => $id,
            ":company_id" => $user["company_id"]
        ];

        $delete = new DELETEQueryNew($sql, $bindings);
        $res = $delete->execute();
        return $res;
    }
}