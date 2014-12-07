<?php

require_once('moltin.php');
require_once('newsletter.php');
require_once('helper.php');

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

        
    }
    
} else {
    // Autentication failed
    exit('Auth Failed');
}

echo json_encode($data);
?>