var GatewayModel = PageModel.extend({
    
    initialize: function(data) {
        
        var self = this;
        
        this.data = data;
//        this.view = null;
//        this.view.model = this;
		
		
		
		console.log(this.data);
        
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
                
                // create new cart
                Einzlstck.Models.Cart = new Basket();

                // track order with google analytics
//                this.trackOrder(data.order.result);

                Einzlstck.Router.navigate('/confirmation/' + data.order.result.id, {
                    trigger: true,
                    replace: true
                });

                
            } else {
                
                // payment failed
                Einzlstck.Router.navigate('/checkout', {
                    trigger: true,
                    replace: true
                });
                
            }
            
        });
		
	}
    
});