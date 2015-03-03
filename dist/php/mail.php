<?php
require 'libs/PHPMailer/PHPMailerAutoload.php';

function sendConfirmationMail($user, $order, $cart) {
	$orderData = $order;
	$shipAd = $orderData['ship_to']['data'];
	$billAd = $orderData['bill_to']['data'];

	$message = file_get_contents('mail_templates/confirmation.html');

	$gender = $order['customer']['data']['gender'];
	if($gender && $gender == 'female') {
		$message = str_replace('%anrede%', 'Liebe ', $message);
	} else if($gender && $gender == 'male') {
		$message = str_replace('%anrede%', 'Lieber ', $message);
	} else {
		$message = str_replace('%anrede%', 'Hi ', $message);
	}


	if($user['first_name']) {
		$message = str_replace('%firstname%', $user['first_name'], $message);
	} else {
		$message = str_replace('%firstname%', '', $message);
	}

	$HTMLitem = '';
	foreach ($cart['contents'] as $prod) {
		$HTMLitem .= '<tr>';
		$HTMLitem .= '<td>'.$prod['name'].'</td>';
		$HTMLitem .= '<td>'.$prod['quantity'].'</td>';
		$HTMLitem .= '<td>€ '.$prod['total'].'</td>';
		$HTMLitem .= '</tr>';
	}
	$message = str_replace('%cartitems%', $HTMLitem, $message);
	$message = str_replace('%tax%', ($orderData['total']*0.19), $message);
	$message = str_replace('%totalprice%', $orderData['total'], $message);
	$message = str_replace('%orderID%', $orderData['id'], $message);

	$HTMLshipad = '';
	$HTMLshipad .= $shipAd['first_name'].' '.$shipAd['last_name'].'<br/>';
	$HTMLshipad .= $shipAd['address_1'].'<br/>';
    if($shipAd['address_2']) {
        $HTMLshipad .= $shipAd['address_2'].'<br/>';
    }
	$HTMLshipad .= $shipAd['postcode'].' '.$shipAd['city'].'<br/>';

	$message = str_replace('%shippingAdress%', $HTMLshipad, $message);

	$mail = new PHPMailer;

	$mail->isSMTP();                                      // Set mailer to use SMTP
	$mail->Host = 'smtp.strato.de';						  // Specify main and backup server
	$mail->SMTPAuth = true;                               // Enable SMTP authentication
	$mail->Username = 'info@einzelstueck-shop.com';       // SMTP username
	$mail->Password = '09129sk()';                        // SMTP password
	$mail->Port = 465;									  // SMTP port
	$mail->SMTPSecure = 'ssl';                            // Enable encryption, 'ssl' also accepted

	$mail->From = 'info@einzelstueck-shop.com';
	$mail->FromName = 'Einzelstück';
	$mail->addAddress($user['email'], $user['first_name']);  // Add a recipient
	// 	$mail->addAddress('ellen@example.com');               // Name is optional
	$mail->addReplyTo('info@einzelstueck-shop.com', 'Information');
	// 	$mail->addCC('cc@example.com');
	$mail->addBCC('sk@outlook.com');

	$mail->CharSet = "UTF-8";
	$mail->WordWrap = 50;                                 // Set word wrap to 50 characters
	// 	$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
	// 	$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
	$mail->isHTML(true);                                  // Set email format to HTML

	$mail->Subject = 'Einzelstück sagt Danke';
	$mail->Body    = $message;
	$mail->AltBody = strip_tags($message);

	if(!$mail->send()) {
		return 'Mailer Error: ' . $mail->ErrorInfo;
	} else {
		return true;
	}


}

?>
