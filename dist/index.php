<!DOCTYPE html>
<html>
<head>
	<!-- meta -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<meta name="viewport" content="width=device-width,initial-scale=1.0, user-scalable=no"/>
	<meta name="description" content=""/>
	<meta name="msapplication-tap-highlight" content="no"/>
	
	<base href="/" />

	<title>Einzelstück</title>

	<!-- icons -->
	<link href="images/favicon.png?v=2" rel="shortcut icon">
	<link href="img/icons/touch.png" rel="apple-touch-fa-precomposed">
	
	<!-- Apple -->
    <meta name="apple-mobile-web-app-title" content="Einzelstück">
    <link rel="apple-touch-icon" href="images/icons/touch-icon-iphone.png">
    <link rel="apple-touch-icon" sizes="76x76" href="images/icons/touch-icon-ipad.png">
    <link rel="apple-touch-icon" sizes="120x120" href="images/icons/touch-icon-iphone-retina.png">
    <link rel="apple-touch-icon" sizes="152x152" href="images/icons/touch-icon-ipad-retina.png">
    
    <!-- Microsoft -->
    <meta name="application-name" content="Einzelstück" />
    <meta name="msapplication-tooltip" content="Betrete den Einzelstück Store." />
    <meta name="msapplication-starturl" content="./" />
    <meta name="msapplication-navbutton-color" content="#280B20" />
    <meta name="msapplication-TileColor" content="#280B20"/>
    <!-- Windows 8 -->
    <meta name="msapplication-TileImage" content="images/icons/logo-144x144.png"/>
    <!-- Windows 8.1 -->
    <meta name="msapplication-square70x70logo" content="images/icons/tiny.png"/>
    <meta name="msapplication-square150x150logo" content="images/icons/square.png"/>
    <meta name="msapplication-wide310x150logo" content="images/icons/wide.png"/>
    <meta name="msapplication-square310x310logo" content="images/icons/large.png"/>
	
	<meta property="og:title" content="Einzelstück - Handgemachter, indischer Schmuck"/>
	<meta property="og:type" content="Website"/>
	<meta property="og:site_name" content="einzlstck"/>
	<meta property="og:url" content="http://einzelstueck-shop.com"/>
	<meta property="og:image" content="http://einzelstueck-shop.com/images/backgrounds/armband_mondstein.jpg"/>

	<!-- css -->
	<link href="css/libs/font-awesome.min.css" rel="stylesheet">
	<link href="css/libs/normalize.css" rel="stylesheet">
	<link href='css/app.min.css' rel='stylesheet' type='text/css'>

    <!-- feature detection -->
	<script src="js/libs/modernizr.min.js"></script>
    
</head>
<body data-active-lang="">
	<div class="app">
        <div class="wrapper">
        	<header>
                <div class="html-logo">
                    <div class="drop"></div>
                    <div class="drop"></div>
                    <div class="drop"></div>
                    <div class="drop"></div>
                </div>
                <div class="title"><a href="/home" title="Home"><span data-copy="title_long">Einzelstück</span></a></div>
                <nav>
                    <div class="hamburger-button"><i class="fa fa-bars"></i></div>
                    <ul>
                        <li><a data-copy="nav_01" href="/home" title="Home">Home</a></li>
                        <li><a data-copy="nav_02" href="/rings" title="Ringe">Ringe</a></li>
                        <li><a data-copy="nav_05" href="/pendants" title="Anhänger">Anhänger</a></li>
<!--                        <li><a data-copy="nav_03" href="/necklaces" title="Necklaces"></a></li>-->
                        <li><a data-copy="nav_04" href="/bracelets" title="Armbänder">Armbänder</a></li>
                        <li class="likes"><a data-copy="nav_06" href="/likes" title="Your Likes"></a></li>
                    </ul>
                </nav>
                <div class="right-area">
                    <div class="language-button">
                        <span title="Ändere die Sprache auf Deutsch" data-language="de">DE</span>
                        <span title="Change language to english" data-language="en">EN</span>
                    </div>
                    <div class="cart-button">
						
                        <i class="fa fa-shopping-cart"></i>
                        <span class="total-items"></span>
                        <span class="total-price"></span>
                    </div>
                    
                </div>
                
            </header>
            <aside class="cart-container">
                <h2 data-copy="cart_headline"></h2>
                <div class="cart"></div>
            </aside>
            <div class="loading-animation">
                <div class="html-logo">
                    <div class="drop"></div>
                    <div class="drop"></div>
                    <div class="drop"></div>
                    <div class="drop"></div>
                </div>
            </div>
			<main></main>
			<footer>
				<div class="links">
					<a href="/shipping" title="Versand und Rückgabe">Versand und Rückgabe</a> | 
					<a href="/privacy" title="Datenschutz">Datenschutz</a> |
<!--					<a href="/f12" title="F12" data-copy="footer_link_03">F12</a> -->
					<a href="/imprint" title="Impressum" data-copy="footer_link_01">Impressum</a>
				</div>
				<div class="copyright">
					<span data-copy="footer_copyright">&copy; Einzelstück 2015</span>
				</div>
                
            </footer>
		</div>
	</div>
    <div id="notification" class="hide"><span class="message"></span></div>
    
    <!-- javascript -->
	<script src="js/libs/jquery-1.11.0.min.js"></script>
	<script src="js/libs/jquery.mobile.custom.min.js"></script>
    <script src="js/libs/underscore-min.js"></script>
	<script src="js/libs/backbone-min.js"></script>
    <script src="js/libs/handlebars-v2.0.0.js"></script>
	<script src="js/templates.js"></script>
    <!-- media queries for IE8 -->
	<!--[if lt IE 9]>
    <script src='js/libs/respond.min.js'></script>
    <![endif]-->
    <!-- main einzl JS -->
	<script src="js/app.min.js"></script>
    
    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-46833918-1', 'auto');

    </script>
</body>
</html>
