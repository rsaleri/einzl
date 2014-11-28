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
        
    }
    
    
    
    
    
    
} else {
    // Autentication failed
    exit('Auth Failed');
}

echo json_encode($data);
?>