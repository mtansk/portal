<?php
namespace Mtansk\Cp\Services\Transaction;

use Mtansk\Cp\Helpers\DB\PDOConnection;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Repositories\Transaction\TransactionRepository;
use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Services\Access\SubscriptionService;
use YooKassa\Client;
use YooKassa\Request\Payments\CreatePaymentResponse;

class TransactionService
{
    private TransactionRepository $transactionRepository;
    private SubscriptionService $subscriptionService;

    public function __construct(
        TransactionRepository $transactionRepository,
        SubscriptionService $subscriptionService
    ) {
        $this->transactionRepository = $transactionRepository;
        $this->subscriptionService = $subscriptionService;
    }

    public function findPending()
    {
        return $this->transactionRepository->findPending();
    }

    public function initializePayment(array $json)
    {
        PDOConnection::beginTransaction();
        $user = Router::getInstance()->user;

        $qty = $this->getQty($json);
        $total = \priceBasic * $qty;
        $payment = $this->createSubPayment($qty, $total);


        $transactionId = Crypto::UUID4();
        $rows = [
            [
                "transaction_id" => $transactionId,
                "transaction_product" => "subBasic",
                "transaction_qty" => $qty,
                "transaction_total" => $total,
                "transaction_status" => $payment->getStatus(),
                "user_id" => $user["user_id"],
                "company_id" => $user["company_id"],
                "payment_id" => $payment->getId(),
            ]
        ];
        $res = $this->transactionRepository->store($rows);
        if (!$res) {
            $res = new Response();
            $res->error_code = "PAYMENT-INITIALIZE";
            $res->code = 500;
            $res->send();
        }

        $ct = $payment->getConfirmation()->getConfirmationToken();
        $data = [
            "ct" => $ct,
            "transaction_id" => $transactionId,
        ];

        PDOConnection::commit();
        return $data;
    }

    private function createSubPayment(int $months, float $total): CreatePaymentResponse
    {
        try {
            $user = Router::getInstance()->user;
            $companyId = $user["company_id"];
            $desc = "Подписка на Портал на {$months} мес. {$companyId}";

            $client = $this->getClient();
            $payment = $client->createPayment(
                [
                    'amount' => [
                        "value" => $total,
                        'currency' => 'RUB',
                    ],
                    'confirmation' => [
                        'type' => 'embedded',
                    ],
                    'capture' => true,
                    'description' => $desc,
                    "save_payment_method" => false,
                    "merchant_customer_id" => $user["user_id"],
                ],
                Crypto::UUID4()
            );
            return $payment;
        } catch (\Exception $e) {
            $res = new Response();
            $res->error_code = "PAYMENT-INITIALIZE";
            $res->code = 500;
            $res->send();
        }

    }

    private function getQty(array $json)
    {
        return isset($json["qty"]) && filter_var($json["qty"], FILTER_VALIDATE_INT, ["options" => ["min_range" => 1, "max_range" => 12]]) !== false
            ? (int) $json["qty"]
            : 1;
    }

    public function checkPayment(array $json)
    {
        /*   return [
              [
                  "status" => "pending",
                  "details" => "22"
              ]
          ]; */

        try {
            $transactionId = $json["transaction_id"] ?? null;
            $transaction = $this->transactionRepository->find($transactionId);

            if (!$transaction) {
                $res = new Response();
                $res->error_code = "PAYMENT-TRANSACTION-CHECK";
                $res->code = 422;
                $res->send();
            }

            if ($transaction["transaction_status"] !== "pending") {
                return [
                    [
                        "status" => $transaction["transaction_status"],
                    ]
                ];
            }


            $client = $this->getClient();
            $payment = $client->getPaymentInfo($transaction["payment_id"]);
            if (!$payment) {
                $res = new Response();
                $res->error_code = "PAYMENT-TRANSACTION-CHECK";
                $res->code = 500;
                $res->send();
            }

            $status = $payment->getStatus();
            $data = [
                "transaction_id" => $transactionId,
                "status" => $status,
            ];
            $this->transactionRepository->updateStatus($data);

            if ($status === "succeeded") {
                if ($transaction["transaction_status"] === "pending") {
                    $subId = $this->subscriptionService->createSubscription(
                        (int) $transaction["transaction_qty"],
                        $transaction["company_id"],
                        $transactionId
                    );
                    if (!$subId) {
                        $res = new Response();
                        $res->error_code = "PAYMENT-TRANSACTION-SUB";
                        $res->code = 500;
                        $res->send();
                    }
                }
                return [
                    [
                        "status" => $status,
                    ]
                ];
            }

            if ($status === "canceled") {
                $details = $payment->getCancellationDetails();
                return [
                    [
                        "status" => $status,
                        "details" => $details,
                    ]
                ];
            }


            return [
                [
                    "status" => $status,
                ]
            ];
        } catch (\Exception $e) {
            $res = new Response();
            $res->error_code = "PAYMENT-TRANSACTION-CHECK2";
            $res->message = $e->getMessage();
            $res->code = 500;
            $res->send();
        }

    }





    private function getClient(): Client
    {
        $client = new Client();
        $client->setAuth("1044105", \kassa_key);
        return $client;
    }

}