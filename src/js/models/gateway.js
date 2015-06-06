var GatewayModel = PageModel.extend({
    
    initialize: function(data) {
        
        var self = this;
        
        this.data = data;
		
		// prevent user greeting
        window.clearTimeout(Einzlstck.Models.User.sayHello());
        
        // handle gateway response
        this.handleGatewayResponse();
        
        
        
    },
    
    confirmOrder: function(order) {

        // create new cart
        Einzlstck.Models.Cart = new Basket();

        // track order with google analytics
//                this.trackOrder(order);

        // navigate to confirmation page
        Einzlstck.Router.navigate('/confirmation/' + order.id, {
            trigger: true,
            replace: true
        });
        
    },
    
    cancelOrder: function() {
        
        // navigate back to the checkout page
        Einzlstck.Router.navigate('/checkout', {
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
        
        
        Einzlstck.Models.Shop.askServer(obj).then(function(data) {
            
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