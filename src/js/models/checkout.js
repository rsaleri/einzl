var CheckoutModel = PageModel.extend({
	
	initialize: function(data) {
        
        var self = this;
        
        this.data = data;
		this.set(data);
        
    },
	
	processOrder: function() {
		
		console.log('process order');
	
		var errorPromise = $.Deferred();

		var order = {};


		// get billing address
		var billingContainer = $('#billing-address');
		var selectedBill = billingContainer.find('.user-address-list .selected').first();
		var billID;
		var billingAddress;

		if(selectedBill.length > 0) {

			billID = selectedBill.attr('data-address-id');

			$.each(einzl.models.user.data.addresses, function() {

				if(this.id === billID) {
					billingAddress = this;
					return false;
				}

			});

		} else {
			// display error
			goToByScroll(billingContainer);
			notifyUser(einzl.models.language.get('copy').messages.checkout_noBillingAddress, 'error');
			return errorPromise.reject();
		}

		order.billAd = billingAddress;


		// get shipping address
		var shippingContainer = $('#shipping-address');
		var selectedShip = shippingContainer.find('.user-address-list .selected').first();
		var shipID;
		var shippingAddress;

		if(selectedShip.length > 0) {

			shipID = selectedShip.attr('data-address-id');

			$.each(einzl.models.user.data.addresses, function() {

				if(this.id === shipID) {
					shippingAddress = this;
					return false;
				}

			});

		} else {
			// display error
			goToByScroll(shippingContainer);
			notifyUser(einzl.models.language.get('copy').messages.checkout_noShippingAddress, 'error');
			return errorPromise.reject();
		}

		order.shipAd = shippingAddress;

		// check if cart is empty
		if(!einzl.models.cart || einzl.models.cart.get('total_items') <= 0) {
			// display error
			notifyUser(einzl.models.language.get('copy').messages.checkout_empty_cart, 'error');
			return errorPromise.reject();
		}


		// get payment choice
		var payContainer = $('#payment-choice');
		var choice = payContainer.find('[name="paymentOption"]:checked').val();
		order.payment = choice;

		// set shipping for DHL
		order.shipping = '6846';

		var obj = {
			action: 'processOrder',
			order: order,
			cart: einzl.models.cart.toJSON
		};

		return einzl.models.shop.askServer(obj).done(function(data) {
			
			console.log(data);
			
			if(data.payment === 'manual') {
				
				// go directly to gateway page for manual gateway
                window.location="/gateway?manual=1&orderID=" + data.order.result.id;
				
			} else {
				
				window.open(data.payment.result.url);
				
			}
			
            
		});
		
	}
	
});