var CheckoutModel = PageModel.extend({
	
	initialize: function(data) {
        
        var self = this;
        
        this.data = data;
        this.view = new CheckoutView(this.data.hbsPath);
        this.view.model = this;
        
    },
	
	confirmOrder: function(order) {
		
		// remove current cart
		Einzlstck.Models.User.data.cart_id = null;

		// create new cart
		Einzlstck.Models.Cart = new Cart();

		// track order with google analytics
//		self.trackOrder(einzl.order);
		
		Einzlstck.Router.navigate('/confirmation?orderID=' + data.order.id, true);
		
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

		console.log(obj);

		return Einzlstck.Models.Shop.askServer(obj).done(function(data) {

			console.log(data);

		});
		
	}
	
});