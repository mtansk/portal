<?php
namespace Mtansk\Cp\Services\Company;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Models\Company\DepartmentModel;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Repositories\Company\DepartmentRepository;

class DepartmentsService
{
    private DepartmentRepository $departmentRepository;

    public function __construct(DepartmentRepository $departmentRepository)
    {
        $this->departmentRepository = $departmentRepository;
    }

    public function findAll(?SearchParams $searchParams = null)
    {
        return $this->departmentRepository->findAll($searchParams);
    }

    public function createFromJson()
    {
        $json = Router::getInstance()->json;
        $dept = new DepartmentModel($json);
        $user = Router::getInstance()->user;

        $id = Crypto::UUID4();

        $rows = [
            [
                $id,
                $dept->department_name,
                $dept->department_color,
                $user["company_id"]
            ]
        ];

        $res = $this->departmentRepository->create($rows);
        if (!$res) {
            $response = new Response();
            $response->code = 500;
            $response->error_code = "DEPT-CREATE";
            $response->send();
        }

        return [
            [
                "id" => $id
            ]
        ];
    }

    public function update(DepartmentModel $dept, string $id)
    {
        $res = $this->departmentRepository->update($dept, $id);
        return [
            [
                "id" => $id,
                "count" => $res
            ]
        ];
    }

    public function findMy()
    {
        return $this->departmentRepository->findMy();
    }
}