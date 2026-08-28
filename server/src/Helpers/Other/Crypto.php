<?php
namespace Mtansk\Cp\Helpers\Other;


class Crypto
{
    public static function UUID4()
    {
        $data = random_bytes(16);

        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);

        return vsprintf("%s%s-%s-%s-%s-%s%s%s", str_split(bin2hex($data), 4));
    }

    public static function sixFig()
    {
        return rand(100000, 999999);
    }

    public static function inviteCode()
    {
        return substr(strtoupper(bin2hex(random_bytes(4))), 0, 5);
    }

    public static function tempPassword()
    {
        return substr(strtoupper(bin2hex(random_bytes(4))), 0, 8);
    }

    public static function encryptAES(string $data)
    {
        $iv = random_bytes(16);
        $encrypted = openssl_encrypt($data, 'AES-256-CBC', AESKey, OPENSSL_RAW_DATA, $iv);
        return base64_encode($iv . $encrypted);
    }
    public static function decryptAES(string $data)
    {
        $data = base64_decode($data);
        $iv = substr($data, 0, 16);
        $encryptedToken = substr($data, 16);
        return openssl_decrypt($encryptedToken, 'AES-256-CBC', AESKey, OPENSSL_RAW_DATA, $iv);
    }
}