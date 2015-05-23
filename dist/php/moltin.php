<?php
    require_once('access.php');

	// Autoload files we're going to need
	
	use Moltin\SDK\Facade\Moltin as Moltin;

	$authenticated = Moltin::Authenticate('ClientCredentials', [
		'client_id'     => $moltinID,
		'client_secret' => $moltinSecret
	]);