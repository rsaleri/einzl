<?php
require_once('access.php');

$mailchimp = new Mailchimp($mailchimpKey);


function subscribe($user, $mailchimp) {
    
    
    $result = $mailchimp->call('lists/subscribe', array(
        'id'                => 'af446b1ef2',
        'email'             => array('email'=>$user['email']),
//        'merge_vars'        => array('FNAME'=>'Freddie', 'LNAME'=>'Smith'),
        'double_optin'      => true,
        'update_existing'   => true,
        'send_welcome'      => false,
    ));
    
    return $result;
    
};

