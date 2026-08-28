<?php



require_once __DIR__ . "/config.php";

require_once 'vendor/autoload.php';




use Mtansk\Cp\Routes\Router;
Router::getInstance()->entrypoint();







use Mtansk\Cp\Helpers\Response\Response;
$response = new Response();
$response->code = 404;
$response->message = "Global routing error";
$response->error_code = "ROUTER-GLOBAL";
$response->send();
exit();