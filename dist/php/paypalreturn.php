<html>
<body>
<script type="text/javascript">
    
    var url = location.search.substring(1);
	
	console.log(url);
	
	var params = url?JSON.parse('{"' + url.replace(/&/g, '","').replace(/=/g,'":"') + '"}',function(key, value) { return key===""?value:decodeURIComponent(value) }):{};
	
	console.log(params);
    
    window.opener.location="/confirmation/" + params.orderID + "?" + url + "&paypal=1";
    window.close();
    
</script>
</body>
</html>