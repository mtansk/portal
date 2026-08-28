<?php
namespace Mtansk\Cp\Services\Company;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Models\Company\GeneralRateModel;
use Mtansk\Cp\Repositories\Company\GeneralRateRepository;

class GeneralRateService
{

    private GeneralRateRepository $generalRateRepository;

    public function __construct(GeneralRateRepository $generalRateRepository)
    {
        $this->generalRateRepository = $generalRateRepository;
    }


    public function findAll()
    {
        return $this->generalRateRepository->findAll();
    }

    public function update(GeneralRateModel $rate, string $id)
    {
        $res = $this->generalRateRepository->update($rate, $id);
        return [
            [
                "id" => $id,
                "count" => $res
            ]
        ];
    }

    public function delete(string $id)
    {
        $res = $this->generalRateRepository->delete($id);
        return [
            "id" => $id,
            "count" => $res
        ];
    }

    public function createFromJson()
    {
        $json = Router::getInstance()->json;
        $rate = new GeneralRateModel($json);
        $user = Router::getInstance()->user;

        $id = Crypto::UUID4();

        $rows = [
            [
                $id,
                $rate->general_rate_name,
                $rate->general_rate_rate,
                $rate->general_rate_desc,
                $rate->general_rate_is_public,
                $rate->accrual_group_id,
                $user["company_id"],
            ]
        ];

        $res = $this->generalRateRepository->create($rows);

        return [
            [
                "id" => $id,
                "count" => $res
            ]
        ];
    }


}