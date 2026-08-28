<?php

namespace Mtansk\Cp\Services\Users;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Models\Users\UserModel;
use Mtansk\Cp\Helpers\DB\PDOConnection;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Services\Access\InviteService;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;
use Mtansk\Cp\Repositories\Access\InviteRepository;
use Mtansk\Cp\Repositories\Users\UserRepository;

class UserService
{
    private UserRepository $userRepository;
    private InviteService $inviteService;
    private InviteRepository $inviteRepository;

    public function __construct(
        UserRepository $userRepository,
        InviteService $inviteService,
        InviteRepository $inviteRepository
    ) {
        $this->userRepository = $userRepository;
        $this->inviteService = $inviteService;
        $this->inviteRepository = $inviteRepository;
    }

    public function findAll(?SearchParams $searchParams = null)
    {
        return $this->userRepository->findAll($searchParams);
    }

    public function findById(string $id)
    {
        $user = $this->userRepository->findById($id);
        return [$user];
    }

    public function update(UserModel $user, string $id)
    {
        $res = $this->userRepository->update($user, $id);
        $data = [
            [
                "count" => $res,
                "id" => $id
            ]
        ];
        return $data;
    }

    public function create(array $inputUser)
    {
        PDOConnection::beginTransaction();

        $user = Router::getInstance()->user;

        $searchParams = new SearchParams([
            "show_deleted" => "true"
        ]);
        $usersCount = $this->userRepository->findAll($searchParams);
        if (count($usersCount) >= 200) {
            $response = new Response();
            $response->code = 400;
            $response->error_code = "USER-LIMIT";
            $response->send();
        }


        $userModel = new UserModel($inputUser);
        $postInvite = isset($inputUser["post_invite"]) ? $inputUser["post_invite"] : false;

        $userId = Crypto::UUID4();
        $rows = [
            [
                $userId,
                $userModel->first_name,
                $userModel->last_name,
                $userModel->middle_name,
                $userModel->user_title,
                $userModel->user_email,
                $userModel->user_phone,
                $userModel->user_telegram,
                NULL,
                NULL,
                NULL,
                $user["company_id"],
                $userModel->department_id,
            ]
        ];

        $res = $this->userRepository->create($rows);

        if ($postInvite && $res) {
            $postInvRes = $this->inviteService->createInvite($userId);
            if (!$postInvRes) {
                $response = new Response();
                $response->code = 500;
                $response->error_code = "INVITE-STORE";
            }
        }

        return $res;
    }

    public function findMy()
    {
        $data = $this->userRepository->findMy();
        return $data;
    }

    public function findMyColleagues()
    {
        $data = $this->userRepository->findMyColleagues();
        return $data;
    }

    public function suspendUser(string $userId)
    {
        PDOConnection::beginTransaction();
        $user = Router::getInstance()->user;
        $targetUser = $this->userRepository->findById($userId);
        if ($targetUser["company_id"] !== $user["company_id"]) {
            $response = new Response();
            $response->code = 403;
            $response->send();
        }

        $res = $this->userRepository->suspendUser($userId);
        PDOConnection::commit();
        return $res;
    }

    public function activateUser(string $userId)
    {
        PDOConnection::beginTransaction();
        $user = Router::getInstance()->user;
        $targetUser = $this->userRepository->findById($userId);
        if ($targetUser["company_id"] !== $user["company_id"]) {
            $response = new Response();
            $response->code = 403;
            $response->send();
        }

        $res = $this->userRepository->activateUser($userId, $targetUser["account_id"]);
        PDOConnection::commit();
        return $res;
    }

    public function deleteUser(string $userId)
    {
        PDOConnection::beginTransaction();
        $user = Router::getInstance()->user;
        $targetUser = $this->userRepository->findById($userId);
        if ($targetUser["company_id"] !== $user["company_id"]) {
            $response = new Response();
            $response->code = 403;
            $response->send();
        }

        $this->inviteRepository->deleteAllUserInvites($userId);
        $res = $this->userRepository->deleteUser($userId);
        PDOConnection::commit();
        return $res;
    }

    public function recoverUser(string $userId)
    {
        PDOConnection::beginTransaction();
        $user = Router::getInstance()->user;
        $targetUser = $this->userRepository->findById($userId);
        if ($targetUser["company_id"] !== $user["company_id"]) {
            $response = new Response();
            $response->code = 403;
            $response->send();
        }

        $res = $this->userRepository->recoverUser($userId);
        PDOConnection::commit();
        return $res;
    }

    public function updateAccessLevel(string $userId, string $accessLevel)
    {
        $res = $this->userRepository->updateAccessLevel($userId, $accessLevel);
        return $res;
    }

    public function deleteMockUsersData()
    {
        $res = $this->userRepository->deleteMockUsersData();
        return $res;
    }

}