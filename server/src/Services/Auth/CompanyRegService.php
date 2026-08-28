<?php
namespace Mtansk\Cp\Services\Auth;

use Mtansk\Cp\Helpers\Other\Filter;
use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Helpers\DB\PDOConnection;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Services\Auth\TokenService;
use Mtansk\Cp\Models\Auth\CompanyRegModel;
use Mtansk\Cp\Services\Auth\EmailCodeService;
use Mtansk\Cp\Repositories\Users\UserRepository;
use Mtansk\Cp\Repositories\Auth\AccountRepository;
use Mtansk\Cp\Repositories\Sheets\SheetRepository;
use Mtansk\Cp\Repositories\Auth\CompanyRegRepository;
use Mtansk\Cp\Repositories\Company\CompanyRepository;
use Mtansk\Cp\Repositories\Finance\AccrualRepository;
use Mtansk\Cp\Repositories\Finance\ReductionRepository;
use Mtansk\Cp\Repositories\Company\DepartmentRepository;

class CompanyRegService
{

    private CompanyRegRepository $companyRegRepository;
    private AccountRepository $accountRepository;
    private TokenService $tokenService;
    private EmailCodeService $emailCodeService;
    private AccessStateService $accessStateService;
    private UserRepository $userRepository;
    private DepartmentRepository $departmentRepository;
    private CompanyRepository $companyRepository;
    private SheetRepository $sheetRepository;
    private AccrualRepository $accrualRepository;
    private ReductionRepository $reductionRepository;
    private AuthPayloadService $authPayloadService;

    public function __construct(
        CompanyRegRepository $companyRegRepository,
        AccountRepository $accountRepository,
        TokenService $tokenService,
        EmailCodeService $emailCodeService,
        AccessStateService $accessStateService,
        UserRepository $userRepository,
        DepartmentRepository $departmentRepository,
        CompanyRepository $companyRepository,
        SheetRepository $sheetRepository,
        AccrualRepository $accrualRepository,
        ReductionRepository $reductionRepository,
        AuthPayloadService $authPayloadService
    ) {
        $this->companyRegRepository = $companyRegRepository;
        $this->accountRepository = $accountRepository;
        $this->tokenService = $tokenService;
        $this->emailCodeService = $emailCodeService;
        $this->accessStateService = $accessStateService;
        $this->userRepository = $userRepository;
        $this->departmentRepository = $departmentRepository;
        $this->companyRepository = $companyRepository;
        $this->sheetRepository = $sheetRepository;
        $this->accrualRepository = $accrualRepository;
        $this->reductionRepository = $reductionRepository;
        $this->authPayloadService = $authPayloadService;
    }

    public function processRegCredentials(array $json)
    {
        PDOConnection::beginTransaction();

        $email = $json["email"] ?? "";

        $existingUser = $this->accountRepository->findByEmail($email);
        if ($existingUser) {
            $res = new Response();
            $res->code = 422;
            $res->error_code = "AUTH-REG-EMAIL-EXISTS";
            $res->send();
        }

        $regId = Crypto::UUID4();
        $regModel = new CompanyRegModel($json);
        $email = $regModel->email;

        $storeRes = $this->companyRegRepository->storeRegInfo($regModel, $regId);

        if (!$storeRes) {
            $res = new Response();
            $res->code = 500;
            $res->error_code = "AUTH-REG-INSERT-INITIAL";
            $res->send();
        }

        $token = $this
            ->tokenService
            ->generateUniversalAuthToken($regId, "reg", $email);
        $this->emailCodeService->sendCode($email, $regId, "reg");

        PDOConnection::commit();

        $data = [["token" => $token]];
        return $data;
    }

    public function processRegCode(array $json)
    {
        PDOConnection::beginTransaction();

        $token = $json["token"] ?? "";
        $payload = $this->tokenService->decodeAuthorizationToken($token);

        $code = $json["code"] ?? "";
        $this->emailCodeService->validateCode($code, $payload["sub"], "reg");

        $regInfo = $this->companyRegRepository->findRegInfo($payload["sub"]);
        if (!$regInfo) {
            $res = new Response();
            $res->code = 500;
            $res->error_code = "AUTH-REG-ID";
            $res->send();
        }


        $account_id = Crypto::UUID4();
        $company_id = Crypto::UUID4();
        $dept_id = Crypto::UUID4();
        $user_id = Crypto::UUID4();

        $this->createAccount($regInfo, $account_id);

        $companyRows = [
            [
                "company_id" => $company_id,
                "company_name" => $regInfo["company_name"],
            ]
        ];

        $userRows = [
            [
                "user_id" => $user_id,
                "first_name" => $regInfo["first_name"],
                "last_name" => NULL,
                "middle_name" => NULL,
                "user_title" => "Руководитель",
                "user_email" => $regInfo["email"],
                "user_phone" => NULL,
                "user_telegram" => NULL,
                "access_level" => "admin",
                "account_status" => "active",
                "account_id" => $account_id,
                "company_id" => $company_id,
                "department_id" => $dept_id
            ]
        ];

        $deptRows = [
            [
                "department_id" => $dept_id,
                "department_name" => "Ваш первый отдел",
                "department_color" => "#efdfff",
                "company_id" => $company_id
            ]
        ];


        $this->createCompany(
            $companyRows,
            $userRows,
            $deptRows
        );

        if ($regInfo["use_template"]) {
            $this->createMockData($company_id, $dept_id);
        }



        $accessState = $this->accessStateService->getCachedAccessState($user_id);
        $tokens = $this->tokenService->generateTokensPair($user_id);



        PDOConnection::commit();

        return [array_merge($tokens, $accessState)];



    }

    public function createMyCompany(array $json)
    {
        PDOConnection::beginTransaction();

        $user = Router::getInstance()->user;

        $account = $this->accountRepository->findById($user["account_id"]);

        $company_id = Crypto::UUID4();
        $dept_id = Crypto::UUID4();
        $user_id = Crypto::UUID4();

        $filter = new Filter($json);
        $companyRows = [
            [
                "company_id" => $company_id,
                "company_name" => $filter->validate("companyName", "name"),
            ]
        ];

        $userRows = [
            [
                "user_id" => $user_id,
                "first_name" => $account["first_name"],
                "last_name" => NULL,
                "middle_name" => NULL,
                "user_title" => "Руководитель",
                "user_email" => $account["account_email"],
                "user_phone" => NULL,
                "user_telegram" => NULL,
                "access_level" => "admin",
                "account_status" => "active",
                "account_id" => $user["account_id"],
                "company_id" => $company_id,
                "department_id" => $dept_id
            ]
        ];

        $deptRows = [
            [
                "department_id" => $dept_id,
                "department_name" => "Ваш первый отдел",
                "department_color" => "#efdfff",
                "company_id" => $company_id
            ]
        ];


        $this->createCompany(
            $companyRows,
            $userRows,
            $deptRows
        );

        if ($json["useTemplate"]) {
            $this->createMockData($company_id, $dept_id);
        }

        $payload = $this->authPayloadService->getAuthorizationPayload($user_id);

        PDOConnection::commit();
        /*   PDOConnection::rollback(); */

        return [$payload];
    }


    public function createAccount(array $regInfo, string $account_id)
    {
        $rows = [
            [
                $account_id,
                "username",
                $regInfo["password"],
                time(),
                $regInfo["first_name"],
                $regInfo["email"],
                NULL
            ]
        ];

        $res = $this->accountRepository->create($rows);
        self::handleRes($res);
    }


    public function createCompany(
        array $companyRows,
        array $userRows,
        array $deptRows
    ) {
        $company_id = $companyRows[0]["company_id"];
        $user_id = $userRows[0]["user_id"];

        $companyRes = $this->companyRepository->create($companyRows);
        self::handleRes($companyRes);

        $deptRes = $this->departmentRepository->create($deptRows);
        self::handleRes($deptRes);

        $userRes = $this->userRepository->create($userRows);
        self::handleRes($userRes);


        $rootUserRes = $this->companyRegRepository->storeRootUser($company_id, $user_id);
        self::handleRes($rootUserRes);

        $subRes = $this->companyRegRepository->storeSubscription($company_id);
        self::handleRes($subRes);
    }

    public function createMockData(
        string $company_id,
        string $dept_id,
    ) {
        $userId = Crypto::UUID4();
        $userRows = [
            [
                "user_id" => $userId,
                "first_name" => "Имя",
                "last_name" => "Выдуманное",
                "middle_name" => NULL,
                "user_title" => "Тестовый сотрудник",
                "user_email" => "mail@example.com",
                "user_phone" => NULL,
                "user_telegram" => "@example",
                "access_level" => NULL,
                "account_status" => NULL,
                "account_id" => NULL,
                "company_id" => $company_id,
                "department_id" => $dept_id
            ]
        ];
        $userRes = $this->userRepository->create($userRows);
        self::handleRes($userRes);

        $mockRes = $this->userRepository->insertMockUserId($userId, $company_id);
        self::handleRes($mockRes);

        $sheetRows = [
            [
                'user_id' => $userId,
                'sheet_date' => date('Y-m-d'),
                'sheet_id' => Crypto::UUID4(),

                'sheet_p_st' => 8 * 60 * 60,  // 08:00
                'sheet_p_en' => 16 * 60 * 60, // 16:00
                'break_dur_p' => 1 * 60 * 60, // 1 час
                'sheet_plus_day_p' => 0,

                'sheet_f_st' => 8 * 60 * 60,  // 08:00
                'sheet_f_en' => 15 * 60 * 60, // 15:00
                'break_dur_f' => 1 * 60 * 60, // 1 час
                'sheet_plus_day_f' => 0,

                'sheet_rate' => 100.0000,
                'measure_type' => 'hour',

                'use_f_dur' => 1,
                'use_f_payment' => 1,
                'use_overtime_dur' => 0,

                'sheet_desc' => 'Обычная смена',

                'sheet_overtime_rate' => null,
                'sheet_overtime_time' => null,

                'sheet_status' => 'workday',
                'payslip_id' => null,
                "company_id" => $company_id,
            ],
            [
                'user_id' => $userId,
                'sheet_date' => date('Y-m-d', strtotime('+1 day')),
                'sheet_id' => Crypto::UUID4(),

                'sheet_p_st' => 9 * 60 * 60,  // 09:00
                'sheet_p_en' => 17 * 60 * 60, // 17:00
                'break_dur_p' => 45 * 60,     // 45 минут
                'sheet_plus_day_p' => 0,

                'sheet_f_st' => 9 * 60 * 60,  // 09:00
                'sheet_f_en' => 16 * 60 * 60, // 16:00
                'break_dur_f' => 45 * 60,     // 45 минут
                'sheet_plus_day_f' => 0,

                'sheet_rate' => 120.0000,
                'measure_type' => 'hour',

                'use_f_dur' => 1,
                'use_f_payment' => 1,
                'use_overtime_dur' => 1,

                'sheet_desc' => 'Смена с небольшой переработкой',

                'sheet_overtime_rate' => 150.0000,
                'sheet_overtime_time' => 1 * 60 * 60, // 1 час

                'sheet_status' => 'workday',
                'payslip_id' => null,
                "company_id" => $company_id,
            ],
            [
                'user_id' => $userId,
                'sheet_date' => date('Y-m-d', strtotime('+2 days')),
                'sheet_id' => Crypto::UUID4(),

                'sheet_p_st' => 10 * 60 * 60,  // 10:00
                'sheet_p_en' => 14 * 60 * 60,  // 14:00
                'break_dur_p' => 30 * 60,      // 30 минут
                'sheet_plus_day_p' => 0,

                'sheet_f_st' => null,
                'sheet_f_en' => null,
                'break_dur_f' => null,
                'sheet_plus_day_f' => 0,

                'sheet_rate' => 80.0000,
                'measure_type' => 'hour',

                'use_f_dur' => 0,
                'use_f_payment' => 0,
                'use_overtime_dur' => 0,

                'sheet_desc' => 'Короткий день',

                'sheet_overtime_rate' => null,
                'sheet_overtime_time' => null,

                'sheet_status' => 'workday',
                'payslip_id' => null,
                "company_id" => $company_id,
            ],
            [
                'user_id' => $userId,
                'sheet_date' => date('Y-m-d', strtotime('+3 days')),
                'sheet_id' => Crypto::UUID4(),

                'sheet_p_st' => null,
                'sheet_p_en' => null,
                'break_dur_p' => null,
                'sheet_plus_day_p' => 0,

                'sheet_f_st' => null,
                'sheet_f_en' => null,
                'break_dur_f' => null,
                'sheet_plus_day_f' => 0,

                'sheet_rate' => 0,
                'measure_type' => 'hour',

                'use_f_dur' => 0,
                'use_f_payment' => 0,
                'use_overtime_dur' => 0,

                'sheet_desc' => null,

                'sheet_overtime_rate' => null,
                'sheet_overtime_time' => null,

                'sheet_status' => 'dayoff',
                'payslip_id' => null,
                "company_id" => $company_id,
            ],
        ];

        $sheetRes = $this->sheetRepository->create($sheetRows);
        self::handleRes($sheetRes);

        $accrualRows = [
            [
                "user_id" => $userId,
                "accrual_date" => date('Y-m-d'),
                "accrual_id" => Crypto::UUID4(),
                "accrual_name" => "Начисление за какую-то работу",
                "accrual_rate" => 100.0000,
                "accrual_qty" => 5,
                "accrual_desc" => "Обычное начисление, у которого есть ставка и количество.",
                "accrual_group_id" => null,
                "payslip_id" => null,
                "company_id" => $company_id
            ],
            [
                "user_id" => $userId,
                "accrual_date" => date('Y-m-d', strtotime('+1 day')),
                "accrual_id" => Crypto::UUID4(),
                "accrual_name" => "Начисление с процентами, а не с количеством",
                "accrual_rate" => 0.1025,
                "accrual_qty" => 10_000,
                "accrual_desc" => "Гибкость ставки заключается в том, что ее можно интерпретировать как процент. В данном случае ставка 0,1025 означает 10,25%",
                "accrual_group_id" => null,
                "payslip_id" => null,
                "company_id" => $company_id
            ]
        ];
        $accrualRes = $this->accrualRepository->create($accrualRows);
        self::handleRes($accrualRes);

        $reductionRows = [
            [
                "user_id" => $userId,
                "reduction_date" => date('Y-m-d'),
                "reduction_id" => Crypto::UUID4(),
                "reduction_name" => "Булочка из буфета",
                "reduction_rate" => 100,
                "reduction_qty" => 1,
                "reduction_desc" => "Просто вычет за булочку",
                "debt_id" => null,
                "payslip_id" => null,
                "company_id" => $company_id
            ]
        ];
        $reductionRes = $this->reductionRepository->create($reductionRows);
        self::handleRes($reductionRes);

    }


    public function updateName(array $json, string $id)
    {
        $filter = new Filter($json);
        $name = $filter->validate("company_name", "name");
        $res = $this->companyRepository->update($name, $id);
        $data = [
            [
                "id" => $id,
                "count" => $res
            ]
        ];
        return $data;
    }



    private static function handleRes(string|int $res)
    {
        if (!$res) {
            $res = new Response();
            $res->code = 500;
            $res->error_code = "AUTH-REG-INSERT-MAIN";
            $res->send();
        }
    }


}