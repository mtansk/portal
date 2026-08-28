<?php
namespace Mtansk\Cp\Services\Auth;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Repositories\Auth\TokenRepository;
use Mtansk\Cp\Repositories\Users\UserRepository;

class TokenService
{
    private TokenRepository $tokenRepository;
    private UserRepository $userRepository;

    public function __construct(
        TokenRepository $tokenRepository,
        UserRepository $userRepository
    ) {
        $this->tokenRepository = $tokenRepository;
        $this->userRepository = $userRepository;
    }


    public function generateUniversalAuthToken(string $accountOrRegId, string $type, string $email)
    {
        try {
            $iat = time();
            $exp = $iat + authLifetime;

            $payload = [
                "iat" => $iat,
                "exp" => $exp,
                "sub" => $accountOrRegId,
                "type" => $type,
                "email" => $email
            ];

            $key = authTokenKey;

            $token = JWT::encode($payload, $key, "HS256");

            return $token;
        } catch (\Exception $e) {
            $res = new Response();
            $res->code = 500;
            $res->error_code = "AUTH-TOKEN-ENCODE";
            $res->send();
        }
    }

    public function decodeAuthorizationToken(string $token)
    {
        try {
            $key = authTokenKey;
            $decoded = JWT::decode($token, new Key($key, "HS256"));

            return (array) $decoded;
        } catch (\Exception $e) {
            $res = new Response();
            $res->code = 401;
            $res->error_code = "AUTH-TOKEN-DECODE";
            $res->send();
        }
    }




    public function generateTokensPair(string $user_id)
    {
        $user = $this->userRepository->findById($user_id);

        $iat = time();


        $JWTPayload = [
            "iat" => $iat,
            "exp" => $iat + JWTLifetime,

            "user_id" => $user_id,
            "access_level" => $user["access_level"],
        ];
        $JWT = JWT::encode($JWTPayload, JWTKey, "HS256");


        $refreshPayload = [
            "iat" => $iat,
            "exp" => $iat + refreshLifetime,

            "user_id" => $user_id
        ];
        $refreshToken = JWT::encode($refreshPayload, refreshKey, "HS256");
        $this->encodeAndStoreRefreshToken($user_id, $refreshToken, $refreshPayload["exp"]);

        return [
            "JWT" => $JWT,
            "refreshToken" => $refreshToken
        ];
    }
    private function encodeAndStoreRefreshToken(string $user_id, string $refresh_token, string $expires_at)
    {
        $encodedToken = Crypto::encryptAES($refresh_token);
        $res = $this->tokenRepository->storeRefreshToken($user_id, $encodedToken, $expires_at);

        if (!$res) {
            $response = new Response();
            $response->code = 500;
            $response->error_code = "AUTH-TOKENS-REFRESH-POST";
            $response->send();
        }
    }
    public function validateAndPurgeRefreshToken(string $refreshToken)
    {
        $payload = $this->decodeRefreshToken($refreshToken);
        $userId = $payload["user_id"];

        $existingTokens = $this->tokenRepository->findExistingRefreshTokens($userId);
        $found = false;
        foreach ($existingTokens as $existingToken) {
            $decodedToken = Crypto::decryptAES($existingToken["refresh_token_token"]);
            if ($decodedToken === $refreshToken) {
                $found = true;
                $existingTokenData = $existingToken;
                break;
            }
        }

        if (!$found) {
            $response = new Response();
            $response->code = 401;
            $response->error_code = "AUTH-TOKENS-REFRESH-INVALID";
            $response->send();
        }
        $this
            ->tokenRepository
            ->deleteRefreshTokenById($existingTokenData["refresh_token_id"]);

        return $payload;
    }


    public function decodeJWT(string $JWT)
    {
        try {
            $decoded = JWT::decode($JWT, new Key(JWTKey, "HS256"));
            return (array) $decoded;

        } catch (ExpiredException $e) {
            $res = new Response();
            $res->code = 401;
            $res->error_code = "AUTH-TOKEN-EXPIRED";
            $res->send();

        } catch (\Exception $e) {
            $res = new Response();
            $res->code = 401;
            $res->error_code = "AUTH-TOKEN-DECODE";
            $res->send();
        }
    }
    public function decodeRefreshToken(string $refreshToken)
    {
        try {
            $decoded = JWT::decode($refreshToken, new Key(refreshKey, "HS256"));
            return (array) $decoded;

        } catch (ExpiredException $e) {
            $res = new Response();
            $res->code = 401;
            $res->error_code = "AUTH-REFRESH-TOKEN-EXPIRED";
            $res->send();

        } catch (\Exception $e) {
            $res = new Response();
            $res->code = 401;
            $res->error_code = "AUTH-REFRESH-TOKEN-DECODE";
            $res->send();
        }
    }

}