var CheckoutModel = PageModel.extend({
	
	initialize: function(data) {
        
        var self = this;
        
        this.data = data;
        this.view = new CheckoutView(this.data.hbsPath);
        this.view.model = this;
        
    },
	
	confirmOrder: function() {
		
		// remove current cart
//		Einzlstck.Models.User.data.cart_id = null;
//
//		// create new cart
//		Einzlstck.Models.Cart = new Cart();
//
//		// save order
//		einzl.order = data.order.result;
//
//		// track order with google analytics
////		self.trackOrder(einzl.order);
//
//		History.pushState("", 'Confirmation', '/confirmation?orderID=' + einzl.order.id);
		
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


var CheckoutView = PageView.extend({
    
    insertAddresses: function() {
        
        var self = this;
        
        // are there addresses?
        if(Einzlstck.Models.User.data.addresses.length > 0) {
            
            // yup, insert them
            Einzlstck.Models.User.views.addressList.render(Einzlstck.Models.User.data);
            
        } else {
            
            // nope, open the form
            this.el.find('#billing-address').addClass('open-form');
            
        }
        
        
        
    },
    
    initController: function() {
        
        PageView.prototype.initController.apply(this);
        
        
        var self = this;    
        console.log('init controller');
        
        
        // insert addresses
        this.insertAddresses();
        
        // enable new address button
        this.el.find('.new-address-button').on('vclick', function(e) {
            $(e.currentTarget).closest('.unit').addClass('open-form');
        });

        // enable cancel address button
        this.el.find('.new-address-form button[type="reset"]').on('vclick', function(e) {

            // close form
            $(e.currentTarget).closest('.unit').removeClass('open-form');

            // reset form
            self.view.find('form').get(0).reset();

            // remove focus
            $(':focus').blur();

            // scroll to address list
            $(window).scrollTop(self.view.find('#billing-address').offset().top);

            e.preventDefault();
            e.stopPropagation();
        });

        // enable save address button
        this.el.find('.new-address-form button[type="submit"]').on('vclick', function(e) {

            e.preventDefault();
            e.stopPropagation();

            var form = $(e.currentTarget).closest('form');
            
            
            // TODO: VALIDATE FORM HERE
            
            
            var obj = {};
    
            // extract address information
            obj.first_name = form.find('.firstname input').val();
            obj.last_name = form.find('.lastname input').val();
            obj.email = form.find('.email input').val();
            obj.phone = '000';
            obj.address_1 = form.find('.address_1 input').val();
            obj.postcode = form.find('.code input').val();
            obj.city = form.find('.city input').val();
            obj.county = '--';
            obj.country = form.find('.country select').val();
            obj.note = form.find('.note textarea').val();
            obj.id = guid();

            Einzlstck.Models.User.addAddress(obj).then(function() {                
                
                // reset form
                form.get(0).reset();

                // close form
                self.el.find('.open-form').removeClass('open-form');
                
            });

        });

        // enable process order button
        this.el.find('.button.buy').on('vclick', function(e) {

            var button = $(e.currentTarget);

            if(!button.hasClass('loading')) {
                button.addClass('loading');

                self.model.processOrder().always(function() {
                    button.removeClass('loading');
                }).done(function(data) {

                    console.log(data);

                    if(data.order.status) {
						
						self.model.confirmOrder();
                        
                    } else {
                        notifyUser(Einzlstck.Models.Copy.data.messages.nl_error, 'error');
                    }

                });
            }





        });

        // enable address buttons
        this.el.find('.user-address-list').on('vclick', 'li', function(e) {
            $(this).addClass('selected');
            $(this).siblings('li').removeClass('selected');

            e.preventDefault();
            e.stopPropagation();
        });
        
        
        
        // insert cart (move this if template isnt rendered on each visit anymore)
        try {
            this.el.find('.cart').html(Einzlstck.Models.Cart.view.el.clone(true));
        } catch(e) {
            // cart will be inserted when it's ready by the CartView
        }

        $('.cart-container').removeClass('open');
        $('.cart-button').removeClass('open');
        
    }
    
});