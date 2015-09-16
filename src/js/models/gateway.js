var GatewayModel = PageModel.extend({
    
    initialize: function(data) {
        
        var self = this;
        
        this.data = data;
		
		// prevent user greeting
        window.clearTimeout(einzl.models.user.sayHello());
        
        // handle gateway response
        this.handleGatewayResponse();
        
        
        
    },
    
    confirmOrder: function(order) {

        // get new cart
        einzl.models.cart.getCart();

        // track order with google analytics
//		this.trackOrder(order);

        // navigate to confirmation page
        einzl.router.navigate('/confirmation/' + order.id, {
            trigger: true,
            replace: true
        });
        
    },
    
    cancelOrder: function() {
        
        // navigate back to the checkout page
        einzl.router.navigate('/checkout', {
            trigger: true,
            replace: true
        });
        
    },
	
	handleGatewayResponse: function() {
		
		var self = this;
		
        var obj = {
            action: "completePayment"
        };

        $.extend(obj, this.data.urlParams);
        
        
        einzl.models.shop.askServer(obj).then(function(data) {
            
            if(data.payment === 'manual') {
                
                // manual gateway? go and confirm
                self.confirmOrder(data.order.result);
                
            } else if(data.payment.status) {

                
                // payment successfull
                notifyUser('Dein Zahlvorgang war erfolgreich.', 'success');
                
                self.confirmOrder(data.order.result);


                
            } else {
                
                // payment failed
                notifyUser('Bei der Zahlung ging etwas schief :-(', 'error');
                
                self.cancelOrder();

                
            }
            
        });
		
	},
    
    trackOrder: function(order) {
		
		ga('require', 'ecommerce');
	
		ga('ecommerce:addTransaction', {
			'id': order.id,                     	// Transaction ID. Required.
			'affiliation': 'Einzelstück',   		// Affiliation or store name.
			'revenue': order.total,               	// Grand Total.
			'shipping': order.shipping_price,       // Shipping.
			'tax': '0',                     		// Tax.
			'currency': 'EUR'						// Currency
		});

		$.each(order.cart.contents, function(key, item) {

			ga('ecommerce:addItem', {
				'id': key,                     		// Transaction ID. Required.
				'name': item.name,    				// Product name. Required.
				'sku': item.sku,                 	// SKU/code.
				'category': item.category.value,    // Category or variation.
				'price': item.total,                // Unit price.
				'quantity': item.quantity           // Quantity.
			});

		});

		ga('ecommerce:send');
		
	}
    
});