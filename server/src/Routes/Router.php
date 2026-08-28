<?php

namespace Mtansk\Cp\Routes;

use DI\Container;
use Mtansk\Cp\Repositories\Auth\TokenRepository;
use Mtansk\Cp\Repositories\Users\UserRepository;
use Mtansk\Cp\Services\Auth\AccessStateService;
use Mtansk\Cp\Services\Auth\TokenService;
use ReflectionMethod;
use Mtansk\Cp\Routes\RoutesStorage;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Repositories\Auth\AccessStateRepository;
use Mtansk\Cp\Services\Auth\AuthGuardService;

class Router
{
    private static $instance = null;
    private AuthGuardService $authGuardService;

    public ?array $json;
    public ?array $user = null;




    private function __construct()
    {
        $this->json = json_decode(file_get_contents('php://input'), true);
        $this->authGuardService = new AuthGuardService(
            new TokenService(new TokenRepository(), new UserRepository()),
            new AccessStateService(new AccessStateRepository())
        );
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }


    public function entrypoint()
    {
        $uri = $_SERVER['REDIRECT_URL'];

        if ($uri === "/test/") {
            require ROOT . "/test/test.php";
            exit();
        }

        $routes = RoutesStorage::getRoutes();

        foreach ($routes as $route => $method) {
            //$pattern = "#^" . preg_replace('/\{[^\/]+\}/', '(.*)', $route) . "$#";
            $pattern = "#^" . preg_replace('/\{([^\/]+)\}/', '([^/]+)', $route) . "$#";
            if (!preg_match($pattern, $uri, $matches)) {
                continue;
            }

            $requestMethod = $_SERVER['REQUEST_METHOD'];
            if (!isset($method[$requestMethod])) {
                $response = new Response();
                $response->code = 405;
                $response->send();
            }

            $config = $method[$requestMethod];
            $id = $matches[1] ?? null;

            $this->program($config, $id);
            return;
        }

        $response = new Response();
        $response->code = 404;
        $response->send();
    }

    private function program(array $config, ?string $id)
    {
        $this->user = $this->authGuardService->protectRoute($config);
        $this->startController($config, $id);
        exit();
    }

    private function startController(array $config, ?string $id)
    {
        $container = new Container();

        $controller = $container->get($config['controller']);
        $method = $config['method'];

        $reflection = ReflectionMethod::createFromMethodName($config['controller'] . '::' . $config['method']);

        if ($reflection->getNumberOfParameters() === 0) {
            $controller->$method();
        } else {
            $controller->$method($id);
        }

    }




}
