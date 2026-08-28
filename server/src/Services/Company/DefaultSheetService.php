<?php
namespace Mtansk\Cp\Services\Company;

use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Models\Company\DefaultSheetModel;
use Mtansk\Cp\Repositories\Company\DefaultSheetRepository;

class DefaultSheetService
{

    private DefaultSheetRepository $defaultSheetRepository;

    public function __construct()
    {
        $this->defaultSheetRepository = new DefaultSheetRepository();
    }

    public function findAll()
    {
        return $this->defaultSheetRepository->findAll();
    }

    public function update(DefaultSheetModel $sheet, $id)
    {
        $res = $this->defaultSheetRepository->update($sheet, $id);
        return [
            [
                "count" => $res,
                "id" => $id
            ]
        ];
    }

    public function createFromJson()
    {
        $json = Router::getInstance()->json;
        $sheet = new DefaultSheetModel($json);
        $user = Router::getInstance()->user;

        $id = Crypto::UUID4();

        $rows = [
            [
                $id,
                $sheet->def_sheet_name,
                $sheet->def_sheet_st,
                $sheet->def_sheet_en,
                $sheet->def_sheet_break,
                $sheet->def_sheet_plus_day,
                $sheet->def_sheet_desc,
                $user["company_id"]
            ]
        ];

        $res = $this->defaultSheetRepository->create($rows);

        return [
            "id" => $id,
            "count" => $res
        ];
    }

    public function delete(string $id)
    {
        $res = $this->defaultSheetRepository->delete($id);
        return [
            "count" => $res,
            "id" => $id
        ];
    }



}