<!DOCTYPE html>
<html>
<head>
	<!-- meta -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<meta name="viewport" content="width=device-width,initial-scale=1.0, user-scalable=no"/>
	<meta name="description" content=""/>
	<meta name="msapplication-tap-highlight" content="no"/>

	<title>Einzelstück</title>

	<!-- icons -->
	<link href="images/favicon.png?v=2" rel="shortcut icon">
	<link href="img/icons/touch.png" rel="apple-touch-fa-precomposed">

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
                <div class="title"><a href="/home" title="Home"><span data-copy="title_long"></span></a></div>
                <nav class="open">
                    <div class="hamburger-button"><i class="fa fa-bars"></i></div>
                    <ul>
                        <li><a data-copy="nav_01" href="/home" title="Home" class="active"></a></li>
                        <li><a data-copy="nav_02" href="/rings" title="Rings"></a></li>
                        <li><a data-copy="nav_05" href="/pendants" title="Pendandts"></a></li>
<!--                        <li><a data-copy="nav_03" href="/necklaces" title="Necklaces"></a></li>-->
                        <li><a data-copy="nav_04" href="/bracelets" title="Bracelets"></a></li>
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
                <span data-copy="footer_copyright"></span><!-- - <a href="/imprint" title="Impressum" data-copy="footer_link_01"></a> - <del data-copy="footer_link_02">AGB</del> - <a href="/f12" title="F12" data-copy="footer_link_03">F12</a> -->
            </footer>
		</div>
	</div>
    <div id="notification" class="hide"><span class="message"></span></div>
    
    
    <!-- javascript -->
	<script src="js/libs/jquery-1.11.0.min.js"></script>
	<script src="js/libs/jquery.mobile.custom.min.js"></script>
    <script src="js/libs/jquery.history.js"></script>
    <script src="js/libs/handlebars-v2.0.0.js"></script>
    <!-- media queries for IE8 -->
	<!--[if lt IE 9]>
    <script src='js/libs/respond.min.js'></script>
    <![endif]-->
    <!-- main einzl JS -->
	<script src="js/app.min.js"></script>
    
    <script>
        // init google analytics
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        
        // CUSTOM EVENTS: ga('send', 'event', 'category', 'action', 'label', value);
    </script>
</body>
</html>
