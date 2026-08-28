<?php
namespace Mtansk\Cp\Helpers\Response;

use Mtansk\Cp\Helpers\DB\PDOConnection;




class Response
{
    public $code = 200;
    public $message = "";
    public $error_code = "";
    public $data = [];

    public function __construct()
    {
    }

    public function send(): never
    {
        $pdo = PDOConnection::getInstance()->getConnection();
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        $this->data =
            is_array($this->data) && array_is_list($this->data)
            ? $this->data : [$this->data];


        header("Content-Type: application/json");
        http_response_code($this->code);
        $arrayOfThis = [
            "code" => $this->code,
            "message" => $this->message,
            "error_code" => $this->error_code,
            "data" => $this->data
        ];
        echo json_encode($arrayOfThis);
        exit();
    }

    public static function stop()
    {
        $response = new Response();
        $response->code = 500;
        $response->error_code = "STOP";
        $response->send();
    }

}







/* 

{
    "code": 200,
    "message": "Success",
    "error_code": 0,
    "data": [
        { "id": "1", "name": "Example" },
        { "id": "2", "name": "Another Example" }
    ],
}


    data: any[] | [{
        id: string,
        payload: any{}
    }]


*/