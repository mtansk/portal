<?php
namespace Mtansk\Cp\Controllers\Data;

use Mtansk\Cp\Services\Data\DownloadService;

class DownloadController
{
    private DownloadService $downloadService;

    public function __construct(DownloadService $downloadService)
    {
        $this->downloadService = $downloadService;
    }

    public function downloadCustom()
    {
        $this->downloadService->downloadCustom();
    }
}