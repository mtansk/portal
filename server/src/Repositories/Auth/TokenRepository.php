<?php
namespace Mtansk\Cp\Repositories\Auth;

use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\Other\Crypto;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\DB\DELETEQueryNew;

class TokenRepository
{


    public function __construct()
    {
    }

    public function storeRefreshToken(string $user_id, string $refresh_token, string $expires_at)
    {
        $sql = "INSERT INTO auth.refresh_tokens
                
                (refresh_token_id,
                refresh_token_token,
                expires_at,
                user_id)

                VALUES ";

        $rows = [
            [
                Crypto::UUID4(),
                $refresh_token,
                $expires_at,
                $user_id
            ]
        ];

        $post = new POSTQueryNew($sql);
        $res = $post->executeWithRows($rows);
        return $res;
    }
    public function deleteExistingRefreshTokens(string $user_id)
    {
        $sql = "DELETE auth.refresh_tokens 
                FROM auth.refresh_tokens
                JOIN main.users ON main.users.user_id = auth.refresh_tokens.user_id
                WHERE main.users.account_id = (
                    SELECT account_id FROM main.users WHERE main.users.user_id = :user_id
                )";
        $bindings = [
            ":user_id" => $user_id
        ];

        $delete = new DELETEQueryNew($sql, $bindings);
        $res = $delete->execute();
        return $res;
    }
    public function findExistingRefreshTokens(string $user_id)
    {
        $sql = "SELECT * 
        FROM auth.refresh_tokens 
        WHERE user_id = :user_id
        AND expires_at > UNIX_TIMESTAMP(NOW())";

        $bindings = [
            ":user_id" => $user_id
        ];

        $get = new GETQueryNew($sql, $bindings);
        $res = $get->execute();

        return $res;
    }

    public function findRefreshTokenByAES(string $encryptedToken)
    {
        $sql = "SELECT * 
        FROM auth.refresh_tokens 
        WHERE refresh_token_token = :refresh_token_token
        AND expires_at > UNIX_TIMESTAMP(NOW())";

        $bindings = [
            ":refresh_token_token" => $encryptedToken
        ];

        $get = new GETQueryNew($sql, $bindings);
        $res = $get->execute();

        return $res[0] ?? null;
    }
    public function deleteRefreshTokenById(string $tokenId)
    {
        $sql = "DELETE FROM auth.refresh_tokens 
        WHERE refresh_token_id = :refresh_token_id";

        $bindings = [
            ":refresh_token_id" => $tokenId
        ];

        $delete = new DELETEQueryNew($sql, $bindings);
        $res = $delete->execute();
        return $res;
    }




}