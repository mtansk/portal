<?php
namespace Mtansk\Cp\Services\Sheets;

use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Models\Sheets\SheetModel;
use Mtansk\Cp\Repositories\Sheets\SheetRepository;
use Mtansk\Cp\Routes\Router;

class SheetService
{

    private SheetRepository $sheetRepository;

    public function __construct(SheetRepository $sheetRepository)
    {
        $this->sheetRepository = $sheetRepository;
    }

    public function findAll(?SearchParams $searchParams = null)
    {
        return $this->sheetRepository->findAll($searchParams);
    }

    public function findById(string $id, ?SearchParams $searchParams = null)
    {
        return $this->sheetRepository->findById($id);
    }

    public function update(SheetModel $sheet, string $id)
    {
        $res = $this->sheetRepository->update($sheet, $id);
        return [
            [
                "id" => $id,
                "count" => $res
            ]
        ];
    }

    public function createFromJson()
    {
        $json = Router::getInstance()->json;
        $user = Router::getInstance()->user;

        $ids = [];
        $rows = [];
        foreach ($json as $sheet) {
            $model = new SheetModel($sheet);
            $id = Crypto::UUID4();
            $ids[] = $id;

            $rows[] = [
                $model->user_id,
                $model->sheet_date,
                $id,

                $model->sheet_p_st,
                $model->sheet_p_en,
                $model->break_dur_p,
                $model->sheet_plus_day_p,

                $model->sheet_f_st,
                $model->sheet_f_en,
                $model->break_dur_f,
                $model->sheet_plus_day_f,

                $model->sheet_rate,
                $model->measure_type,

                $model->use_f_dur,
                $model->use_f_payment,
                $model->use_overtime_dur,

                $model->sheet_desc,

                $model->sheet_overtime_rate,
                $model->sheet_overtime_time,

                $model->sheet_status,
                $model->payslip_id,
                $user['company_id']
            ];
        }


        $res = $this->sheetRepository->create($rows);
        $data = [
            [
                "id" => $ids,
                "count" => $res
            ]
        ];
        return $data;
    }

    public function delete(string $id)
    {
        $res = $this->sheetRepository->delete($id);
        return [
            [
                "id" => $id,
                "count" => $res
            ]
        ];
    }

    public function getReservedDates()
    {
        $data = $this->sheetRepository->getReservedDates();

        foreach ($data as $key => $value) {
            $datesString = $value['reserved_dates'];
            $datesArray = explode(",", $datesString);
            $data[$key]['reserved_dates'] = $datesArray;
        }

        return $data;
    }

    public function findMyTeamSheets(?SearchParams $searchParams = null)
    {
        return $this->sheetRepository->findMyTeamSheets($searchParams);
    }





}