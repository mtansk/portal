<?php
namespace Mtansk\Cp\Services\Finance;

use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Repositories\Finance\TotalRepository;

class TotalService
{

    private TotalRepository $totalRepository;

    public function __construct()
    {
        $this->totalRepository = new TotalRepository();
    }

    public function getAccrualTotals(SearchParams $searchParams, string $basis): array
    {
        $accruals = $this->totalRepository->getAccrualsTotals($searchParams, $basis);
        $sheets = $this->totalRepository->getSheetsTotals($searchParams, $basis);

        return $this->mergeTotals($accruals, $sheets, $basis);
    }

    public function getReductionTotals(SearchParams $searchParams, string $basis): array
    {
        $reductions = $this->totalRepository->getReductionsTotals($searchParams, $basis);
        return $reductions;
    }

    public function getPaymentTotals(SearchParams $searchParams, string $basis): array
    {
        $payments = $this->totalRepository->getPaymentsTotals($searchParams, $basis);
        return $payments;
    }

    private function mergeTotals(array $arr1, array $arr2, string $basis): array
    {
        $combined = array_merge($arr1, $arr2);
        $result = [];

        foreach ($combined as $item) {
            $key = match ($basis) {
                'daily' => $item['user_id'] . '_' . $item['date'],
                'weekly' => $item['user_id'] . '_' . $item['week'] . '_' . $item['year'],
                'monthly' => $item['user_id'] . '_' . $item['month'] . '_' . $item['year'],
                default => null,
            };

            if ($key === null) {
                continue;
            }

            if (!isset($result[$key])) {
                $result[$key] = $item;
            } else {
                $result[$key]['total'] = (string) ((float) $result[$key]['total'] + (float) $item['total']);
            }
        }

        return array_values($result);
    }








}