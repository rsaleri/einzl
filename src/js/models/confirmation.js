var OrderModel = PageModel.extend({
	
	initialize: function(data) {
        
        var self = this;
        
        this.data = data;
        this.view = new OrderView(this.data.hbsPath);
        this.view.model = this;
		
		this.data.urlParams = getUrlParams();
		
		this.getOrder(this.data.order.id).then(function() {
			
			self.view.render(self.data).then(function() {
				
				self.handlePayment();
				
				
			});
			
		});
        
    },
	
	handlePaypalResponse: function() {
		
		var self = this;
		
		console.log('handle paypal response');
		
		if(this.data.urlParams.PayerID) {
			
			// user paid, tell that moltin
			var obj = {
				action: "completePayment",
				orderID: this.data.order.id,
				PayerID: this.data.urlParams.PayerID,
				token: this.data.urlParams.token
			}
			
			Einzlstck.Models.Shop.askServer(obj).then(function(data) {
				
				if(data.payment.status) {
					
					// payment successfull
					
					// tell the user that
					notifyUser('Zahlung erfolgreich', 'success');
					
					// show paid box
					self.view.el.find('#paid').show();
				} else {
					
					// payment failed for whatever reason
					
					// let the user know
					notifyUser('Zahlung fehlgeschlagen', 'error');
					
					// init the chosen gateway
					self.initGateway(self.data.order.gateway.data.slug);
				}
				
			});
			
		} else {
			// user canceled payment
			notifyUser('Zahlung abgebrochen', 'error');
			
			// init the chosen gateway
			this.initGateway(this.data.order.gateway.data.slug);
		}
		
	},
	
	handlePayment: function() {
		
		if(this.data.order.status.value === 'Paid' || this.data.order.status.value === 'Dispatched') {
			
			// order is already paid
			this.view.el.find('#paid').show();
			
			
			
		} else {
			
			// order isn't paid yet
			
			if(this.data.urlParams.paypal) {
				
				// this is a paypal callback
				this.handlePaypalResponse();

			} else {

				// this isn't a return from gateway so, init the chosen gateway
				this.initGateway(this.data.order.gateway.data.slug);
			}
			
		}
		
	},
	
	initGateway: function(gateway) {
		
		
		if(gateway === 'paypal-express') {
			
			// Paypal
			this.view.el.find('#pay-paypal').show();
			
			// add loading class to button
			var payButton = this.view.el.find('.button.pay');
			payButton.addClass('loading');
			
			// prepare request for paypal details
			var obj = {
				action: "processPayment",
				orderID: this.data.order.id
			}
			
			Einzlstck.Models.Shop.askServer(obj).then(function(data) {
				
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
			
			
		} else {
			
			// Manual / Vorkasse
			this.view.el.find('#pay-manual').show();
			
		}
		
		
	},
	
	getOrder: function(orderID) {
		
		var self = this;
		
		// prepare moltin request
		var obj = {
			action: 'getOrder',
			orderID: orderID
		};

		// do the moltin request and ask for the order, given via URL parameter
		return Einzlstck.Models.Shop.askServer(obj).done(function(data) {
			
			console.log(data);
			
			if(data.order.status) {
				
				self.data.order = data.order.result;
				
			}
			
		});
		
	}
	
});