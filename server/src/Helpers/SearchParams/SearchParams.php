<?php

namespace Mtansk\Cp\Helpers\SearchParams;

class SearchParams
{
    public ?string $user_id;
    public ?string $start;
    public ?string $end;
    public ?string $payslip_id;
    public ?string $extended_payslip_id;
    public ?string $show_deleted;
    public ?string $show_only_active;

    public ?string $id = null;

    public function __construct(array $params)
    {
        $this->user_id = $params['user_id'] ?? null;
        $this->start = $params['start'] ?? null;
        $this->end = $params['end'] ?? null;
        $this->payslip_id = $params['payslip_id'] ?? null;
        $this->extended_payslip_id = $params['extended_payslip_id'] ?? null;
        $this->show_deleted = $params['show_deleted'] ?? null;
        $this->show_only_active = $params['show_only_active'] ?? null;
    }

}


/* 
export type GETParams = {
    user_id?: string;
    start?: string;
    end?: string;
    payslip_id?: string;
    extended_payslip_id?: string;
    show_deleted?: string;
    show_only_active?: string;
    paramsString?: string;
};

*/