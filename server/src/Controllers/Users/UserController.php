<?php

namespace Mtansk\Cp\Controllers\Users;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Models\Users\UserModel;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Services\Users\UserService;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;

class UserController
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        $searchParams = new SearchParams($_GET);
        $data = ($this->userService->findAll($searchParams));
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function show($id)
    {
        $data = $this->userService->findById($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function update($id)
    {
        $json = Router::getInstance()->json;
        $userModel = new UserModel($json);
        $data = $this->userService->update($userModel, $id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function store()
    {
        $json = Router::getInstance()->json;
        $data = $this->userService->create($json);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function findMy()
    {
        $data = $this->userService->findMy();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function findMyColleagues()
    {
        $data = $this->userService->findMyColleagues();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function suspend()
    {
        $json = Router::getInstance()->json;
        $id = $json["user_id"] ?? "";
        $data = $this->userService->suspendUser($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function activate()
    {
        $json = Router::getInstance()->json;
        $id = $json["user_id"] ?? "";
        $data = $this->userService->activateUser($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function delete()
    {
        $json = Router::getInstance()->json;
        $id = $json["user_id"] ?? "";
        $data = $this->userService->deleteUser($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function recover()
    {
        $json = Router::getInstance()->json;
        $id = $json["user_id"] ?? "";
        $data = $this->userService->recoverUser($id);
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function updateAccessLevel(string $id)
    {
        $json = Router::getInstance()->json;
        $data = $this->userService->updateAccessLevel($id, $json["access_level"] ?? "");
        $res = new Response();
        $res->data = $data;
        $res->send();
    }

    public function deleteMockUsersData()
    {
        $data = $this->userService->deleteMockUsersData();
        $res = new Response();
        $res->data = $data;
        $res->send();
    }
}