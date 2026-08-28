<?php
namespace Mtansk\Cp\Helpers\Other;


use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use Mtansk\Cp\Helpers\Response\Response;




class Mailer
{
    public static function send(string $address, string $subject, string $body)
    {
        $mail = new PHPMailer();

        try {
            $mail->isSMTP();
            $mail->Host = \mailHost;
            $mail->SMTPAuth = true;
            $mail->Username = \mailUsername;
            $mail->Password = \mailPassword;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;
            $mail->CharSet = 'UTF-8';

            $mail->setFrom(\mailFromAddress, 'Портал');
            $mail->addAddress($address, 'Получатель');

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $body;

            if ($mail->send()) {
                return true;
            } else {
                $res = new Response();
                $res->code = 500;
                $res->error_code = "MAILER-SEND";
                $res->send();
            }
        } catch (Exception $e) {
            $res = new Response();
            $res->code = 500;
            $res->error_code = "MAILER-SEND";
            $res->send();
        }
    }
}