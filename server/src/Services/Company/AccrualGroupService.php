<?php
namespace Mtansk\Cp\Services\Company;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Models\Company\AccrualGroupModel;
use Mtansk\Cp\Repositories\Company\AccrualGroupRepository;

class AccrualGroupService
{

    private AccrualGroupRepository $accrualGroupRepository;

    public function __construct(AccrualGroupRepository $accrualGroupRepository)
    {
        $this->accrualGroupRepository = $accrualGroupRepository;
    }

    public function findAll()
    {
        return $this->accrualGroupRepository->findAll();
    }

    public function update($rate, $id)
    {
        $res = $this->accrualGroupRepository->update($rate, $id);
        return [
            "id" => $id,
            "count" => $res
        ];
    }

    public function createFromJson()
    {
        $json = Router::getInstance()->json;
        $group = new AccrualGroupModel($json);
        $user = Router::getInstance()->user;

        $id = Crypto::UUID4();

        $rows = [
            [
                $id,
                $group->accrual_group_name,
                $user["company_id"],
            ]
        ];

        $res = $this->accrualGroupRepository->create($rows);

        return [
            [
                "id" => $id,
                "count" => $res
            ]
        ];
    }



}