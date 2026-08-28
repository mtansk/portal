<?php

if (!defined("ROOT")) {
	define("ROOT", __DIR__);
}


header("Cache-Control: no-cache");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");



$dbhost = "mysql";
$dbport = "3306";
$dbname = "main";
$dbusername = "root";
$dbpassword = trim(file_get_contents("/run/secrets/mysql_root_password"));




if (!defined("dbhost")) {
	define("dbhost", $dbhost);
}
if (!defined("dbport")) {
	define("dbport", $dbport);
}
if (!defined("dbname")) {
	define("dbname", $dbname);
}
if (!defined("dbusername")) {
	define("dbusername", $dbusername);
}
if (!defined("dbpassword")) {
	define("dbpassword", $dbpassword);
}


$redisHost = "redis";
$redisPort = "6379";
$redisPassword = null;

if (!defined("redisHost")) {
	define("redisHost", $redisHost);
}

if (!defined("redisPort")) {
	define("redisPort", $redisPort);
}

if (!defined("redisPassword")) {
	define("redisPassword", $redisPassword);
}





$authTokenKey = trim(file_get_contents("/run/secrets/auth_key"));

if (!defined("authTokenKey")) {
	define("authTokenKey", $authTokenKey);
}

$JWTKey = trim(file_get_contents("/run/secrets/jwt_key"));

if (!defined("JWTKey")) {
	define("JWTKey", $JWTKey);
}

$refreshKey = trim(file_get_contents("/run/secrets/refresh_key"));

if (!defined("refreshKey")) {
	define("refreshKey", $refreshKey);
}

$AESKey = trim(file_get_contents("/run/secrets/aes_key"));

if (!defined("AESKey")) {
	define("AESKey", $AESKey);
}



$JWTLifetime = 15 * 60;

if (!defined("JWTLifetime")) {
	define("JWTLifetime", $JWTLifetime);
}

$refreshLifetime = 60 * 60 * 24 * 7;

if (!defined("refreshLifetime")) {
	define("refreshLifetime", $refreshLifetime);
}

$authLifetime = 60 * 5;

if (!defined("authLifetime")) {
	define("authLifetime", $authLifetime);
}
