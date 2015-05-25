<?php
require 'vendor/autoload.php';
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
        $data = Product::Listing(['status' => '1']);
        
    } else if($action == 'getProductById') {
        
        // get products from moltin
        $data = $moltin->get('product/'.$_POST['productId']);
        
    } else if($action == 'subscribe') {
        
        // send userdata to mailchimp for email subscription
        $user = $_POST['user'];
        $data = subscribe($user, $mailchimp);
        
    } else if($action == 'getCart') {
        
        // get cart from moltin (or create a new one)
        $getCart = Cart::Contents();
        
        // return cart, if moltin doesn't screw up
        if(isset($getCart['status'])) {
            $data['cart'] = $getCart['result'];
        }

        
    } else if($action == 'addToCart') {
        try
        {

            $productID = $_POST['product_id'];
            
            // put item into cart			
			$data['item'] = Cart::Insert($productID, 1);
            
        }
        catch (\Exception $e)
        {
            $data = $e->getMessage();
        }
        
        // get updated cart content
        $cart = Cart::Contents();
        $data['cart'] = $cart['result'];
        
    } else if($action == 'getOrder') {
        
        
        try
        {
            $orderID = $_POST['orderID'];
            $data['order'] = Order::Get($orderID);
            
        } 
        catch (\Exception $e)
        {
            $data = $e->getMessage();
        }
        
    } else if($action == 'removeFromCart') {
        
        $productKey = $_POST['product']['key'];
        $productQuantity = $_POST['product']['quantity'];
        
        try
        {
            // remove item from cart or lower quantity
            if($productQuantity == 1) {
                $data['item'] = Cart::Remove($productKey);
            } else {
                $productQuantity--;
                $data['item'] = Cart::Update($productKey, [
					'quantity' => $productQuantity
				]);
            }
            
        }
        catch (\Exception $e)
        {
            $data['item'] = $e->getMessage();
        }
        
        // get updated cart content
        $cart = Cart::Contents();
        $data['cart'] = $cart['result'];

    } else if($action == 'processOrder') {
        
        
        try
        {

            $order = $_POST['order'];
			$cart = $_POST['cart'];
            
            // create customer out of billing data
            $user = array(
                'first_name' => $order['billAd']['first_name'],
                'last_name' => $order['billAd']['last_name'],
                'email' => $order['billAd']['email']
            );
            
            // send order to moltin
            $data['order'] = Cart::Order(array(
                'customer' => $user,
                'gateway' => $order['payment'],
                'bill_to' => $order['billAd'],
                'ship_to' => $order['shipAd'],
                'shipping' => $order['shipping']
            ));
			
			$data['order']['result']['cart'] = $cart;
			
			if($data['order']['status']) {
				
				// send confirmation mail
				$data['mail'] = sendConfirmationMail($user, $data['order']['result'], $cart, $smtpPassword);
				
				// create new cart
				unset($_COOKIE['mcart']);
				Moltin::Identifier();
				
			} else {
				
				
				
			}
			
			
            
        }
        catch (\Exception $e)
        {
            $data = $e->getMessage();
			
        }
        
        
        
    } else if($action == 'processPayment') {
        
        $orderID = $_POST['orderID'];
        
        
        
        $paypalArr = array(
            'return_url' => 'http://'.$_SERVER['HTTP_HOST'].'/php/paypalreturn.php?orderID='.$orderID,
            'cancel_url' => 'http://'.$_SERVER['HTTP_HOST'].'/php/paypalreturn.php?orderID='.$orderID
        );
        
        $data['payment'] = Checkout::Payment('purchase', $orderID, $paypalArr); 
        
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
		$data['payment'] = $data['payment'] = Checkout::Payment('complete_purchase', $orderID, $paypalArr); 
		
	}
    
} else {
    // Autentication failed
    exit('Auth Failed');
}

echo json_encode($data);
?>