<html>
<body>
<script type="text/javascript">
    
    var url = location.search.substring(1);
    
    window.opener.location="/confirmation?" + url + "&paypal=1";
    window.close();
    
</script>
</body>
</html>