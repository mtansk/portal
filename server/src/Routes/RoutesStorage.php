<?php

namespace Mtansk\Cp\Routes;

use Mtansk\Cp\Controllers\Auth\LoginController;
use Mtansk\Cp\Controllers\Transaction\TransactionController;
use Mtansk\Cp\Controllers\Users\UserController;
use Mtansk\Cp\Controllers\Auth\AccountController;
use Mtansk\Cp\Controllers\Auth\UserRegController;
use Mtansk\Cp\Controllers\Finance\DebtController;
use Mtansk\Cp\Controllers\Sheets\SheetController;
use Mtansk\Cp\Controllers\Access\InviteController;
use Mtansk\Cp\Controllers\Data\DownloadController;
use Mtansk\Cp\Controllers\Finance\TotalController;
use Mtansk\Cp\Controllers\Auth\CompanyRegController;
use Mtansk\Cp\Controllers\Finance\AccrualController;
use Mtansk\Cp\Controllers\Finance\PaymentController;
use Mtansk\Cp\Controllers\Finance\PayslipController;
use Mtansk\Cp\Controllers\Company\SheetRateController;
use Mtansk\Cp\Controllers\Finance\ReductionController;
use Mtansk\Cp\Controllers\Company\DepartmentController;
use Mtansk\Cp\Controllers\Access\SubscriptionController;
use Mtansk\Cp\Controllers\Company\GeneralRateController;
use Mtansk\Cp\Controllers\Company\AccrualGroupController;
use Mtansk\Cp\Controllers\Company\DefaultSheetController;

class RoutesStorage
{
    /*  
        access_levels = employee | manager | admin | guest
        access_states = none | download-only | sub-expired | active
    

                            "access_level" => ["guest", "employee", "manager", "admin"],
                    "access_state" => ["none", "download-only", "sub-expired", "active"]

        no_auth = true | false

        is_private_api = true | false
        "access_level" => ["guest", "employee", "manager", "admin"],
        "access_state" => ["none", "download-only", "sub-expired", "active"]


        is_public_api = true | false

    */


    public static function getRoutes(): array
    {
        $login = [
            "/api/private/auth/login/credentials/" => [
                "POST" => [
                    "controller" => LoginController::class,
                    "method" => "processCredentials",
                    "no_auth" => true
                ]
            ],
            "/api/private/auth/login/code/" => [
                "POST" => [
                    "controller" => LoginController::class,
                    "method" => "processCode",
                    "no_auth" => true
                ]
            ],
            "/api/private/auth/login/code/refresh/" => [
                "POST" => [
                    "controller" => LoginController::class,
                    "method" => "refreshCode",
                    "no_auth" => true
                ]
            ],
            "/api/private/auth/login/company/" => [
                "POST" => [
                    "controller" => LoginController::class,
                    "method" => "processCompanySelection",
                    "no_auth" => true
                ]
            ],
            "/api/private/auth/token/refresh/" => [
                "POST" => [
                    "controller" => LoginController::class,
                    "method" => "processTokenRefresh",
                    "no_auth" => true
                ]
            ]
        ];

        $restore = [
            "/api/private/auth/restore/" => [
                "POST" => [
                    "controller" => AccountController::class,
                    "method" => "restorePassword",
                    "no_auth" => true
                ]
            ]
        ];

        $companyReg = [
            "/api/private/auth/reg/company/credentials/" => [
                "POST" => [
                    "controller" => CompanyRegController::class,
                    "method" => "processRegCredentials",
                    "no_auth" => true
                ]
            ],
            "/api/private/auth/reg/company/code/" => [
                "POST" => [
                    "controller" => CompanyRegController::class,
                    "method" => "processRegCode",
                    "no_auth" => true
                ]
            ],

        ];

        $userReg = [
            "/api/private/auth/reg/user/credentials/" => [
                "POST" => [
                    "controller" => UserRegController::class,
                    "method" => "processCredentials",
                    "no_auth" => true
                ]
            ],
            "/api/private/auth/reg/user/code/" => [
                "POST" => [
                    "controller" => UserRegController::class,
                    "method" => "processCode",
                    "no_auth" => true
                ]
            ]
        ];

        $codeRefresh = [
            "/api/private/auth/code/refresh/" => [
                "POST" => [
                    "controller" => LoginController::class,
                    "method" => "refreshEmailCode",
                    "no_auth" => true
                ]
            ]
        ];

        $accessRoutes = [
            "/api/private/access/account-plans/" => [
                "GET" => [
                    "controller" => SubscriptionController::class,
                    "method" => "findAndCalculateAccountPlans",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ],
            "/api/private/access/subscriptions/" => [
                "GET" => [
                    "controller" => SubscriptionController::class,
                    "method" => "findAll",
                    "is_private_api" => true,
                    "access_level" => ["admin"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ]

        ];



        $inviteRoutes = [
            "/api/private/access/invites/" => [
                "POST" => [
                    "controller" => InviteController::class,
                    "method" => "createInvite",
                    "is_private_api" => true,
                    "access_level" => ["admin"],
                    "access_state" => ["active"]
                ],
            ],
            "/api/private/access/invites/{id}" => [
                "DELETE" => [
                    "controller" => InviteController::class,
                    "method" => "deleteInvite",
                    "is_private_api" => true,
                    "access_level" => ["admin"],
                    "access_state" => ["active"]
                ]
            ]
        ];


        $deptRoutes = [
            "/api/private/company/departments/" => [
                "GET" => [
                    "controller" => DepartmentController::class,
                    "method" => "index",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "POST" => [
                    "controller" => DepartmentController::class,
                    "method" => "store",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/company/departments/{id}" => [
                "PUT" => [
                    "controller" => DepartmentController::class,
                    "method" => "update",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ]
        ];


        // COMPANY

        $generalRatesRoutes = [
            "/api/private/company/rates/general-rates/" => [
                "GET" => [
                    "controller" => GeneralRateController::class,
                    "method" => "index",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "POST" => [
                    "controller" => GeneralRateController::class,
                    "method" => "store",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/company/rates/general-rates/{id}" => [
                "PUT" => [
                    "controller" => GeneralRateController::class,
                    "method" => "update",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ],
                "DELETE" => [
                    "controller" => GeneralRateController::class,
                    "method" => "delete",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],

        ];
        $accrualGroups = [
            "/api/private/company/accrual-groups/" => [
                "GET" => [
                    "controller" => AccrualGroupController::class,
                    "method" => "index",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "POST" => [
                    "controller" => AccrualGroupController::class,
                    "method" => "store",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/company/accrual-groups/{id}" => [
                "PUT" => [
                    "controller" => AccrualGroupController::class,
                    "method" => "update",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ]
        ];

        $sheetRates = [
            "/api/private/company/rates/sheet-rates/" => [
                "GET" => [
                    "controller" => SheetRateController::class,
                    "method" => "index",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "POST" => [
                    "controller" => SheetRateController::class,
                    "method" => "store",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/company/rates/sheet-rates/{id}" => [
                "PUT" => [
                    "controller" => SheetRateController::class,
                    "method" => "update",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ],
                "DELETE" => [
                    "controller" => SheetRateController::class,
                    "method" => "delete",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],

        ];

        $defaultSheets = [
            "/api/private/company/default-sheets/" => [
                "GET" => [
                    "controller" => DefaultSheetController::class,
                    "method" => "index",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "POST" => [
                    "controller" => DefaultSheetController::class,
                    "method" => "store",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/company/default-sheets/{id}" => [
                "PUT" => [
                    "controller" => DefaultSheetController::class,
                    "method" => "update",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ],
                "DELETE" => [
                    "controller" => DefaultSheetController::class,
                    "method" => "delete",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ]
        ];

        // USERS

        $users = [
            "/api/private/users/" => [
                "GET" => [
                    "controller" => UserController::class,
                    "method" => "index",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "POST" => [
                    "controller" => UserController::class,
                    "method" => "store",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/users/{id}" => [
                "GET" => [
                    "controller" => UserController::class,
                    "method" => "show",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "PUT" => [
                    "controller" => UserController::class,
                    "method" => "update",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ],

        ];

        $usersActions = [
            "/api/private/users/suspend/" => [
                "POST" => [
                    "controller" => UserController::class,
                    "method" => "suspend",
                    "is_private_api" => true,
                    "access_level" => ["admin"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/users/activate/" => [
                "POST" => [
                    "controller" => UserController::class,
                    "method" => "activate",
                    "is_private_api" => true,
                    "access_level" => ["admin"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/users/delete/" => [
                "POST" => [
                    "controller" => UserController::class,
                    "method" => "delete",
                    "is_private_api" => true,
                    "access_level" => ["admin"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/users/recover/" => [
                "POST" => [
                    "controller" => UserController::class,
                    "method" => "recover",
                    "is_private_api" => true,
                    "access_level" => ["admin"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/users/access-level/{id}" => [
                "PUT" => [
                    "controller" => UserController::class,
                    "method" => "updateAccessLevel",
                    "is_private_api" => true,
                    "access_level" => ["admin"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/users/mock/delete/" => [
                "POST" => [
                    "controller" => UserController::class,
                    "method" => "deleteMockUsersData",
                    "is_private_api" => true,
                    "access_level" => ["admin"],
                    "access_state" => ["active"]
                ]
            ]

        ];
        // SHEETS

        $sheets = [
            "/api/private/sheets/" => [
                "GET" => [
                    "controller" => SheetController::class,
                    "method" => "index",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "POST" => [
                    "controller" => SheetController::class,
                    "method" => "store",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/sheets/{id}" => [
                "PUT" => [
                    "controller" => SheetController::class,
                    "method" => "update",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ],
                "DELETE" => [
                    "controller" => SheetController::class,
                    "method" => "delete",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ],
                "GET" => [
                    "controller" => SheetController::class,
                    "method" => "show",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/sheets/reserved-dates/" => [
                "GET" => [
                    "controller" => SheetController::class,
                    "method" => "reservedDates",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ],
        ];

        // FINANCE

        $accruals = [
            "/api/private/finance/accruals/" => [
                "GET" => [
                    "controller" => AccrualController::class,
                    "method" => "index",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "POST" => [
                    "controller" => AccrualController::class,
                    "method" => "store",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/finance/accruals/{id}" => [
                "GET" => [
                    "controller" => AccrualController::class,
                    "method" => "show",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "PUT" => [
                    "controller" => AccrualController::class,
                    "method" => "update",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ],
                "DELETE" => [
                    "controller" => AccrualController::class,
                    "method" => "delete",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ]
        ];

        $payments = [
            "/api/private/finance/payments/" => [
                "GET" => [
                    "controller" => PaymentController::class,
                    "method" => "index",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "POST" => [
                    "controller" => PaymentController::class,
                    "method" => "store",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/finance/payments/{id}" => [
                "GET" => [
                    "controller" => PaymentController::class,
                    "method" => "show",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "PUT" => [
                    "controller" => PaymentController::class,
                    "method" => "update",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ],
                "DELETE" => [
                    "controller" => PaymentController::class,
                    "method" => "delete",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ]
        ];

        $reductions = [
            "/api/private/finance/reductions/" => [
                "GET" => [
                    "controller" => ReductionController::class,
                    "method" => "index",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "POST" => [
                    "controller" => ReductionController::class,
                    "method" => "store",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/finance/reductions/{id}" => [
                "PUT" => [
                    "controller" => ReductionController::class,
                    "method" => "update",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ],
                "DELETE" => [
                    "controller" => ReductionController::class,
                    "method" => "destroy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ],
                "GET" => [
                    "controller" => ReductionController::class,
                    "method" => "show",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ]
        ];

        $payslips = [
            "/api/private/finance/payslips/" => [
                "GET" => [
                    "controller" => PayslipController::class,
                    "method" => "index",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "POST" => [
                    "controller" => PayslipController::class,
                    "method" => "store",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/finance/payslips/{id}" => [
                "GET" => [
                    "controller" => PayslipController::class,
                    "method" => "show",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "PUT" => [
                    "controller" => PayslipController::class,
                    "method" => "update",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ],
                "DELETE" => [
                    "controller" => PayslipController::class,
                    "method" => "destroy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/finance/payslips/auto-payslips/" => [
                "POST" => [
                    "controller" => PayslipController::class,
                    "method" => "createAutoPayslips",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ]
        ];

        $payslipObjects = [
            "/api/private/finance/taxes/" => [
                "GET" => [
                    "controller" => PayslipController::class,
                    "method" => "findTaxesByPayslipId",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ],
            "/api/private/finance/tax-deductions/" => [
                "GET" => [
                    "controller" => PayslipController::class,
                    "method" => "findTaxDeductionsByPayslipId",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ],
            "/api/private/finance/social-fees/" => [
                "GET" => [
                    "controller" => PayslipController::class,
                    "method" => "findSocialFeesByPayslipId",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ],

        ];

        $debts = [
            "/api/private/finance/debts/" => [
                "GET" => [
                    "controller" => DebtController::class,
                    "method" => "index",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "POST" => [
                    "controller" => DebtController::class,
                    "method" => "store",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ],
            "/api/private/finance/debts/{id}" => [
                "GET" => [
                    "controller" => DebtController::class,
                    "method" => "show",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "PUT" => [
                    "controller" => DebtController::class,
                    "method" => "update",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ],
                "DELETE" => [
                    "controller" => DebtController::class,
                    "method" => "destroy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active"]
                ]
            ]
        ];

        $totals = [
            "/api/private/finance/totals/accruals/" => [
                "GET" => [
                    "controller" => TotalController::class,
                    "method" => "getAccrualTotals",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ],
            "/api/private/finance/totals/reductions/" => [
                "GET" => [
                    "controller" => TotalController::class,
                    "method" => "getReductionTotals",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ],
            "/api/private/finance/totals/payments/" => [
                "GET" => [
                    "controller" => TotalController::class,
                    "method" => "getPaymentTotals",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ]
        ];


        // DATA

        $downloads = [
            "/api/private/data/download/custom/" => [
                "POST" => [
                    "controller" => DownloadController::class,
                    "method" => "downloadCustom",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ]
        ];

        // "MY" ROUTES

        $myAccount = [
            "/api/private/my/account/" => [
                "GET" => [
                    "controller" => AccountController::class,
                    "method" => "findMy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ],
                "PUT" => [
                    "controller" => AccountController::class,
                    "method" => "updateMy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ],
            "/api/private/my/account/password/" => [
                "PUT" => [
                    "controller" => AccountController::class,
                    "method" => "updateMyPassword",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ]
        ];

        $myUsers = [
            "/api/private/my/users/" => [
                "GET" => [
                    "controller" => UserController::class,
                    "method" => "findMy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ],
            "/api/private/my/colleagues/" => [
                "GET" => [
                    "controller" => UserController::class,
                    "method" => "findMyColleagues",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "sub-expired"]

                ]
            ]
        ];

        $myCompany = [
            "/api/private/my/company/" => [
                "POST" => [
                    "controller" => CompanyRegController::class,
                    "method" => "createMy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ],
            "/api/private/my/company/selection/{id}" => [
                "PUT" => [
                    "controller" => LoginController::class,
                    "method" => "processMyCompanySelection",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ],
            "/api/private/my/company/join/" => [
                "POST" => [
                    "controller" => UserRegController::class,
                    "method" => "processMyEntryByCode",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "download-only", "sub-expired"]
                ]
            ],
            "/api/private/my/company/name/" => [
                "PUT" => [
                    "controller" => CompanyRegController::class,
                    "method" => "updateName",
                    "is_private_api" => true,
                    "access_level" => ["admin"],
                    "access_state" => ["active"]
                ]
            ]
        ];

        $mySheets = [
            "/api/private/my/sheets/my/" => [
                "GET" => [
                    "controller" => SheetController::class,
                    "method" => "findMy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "sub-expired"]
                ]
            ],
            "/api/private/my/sheets/team/" => [
                "GET" => [
                    "controller" => SheetController::class,
                    "method" => "findMyTeamSheets",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "sub-expired"]
                ]
            ]
        ];

        $myDepartments = [
            "/api/private/my/departments/" => [
                "GET" => [
                    "controller" => DepartmentController::class,
                    "method" => "findMy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "sub-expired"]
                ]
            ]
        ];

        $myAccruals = [
            "/api/private/my/finance/accruals/" => [
                "GET" => [
                    "controller" => AccrualController::class,
                    "method" => "findMy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "sub-expired"]
                ]
            ]
        ];

        $myPayments = [
            "/api/private/my/finance/payments/" => [
                "GET" => [
                    "controller" => PaymentController::class,
                    "method" => "findMy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "sub-expired"]
                ]
            ]
        ];

        $myReductions = [
            "/api/private/my/finance/reductions/" => [
                "GET" => [
                    "controller" => ReductionController::class,
                    "method" => "findMy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "sub-expired"]
                ]
            ]
        ];

        $myPayslips = [
            "/api/private/my/finance/payslips/" => [
                "GET" => [
                    "controller" => PayslipController::class,
                    "method" => "findMy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "sub-expired"]
                ]
            ],
            "/api/private/my/finance/payslips/{id}" => [
                "GET" => [
                    "controller" => PayslipController::class,
                    "method" => "showMy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "sub-expired"]
                ]
            ]
        ];

        $myPayslipObjects = [
            "/api/private/my/finance/taxes/" => [
                "GET" => [
                    "controller" => PayslipController::class,
                    "method" => "findMyTaxes",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "sub-expired"]
                ]
            ],
            "/api/private/my/finance/tax-deductions/" => [
                "GET" => [
                    "controller" => PayslipController::class,
                    "method" => "findMyTaxDeductions",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "sub-expired"]
                ]
            ],
            "/api/private/my/finance/social-fees/" => [
                "GET" => [
                    "controller" => PayslipController::class,
                    "method" => "findMySocialFees",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "sub-expired"]
                ]
            ]
        ];

        $myDebts = [
            "/api/private/my/finance/debts/" => [
                "GET" => [
                    "controller" => DebtController::class,
                    "method" => "findMy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "sub-expired"]
                ]
            ],
            "/api/private/my/finance/debts/{id}" => [
                "GET" => [
                    "controller" => DebtController::class,
                    "method" => "showMy",
                    "is_private_api" => true,
                    "access_level" => ["admin", "manager", "employee"],
                    "access_state" => ["active", "sub-expired"]
                ]
            ]
        ];



        // TRANSACTIONS

        $transactions = [
            "/api/private/transactions/initialize/" => [
                "POST" => [
                    "controller" => TransactionController::class,
                    "method" => "initialize",
                    "is_private_api" => true,
                    "access_level" => ["admin",],
                    "access_state" => ["active", "sub-expired"]
                ]
            ],
            "/api/private/transactions/check/" => [
                "POST" => [
                    "controller" => TransactionController::class,
                    "method" => "check",
                    "is_private_api" => true,
                    "access_level" => ["admin",],
                    "access_state" => ["active", "sub-expired"]
                ]
            ],
            "/api/private/transactions/pending/" => [
                "GET" => [
                    "controller" => TransactionController::class,
                    "method" => "findPending",
                    "is_private_api" => true,
                    "access_level" => ["admin",],
                    "access_state" => ["active", "sub-expired"]
                ]
            ]
        ];


        return array_merge(
            $users,
            $usersActions,
            $login,
            $restore,
            $accessRoutes,
            $inviteRoutes,
            $deptRoutes,
            $generalRatesRoutes,
            $accrualGroups,
            $sheetRates,
            $defaultSheets,
            $sheets,
            $accruals,
            $payslips,
            $payments,
            $reductions,
            $debts,
            $payslipObjects,
            $totals,
            $companyReg,
            $userReg,
            $codeRefresh,
            $downloads,

            // MY
            $myAccount,
            $myUsers,
            $myCompany,
            $mySheets,
            $myDepartments,
            $myAccruals,
            $myPayments,
            $myReductions,
            $myPayslips,
            $myPayslipObjects,
            $myDebts,

            // TRANSACTIONS

            $transactions
        );
    }
}