<?php
namespace Mtansk\Cp\Models\Logger;

class LogModel
{
    public string $object;
    public ?string $user_id;
    public string $action;
    public string $json;
    public ?string $description;
    public ?string $author_id;

    public function __construct()
    {

        $this->object = "";
        $this->user_id = null;
        $this->action = "";
        $this->json = "";
        $this->description = null;
        $this->author_id = null;
    }

}