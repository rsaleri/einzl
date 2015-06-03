var CheckoutModel = PageModel.extend({
	
	initialize: function(data) {
        
        var self = this;
        
        this.data = data;
        this.view = new CheckoutView(this.data.hbsPath);
        this.view.model = this;
        
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

			$.each(Einzlstck.Models.User.data.addresses, function() {

				if(this.id === billID) {
					billingAddress = this;
					return false;
				}

			});

		} else {
			// display error
			goToByScroll(billingContainer);
			notifyUser(Einzlstck.Models.Copy.data.messages.checkout_noBillingAddress, 'error');
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

			$.each(Einzlstck.Models.User.data.addresses, function() {

				if(this.id === shipID) {
					shippingAddress = this;
					return false;
				}

			});

		} else {
			// display error
			goToByScroll(shippingContainer);
			notifyUser(Einzlstck.Models.Copy.data.messages.checkout_noShippingAddress, 'error');
			return errorPromise.reject();
		}

		order.shipAd = shippingAddress;

		// check if cart is empty
		if(!Einzlstck.Models.Cart || Einzlstck.Models.Cart.data.total_items <= 0) {
			// display error
			notifyUser(Einzlstck.Models.Copy.data.messages.checkout_empty_cart, 'error');
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
			cart: Einzlstck.Models.Cart.data
		};

		return Einzlstck.Models.Shop.askServer(obj).done(function(data) {
			
			console.log(data);
			
			if(data.payment === 'manual') {
				
				// go directly to gateway page for manual gateway
                window.location="/gateway?manual=1&orderID=" + data.order.result.id;
				
			} else {
				
				window.open(data.payment.result.url);
				
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