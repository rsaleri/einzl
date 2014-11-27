<?php
    require_once('access.php');

	// Autoload files we're going to need
	require 'libs/autoload.php';

	// Setup class references
	use Moltin\SDK\Request\CURL as Request;
	use Moltin\SDK\Storage\Session as Storage;

	// Start the SDK
	$moltin = new \Moltin\SDK\SDK(new Storage, new Request);

	// Autenticate using client credentials
	$authenticated = $moltin->authenticate(new \Moltin\SDK\Authenticate\ClientCredentials, array(
	    'client_id'     => $moltinID,
	    'client_secret' => $moltinSecret
	));
