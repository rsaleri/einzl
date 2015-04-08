<?php

require_once('moltin.php');
require_once('newsletter.php');
require_once('helper.php');
require_once('mail.php');
require_once('access.php');

// what to do?
$action = $_POST['action'];

// result will saved in here
$data = [];


// Check moltin authentication
if ( $authenticated ) {
    
    if($action == 'getProducts') {
        
        // get products from moltin
        $data = $moltin->get('products');
        
    } else if($action == 'subscribe') {
        
        // send userdata to mailchimp for email subscription
        $user = $_POST['user'];
        $data = subscribe($user, $mailchimp);
        
    } else if($action == 'getCart') {
        
        // get cart from moltin (or create a new one)
        if($_POST['cart']['id'] != null) {
            $getCart = $moltin->get('cart/'.$_POST['cart']['id']);
            $getCart['result']['id'] = $_POST['cart']['id'];
        } else {
            $newCartID = generateRandomString(10);
            $getCart = $moltin->get('cart/'.$newCartID);
            $getCart['result']['id'] = $newCartID;
        }
        
        // return cart, if moltin doesn't screw up
        if(isset($getCart['status'])) {
            $data['cart'] = $getCart['result'];
        }

        
    } else if($action == 'addToCart') {
        try
        {

            $productID = $_POST['product_id'];
            $cartID = $_POST['cart']['id'];
            
            // put item into cart
            $data['item'] = $moltin->post('cart/'.$cartID, array('id' => $productID, 'quantity' => 1));
            
        }
        catch (\Exception $e)
        {
            $data = $e->getMessage();
        }
        
        // get updated cart content
        $cart = $moltin->get('cart/'.$cartID);
        $data['cart'] = $cart['result'];

        // insert cart ID into response
        $data['cart']['id'] = $cartID;
        
    } else if($action == 'getOrder') {
        
        
        try
        {
            $orderID = $_POST['orderID'];
            $data['order'] = $moltin->get('order/'.$orderID);
            
        } 
        catch (\Exception $e)
        {
            $data = $e->getMessage();
        }
        
    } else if($action == 'removeFromCart') {
        
        $productKey = $_POST['product']['key'];
        $productQuantity = $_POST['product']['quantity'];
        $cartID = $_POST['cart']['id'];
        
        try
        {
            // remove item from cart or lower quantity
            if($productQuantity == 1) {
                $data['item'] = $moltin->delete('cart/'.$cartID.'/item/'.$productKey);
            } else {
                $productQuantity--;
                $data['item'] = $moltin->put('cart/'.$cartID.'/item/'.$productKey, array('quantity' => $productQuantity));
            }
            
        }
        catch (\Exception $e)
        {
            $data['item'] = $e->getMessage();
        }
        
        // get updated cart content
        $cart = $moltin->get('cart/'.$cartID);
        $data['cart'] = $cart['result'];

        // insert cart ID into response
        $data['cart']['id'] = $cartID;
    } else if($action == 'processOrder') {
        
        
        try
        {

            $order = $_POST['order'];
			$cart = $_POST['cart'];
            $cartID = $cart['id'];
            
            // create customer out of billing data
            $user = array(
                'first_name' => $order['billAd']['first_name'],
                'last_name' => $order['billAd']['last_name'],
                'email' => $order['billAd']['email']
            );
            
            // send order to moltin
            $data['order'] = $moltin->post('cart/'.$cartID.'/checkout', array(
                'customer' => $user,
                'gateway' => $order['payment'],
                'bill_to' => $order['billAd'],
                'ship_to' => $order['shipAd'],
                'shipping' => $order['shipping']
            ));
			
			$data['order']['result']['cart'] = $cart;
			
			// send confirmation mail
			$data['mail'] = sendConfirmationMail($user, $data['order']['result'], $cart, $smtpPassword);
            
        }
        catch (\Exception $e)
        {
            $data = $e->getMessage();
			
        }
        
        
        
    } else if($action == 'processPayment') {
        
        $orderID = $_POST['orderID'];
        
        
        
//        $paypalArr = array(
//            'return_url' => $_SERVER['SERVER_NAME'].'/confirmation/',
//            'cancel_url' => $_SERVER['SERVER_NAME'].'/confirmation/'
//        );
        
        // local development test from https://forwardhq.com/
        $paypalArr = array(
            'return_url' => 'https://einzlstck.fwd.wf/php/paypalreturn.php?orderID='.$orderID,
            'cancel_url' => 'https://einzlstck.fwd.wf/php/paypalreturn.php?orderID='.$orderID
        );
        
        $data['payment'] = $moltin->post('checkout/payment/purchase/'.$orderID, $paypalArr);
        
//        $data['payment'] = $paypalArr;
        
        
    } else if($action == 'completePayment') {
		
		$orderID = $_POST['orderID'];
		$PayerID = $_POST['PayerID'];
		$token = $_POST['token'];
		
		$paypalArr = array(
			'token' => $token,
			'payerid' => $PayerID
		);
		
		// update order at moltin
		$data['payment'] = $moltin->post('checkout/payment/complete_purchase/'.$orderID, $paypalArr);
		
	}
    
} else {
    // Autentication failed
    exit('Auth Failed');
}

echo json_encode($data);
?>