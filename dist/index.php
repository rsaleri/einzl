<!DOCTYPE html>
<html>
<head>
	<!-- meta -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<meta name="viewport" content="width=device-width,initial-scale=1.0, user-scalable=no"/>
	<meta name="description" content=""/>
	<meta name="msapplication-tap-highlight" content="no"/>

	<title>Einzl</title>

	<!-- icons -->
	<link href="images/ci/favicon.ico?v=3" rel="shortcut icon">
	<link href="img/icons/touch.png" rel="apple-touch-fa-precomposed">

	<!-- css -->
	<link href="css/libs/font-awesome.min.css" rel="stylesheet">
	<link href="css/libs/normalize.css" rel="stylesheet">
	<link href='css/app.min.css' rel='stylesheet' type='text/css'>

    <!-- feature detection -->
	<script src="js/libs/modernizr.min.js"></script>
    
</head>
<body>
	<div class="app">
        <div class="wrapper">
        	<header>
                <div class="title"><span>Einzelstück</span></div>
                <nav>
                    <div class="hamburger-button"><i class="fa fa-bars"></i></div>
                    <ul>
                        <li><a href="/home" title="Home">Home</a></li>
                        <li><a href="/ringe" title="Ringe">Ringe</a></li>
                        <li><a href="/ketten" title="Ketten">Ketten</a></li>
                        <li><a href="/armbaender" title="Armbänder">Armbänder</a></li>
                    </ul>
                </nav>
                <div class="right-area">
                    <div class="language-button">
                        <span title="only DE for now, sorry :(">DE</span>
                    </div>
                    <div class="cart-button">
                        <i class="fa fa-shopping-cart"></i>
                        <span class="total">EUR 98.45 ,-</span>
                    </div>
                    
                </div>
                
            </header>
            <aside class="cart-container">
                <h2>Dein Warenkorb</h2>
                <div class="cart"></div>
            </aside>
			<main></main>
			<footer>
                &copy; Einzelstück 2015 - <a href="/impressum" title="Impressum">Impressum</a> - <del>AGB</del> - <a href="/f12" title="F12">F12</a>
            </footer>
		</div>
	</div>
    
    
    
    <!-- javascript -->
	<script src="js/libs/jquery-1.11.0.min.js"></script>
	<script src="js/libs/jquery.mobile.custom.min.js"></script>
    <script src="js/libs/jquery.history.js"></script>
    <script src="js/libs/handlebars-v2.0.0.js"></script>
    <!-- media queries for IE8 -->
	<!--[if lt IE 9]>
    <script src='js/libs/respond.min.js'></script>
    <![endif]-->
    <!-- main hydra JS -->
	<script src="js/app.min.js"></script>
</body>
</html>
