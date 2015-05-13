var Confirmation = function(model) {
    
    this.model = model;
    
    
    this.model.order = einzl.order;
    
    Page.apply(this,arguments);
    
};

// inherit Experience prototype and all it's variables and functions
Confirmation.prototype = Object.create(Page.prototype);
Confirmation.prototype.constructor = Confirmation;

Confirmation.prototype.start = function() {
    
    Page.prototype.start.call(this);
    
    if(this.view) {
		
		this.resetView();
		
        this.handleAccess();
    }
    
    
};

Confirmation.prototype.resetView = function() {
	
	// reset payment info
	this.view.find('.payment-information').attr('style', '');
	
};

Confirmation.prototype.handleAccess = function() {
    
    var self = this;
	var parameters = getUrlParams();
    
    console.log(parameters);
    
    // check if there is an order or if we have to get one
    if(einzl.order || parameters.orderID) {
        
        // should we get one?
        if(!einzl.order && parameters.orderID) {
			
			// if yes, hide the current unfilled template
			$('body').addClass('loading');
			$('main').children('section').remove();
            
			// prepare moltin request
            var obj = {
                action: 'getOrder',
                orderID: parameters.orderID
            };
            
			// do the moltin request and ask for the order, given via URL parameter
            einzl.app.askServer(obj).done(function(data) {
                
                console.log(data);
                
				// did we got an order?
                if(data.order && data.order.status) {
					
					// we got an order, save into einzl object and this model
                    einzl.order = data.order.result;
					self.model.order = einzl.order;
                    
					// re-create the view
					self.createView().then(function() {
						
						// insert the view into DOM
						self.view.appendTo($('main'));
						
						// remove loading class
						$('body').removeClass('loading');
						
						// check gateway
            			self.handlePayment(parameters);
						
					});
					
                    
                    
                } else {
					
					// we did not get an order, redirect to home
					History.pushState("", 'Home', '/');
				}
                
            });
            
        } else {
            // check gateway
            self.handlePayment(parameters);
        }
        
        
        
    } else {
		// redirect user to home if he tries to access confirmation page without placing an order
		console.log('back to home');
        History.pushState("", 'Home', '/');
    }
	
    
    
    
};


Confirmation.prototype.handlePayment = function(parameters) {
    
    var self = this;
	
	// check order status
	
	if(einzl.order.status.value === 'Paid') {
		
		// paid
		$('#paid').show();
		
		
	} else if(parameters.PayerID && parameters.paypal) {
		
		// just paid by paypal
		self.view.find('.button.pay').addClass('loading').show();
		// set order status to "Paid"
		var obj = {
			action: 'completePayment',
			orderID: einzl.order.id,
			token: parameters.token,
			PayerID: parameters.PayerID
		};
		
		einzl.app.askServer(obj).done(function(data) {
			
			console.log('order should be set to paid');
			
			console.log(data);
			
//			if(data.order.status) {
//				
//				einzl.order = data.order.result;
//				self.model.order = einzl.order;
//				
//				$('#paid').show();
//			}
			
		});
		
		
	} else if(einzl.order.status.value === 'Unpaid' || einzl.order.status.value === 'Failed' || einzl.order.status.value === 'Declined') {
		
		// not paid
		
		// check gateway
		if(einzl.order.gateway.data.slug === 'paypal-express') {
            
			// paypal gateway
			var payButton = self.view.find('.button.pay');
			
			// add loading class to button
			payButton.addClass('loading');
			
			// prepare request for gateway (paypal) details
			var obj = {
				action: "processPayment",
				orderID: einzl.order.id
			}
			
			// ask moltin for gateway details
			einzl.app.askServer(obj).done(function(data) {

				console.log(data);
				
				// remove loading class from button
				payButton.removeClass('loading');
				
				// did we got payment data?
				if(data.payment.status && data.payment.result.url) {

					// yup, enable the button
					payButton.on('vclick', function() {
						
						// open new window to paypal
						window.open(data.payment.result.url);

					});

				}

			});


			$('#pay-paypal').show();

		} else {
			
			// manual gateway
			$('#pay-manual').show();
		}
		
		
		
	}
    
    
    
}