<?php
namespace Mtansk\Cp\Services\Access;

use Mtansk\Cp\Repositories\Users\UserRepository;
use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Helpers\DB\PDOConnection;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Services\Access\SubscriptionService;
use Mtansk\Cp\Repositories\Access\InviteRepository;

class InviteService
{

    private InviteRepository $inviteRepository;
    private UserRepository $userRepository;

    public function __construct(
        InviteRepository $inviteRepository,
        UserRepository $userRepository
    ) {
        $this->inviteRepository = $inviteRepository;
        $this->userRepository = $userRepository;
    }

    public function findByCodeAndFirstName(string $code, string $firstName)
    {
        return $this->inviteRepository->findByCodeAndFirstName($code, $firstName);
    }

    public function createInvite(string $userId)
    {
        PDOConnection::beginTransaction();

        $user = Router::getInstance()->user;
        $targetUser = $this->userRepository->findById($userId);
        $userBelongsToCompany = ($targetUser["company_id"] ?? null) === $user["company_id"];

        if (!$userId || !$userBelongsToCompany) {
            $response = new Response();
            $response->code = 422;
            $response->error_code = "INVITE-USER-ID";
            $response->send();
        }

        $currentInvites = $this->inviteRepository->findByUser($userId);
        if ($currentInvites > 0) {
            $response = new Response();
            $response->code = 422;
            $response->error_code = "INVITE-USER-ALREADY-INVITED";
            $response->send();
        }

        $code = Crypto::inviteCode();
        $res = $this->inviteRepository->store($code, $userId);
        if (!$res) {
            $response = new Response();
            $response->code = 500;
            $response->error_code = "INVITE-STORE";
            $response->send();
        }

        PDOConnection::commit();

        return [
            [
                "code" => $code,
                "user_id" => $userId
            ]
        ];
    }

    public function deleteInvite(string $id)
    {
        $res = $this->inviteRepository->delete($id);
        if (!$res) {
            $response = new Response();
            $response->code = 500;
            $response->error_code = "INVITE-DELETE";
            $response->send();
        }

        return true;
    }

    public function deleteAllUserInvites(string $userId)
    {
        $res = $this->inviteRepository->deleteAllUserInvites($userId);
        if (!$res) {
            $response = new Response();
            $response->code = 500;
            $response->error_code = "INVITE-DELETE-ALL";
            $response->send();
        }

        return true;
    }






}