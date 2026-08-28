<?php
namespace Mtansk\Cp\Services\Company;

use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Models\Company\SheetRateModel;
use Mtansk\Cp\Repositories\Company\SheetRateRepository;
use Mtansk\Cp\Routes\Router;

class SheetRateService
{

    private SheetRateRepository $sheetRateRepository;

    public function __construct()
    {
        $this->sheetRateRepository = new SheetRateRepository();
    }

    public function findAll()
    {
        return $this->sheetRateRepository->findAll();
    }

    public function createFromJson()
    {
        $json = Router::getInstance()->json;
        $sheet = new SheetRateModel($json);
        $user = Router::getInstance()->user;

        $id = Crypto::UUID4();

        $rows =
            [
                [
                    $id,
                    $sheet->sheet_rate_name,
                    $sheet->sheet_rate_rate,
                    $sheet->sheet_rate_desc,
                    $sheet->sheet_rate_is_public,
                    $sheet->measure_type,
                    $user["company_id"]
                ]
            ];

        $res = $this->sheetRateRepository->create($rows);

        return [
            [
                "id" => $id,
                "count" => $res
            ]
        ];

    }

    public function update(SheetRateModel $rate, string $id)
    {
        $res = $this->sheetRateRepository->update($rate, $id);
        return [
            "count" => $res,
            "id" => $id
        ];
    }

    public function delete(string $id)
    {
        $res = $this->sheetRateRepository->delete($id);
        return [
            "count" => $res,
            "id" => $id
        ];
    }



}