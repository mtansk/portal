<?php
namespace Mtansk\Cp\Controllers\Access;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Services\Access\InviteService;

class InviteController
{

    private InviteService $inviteService;

    public function __construct(InviteService $inviteService)
    {
        $this->inviteService = $inviteService;
    }

    public function createInvite()
    {
        $json = Router::getInstance()->json;
        $userId = $json["user_id"] ?? null;
        $data = $this->inviteService->createInvite($userId);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function deleteInvite(string $id)
    {
        $data = $this->inviteService->deleteInvite($id);
        $res = new Response();
        $res->send();
    }





}