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

        // create new cart
        

        // track order with google analytics
//                this.trackOrder(order);

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
		
		console.log('handle gateway response');
		
        var obj = {
            action: "completePayment"
        };

        $.extend(obj, this.data.urlParams);
        
        
        einzl.models.shop.askServer(obj).then(function(data) {
            
            console.log('complete payment response: ');
            console.log(data);
            
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
		
	}
    
});