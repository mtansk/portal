<?php
namespace Mtansk\Cp\Services\Auth;

use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Services\Auth\TokenService;
use Mtansk\Cp\Services\Auth\AccessStateService;

class AuthGuardService
{
    private TokenService $tokenService;
    private AccessStateService $accessStateService;

    public function __construct(TokenService $tokenService, AccessStateService $accessStateService)
    {
        $this->tokenService = $tokenService;
        $this->accessStateService = $accessStateService;
    }

    public function protectRoute(array $config)
    {
        $no_auth = $config['no_auth'] ?? false;
        if ($no_auth) {
            return;
        }


        $is_private_api = $config['is_private_api'] ?? false;
        if ($is_private_api) {
            return $this->processPrivateApi($config);
        }

    }

    private function processPrivateApi(array $config)
    {
        $token = $this->getTokenFromHeader();
        if (!$token) {
            $response = new Response();
            $response->code = 401;
            $response->error_code = "AUTH-TOKEN-INVALID";
            $response->send();
        }

        $payload = $this->tokenService->decodeJWT($token);
        $accessState = $this->accessStateService->getCachedAccessState($payload['user_id']);

        if ($payload["iat"] < $accessState["credentials_changed"]) {
            $response = new Response();
            $response->code = 401;
            $response->error_code = "AUTH-TOKEN-INVALID";
            $response->send();
        }

        if ($payload["access_level"] !== $accessState["access_level"]) {
            $response = new Response();
            $response->code = 401;
            $response->error_code = "AUTH-TOKEN-INVALID";
            $response->send();
        }

        if (
            array_search($accessState["access_level"], $config["access_level"]) === false ||
            array_search($accessState["access_state"], $config["access_state"]) === false
        ) {
            $response = new Response();
            $response->code = 403;
            $response->send();
        }

        return $accessState;
    }



    /*   private function processToken()
      {
          $token = $this->getTokenFromHeader();

      } */

    private function getTokenFromHeader()
    {
        $headers = apache_request_headers();
        $headers = array_change_key_case($headers, CASE_LOWER);
        $authHeader = $headers['authorization'] ?? null;


        if (!$authHeader) {
            return null;
        }

        $isBearer = strpos($authHeader, "Bearer ") === 0;
        if (!$isBearer) {
            return null;
        }

        $token = substr($authHeader, 7);
        return $token;
    }



}