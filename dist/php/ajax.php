<?php

require_once('moltin.php');
require_once('helper.php');

// what to do?
$action = $_POST['action'];

// result will saved in here
$data = [];


// Check authentication
if ( $authenticated ) {
    
    
    
    
    
    if($action == 'getProducts') {
        $data = $moltin->get('products');

    }
    
    
    
    
    
    
} else {
    // Autentication failed
    exit('Auth Failed');
}

echo json_encode($data);
?>