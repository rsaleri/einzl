var GatewayModel = PageModel.extend({
    
    initialize: function(data) {
        
        var self = this;
        
        this.data = data;
//        this.view = null;
//        this.view.model = this;
		
		
		
		// prevent user greeting
        window.clearTimeout(Einzlstck.Models.User.sayHello());
        
        this.handleGatewayResponse();
        
    },
	
	handleGatewayResponse: function() {
		
		var self = this;
		
		console.log('handle paypal response');
		
		// user paid, tell that moltin
        var obj = {
            action: "completePayment"
        };

        $.extend(obj, this.data.urlParams);
        
        
        Einzlstck.Models.Shop.askServer(obj).then(function(data) {
            
            console.log('complete payment response: ');
            
            console.log(data);
				
            if(data.payment.status) {
                
                // payment successfull
                notifyUser('Die Zahlung hat geklappt :-)', 'success');
                
                // create new cart
                Einzlstck.Models.Cart = new Basket();

                // track order with google analytics
//                this.trackOrder(data.order.result);
                
                // navigate to confirmation page
                Einzlstck.Router.navigate('/confirmation/' + data.order.result.id, {
                    trigger: true,
                    replace: true
                });

                
            } else {
                
                // payment failed
                notifyUser('Bei der Zahlung ging etwas schief :-(', 'error');
                
                // navigate back to the checkout page
                Einzlstck.Router.navigate('/checkout', {
                    trigger: true,
                    replace: true
                });
                
            }
            
        });
		
	}
    
});