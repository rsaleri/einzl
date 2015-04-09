var Confirmation = function(model) {
    
    this.model = model;
    
    
    
//    einzl.order = JSON.parse('{"id":"914473201281532904","created_at":"2015-02-06 14:42:02","updated_at":"2015-02-06 14:42:02","customer":{"value":"Sumit","data":{"id":"523","order":null,"created_at":"2014-06-12 15:36:49","updated_at":"2014-06-12 15:36:49","first_name":"Sumit","last_name":"Kumar","email":"sk@outlook.com","group":null,"gender":"male","fbid":528632405,"lastlogin":null,"instaid":0,"hash":"IZNRGpoiIJ","role":"user"}},"gateway":{"value":"Manual","data":{"name":"Manual","slug":"manual","description":null,"enabled":true}},"status":{"value":"Unpaid","data":{"key":"unpaid","value":"Unpaid"}},"subtotal":55,"shipping_price":0,"total":65.45,"currency":{"value":"Euro","data":{"id":26,"code":"EUR","title":"Euro","enabled":true,"modifier":"+0","exchange_rate":1,"format":"EUR {price}","decimal_point":",","thousand_point":".","rounding":null,"default":false,"created_at":null,"updated_at":null}},"currency_code":"EUR","exchange_rate":1,"shipping":null,"ship_to":{"value":"","data":{"id":"914473199779972071","order":null,"created_at":"2015-02-06 14:42:02","updated_at":"2015-02-06 14:42:02","save_as":"","first_name":"Sumit","last_name":"Kumar","address_1":"Schwabstraße 32","address_2":"","postcode":"70197","country":{"value":"Germany","data":{"code":"DE","name":"Germany"}},"company":"","city":"Stuttgart","customer":{"value":"Sumit","data":{"id":"523","order":null,"created_at":"2014-06-12 15:36:49","updated_at":"2014-06-12 15:36:49","first_name":"Sumit","last_name":"Kumar","email":"sk@outlook.com","group":null,"gender":"male","fbid":528632405,"lastlogin":null,"instaid":0,"hash":"IZNRGpoiIJ","role":"user"}},"phone":"000","county":"--","instructions":""}},"bill_to":{"value":"","data":{"id":"914473199779972071","order":null,"created_at":"2015-02-06 14:42:02","updated_at":"2015-02-06 14:42:02","save_as":"","first_name":"Sumit","last_name":"Kumar","address_1":"Schwabstraße 32","address_2":"","postcode":"70197","country":{"value":"Germany","data":{"code":"DE","name":"Germany"}},"company":"","city":"Stuttgart","customer":{"value":"Sumit","data":{"id":"523","order":null,"created_at":"2014-06-12 15:36:49","updated_at":"2014-06-12 15:36:49","first_name":"Sumit","last_name":"Kumar","email":"sk@outlook.com","group":null,"gender":"male","fbid":528632405,"lastlogin":null,"instaid":0,"hash":"IZNRGpoiIJ","role":"user"}},"phone":"000","county":"--","instructions":""}}}');
    
    
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