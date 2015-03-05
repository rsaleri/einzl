var Checkout = function(model) {
    
    this.model = model;
    
    this.order = {};
    
    Page.apply(this,arguments);
    
};

// inherit Page prototype and all it's variables and functions
Checkout.prototype = Object.create(Page.prototype);
Checkout.prototype.constructor = Checkout;

Checkout.prototype.initController = function() {
    
    var self = this;    
    console.log('init controller');
    // enable new address button
    this.view.find('.new-address-button').on('vclick', function(e) {
        $(e.currentTarget).closest('.unit').addClass('open-form');
    });
    
    // enable cancel address button
    this.view.find('.new-address-form button[type="reset"]').on('vclick', function(e) {
        
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
    this.view.find('.new-address-form button[type="submit"]').on('vclick', function(e) {
        
        e.preventDefault();
        e.stopPropagation();
        
        var form = $(e.currentTarget).closest('form');
        
        self.addUserAddress(form);
        
    });
    
    // enable process order button
    this.view.find('.button.buy').on('vclick', function(e) {
        
        var button = $(e.currentTarget);
        
        if(!button.hasClass('loading')) {
            button.addClass('loading');
            
            self.processOrder().always(function() {
                button.removeClass('loading');
            }).done(function(data) {
                console.log(data);
                if(data.order.status) {
                    // remove current cart
                    einzl.user.cart_id = null;

                    // create new cart
                    einzl.cart = new Cart();
                    
                    einzl.order = data.order.result;
                    
                    History.pushState("", 'Confirmation', '/confirmation');
                } else {
					notifyUser(einzl.copy.messages.nl_error, 'error');
				}
                
            });
        }
        
        
        
        
        
    });
    
    
    // add user addresses
    einzl.app.getTemplate('/modules/addressList').then(function(hbs) {
        self.addressTemplate = hbs;
        self.insertAddresses();
    });
    
    // enable address buttons
    this.view.find('.user-address-list').on('vclick', 'li', function(e) {
        $(this).addClass('selected');
        $(this).siblings('li').removeClass('selected');
        
        e.preventDefault();
        e.stopPropagation();
    });
};

Checkout.prototype.start = function() {
    
    Page.prototype.start.call(this); 
    
    if(this.view) {
        // add cart to view
        if(einzl.cart.view) {
            this.view.find('.cart').html('');
            einzl.cart.view.clone(true).appendTo(this.view.find('.cart'));
        }
    }
    
    $('.cart-container').removeClass('open');
    $('.cart-button').removeClass('open');
    
};

Checkout.prototype.processOrder = function() {
    
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
        
        $.each(einzl.user.addresses, function() {
            
            if(this.id === billID) {
                billingAddress = this;
                return false;
            }
            
        });
        
    } else {
        // display error
        goToByScroll(billingContainer);
		notifyUser(einzl.copy.messages.checkout_noBillingAddress, 'error');
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
        
        $.each(einzl.user.addresses, function() {
            
            if(this.id === shipID) {
                shippingAddress = this;
                return false;
            }
            
        });
        
    } else {
        // display error
		goToByScroll(shippingContainer);
        notifyUser(einzl.copy.messages.checkout_noShippingAddress, 'error');
        return errorPromise.reject();
    }
    
    order.shipAd = shippingAddress;
    
    // check if cart is empty
    if(!einzl.cart.model || einzl.cart.model.total_items <= 0) {
        // display error
        notifyUser(einzl.copy.messages.checkout_empty_cart, 'error');
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
        cart: einzl.cart.model
    };
    
	console.log(obj);
	
    return einzl.app.askServer(obj).done(function(data) {
        
        console.log(data);
        
    });
    
    
};

Checkout.prototype.insertAddresses = function() {
    
    var self = this;
    var container = $('.user-address-list');
    
    // render address template with user addresses
    var html = this.addressTemplate(einzl.user);
    
    // insert into DOM
    container.html(html);
    
    // activate the first address
    container.find('li:first-child').addClass('selected');
    
    // open form if there is no address yet
    if(einzl.user.addresses.length === 0) {
        this.view.find('#billing-address').addClass('open-form');
    }
};

Checkout.prototype.createUniqueAddressID = function() {
    
    var currentIDs = [];
    
    $.each(einzl.user.addresses, function() {
        currentIDs.push(this.id);
    });
    
    var newID = 1;
    
    while($.inArray(newID + '', currentIDs) > -1) {
        newID++;
    }
    
    return newID + '';
    
};

Checkout.prototype.validateAddressForm = function(form) {
    
    // check that all required fields are filled out
    $(form).find('[required]').each(function() {
        
        var input = $(this);
        
        if(input.val().length === 0) {
            
            input.closest('div').addClass('error');
            input.one('focus', function() {
                input.closest('div').removeClass('error');
            });
            
        }
    });
    
    if($(form).find('.error').length > 0) {
        notifyUser(einzl.copy.messages.form_empty_input, 'error');
        return false;
    }
    
    // check email validity
    var inputEmail = $(form).find('.email input');
    if(!inputEmail.get(0).checkValidity()) {
        
        inputEmail.closest('div').addClass('error');
        inputEmail.one('focus', function() {
            inputEmail.closest('div').removeClass('error');
        });
        
        notifyUser(einzl.copy.messages.form_email_invalid, 'error');
        return false;
        
    }
    
    // check HTML5 validity
    if(!form.checkValidity()) {
        return false;
    }
    
    return true;
};

Checkout.prototype.addUserAddress = function(form) {
    
    // don't add address if validation fails
    if(!this.validateAddressForm(form.get(0))) {
        return false;
    }
    
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
    obj.id = this.createUniqueAddressID();
    
    
    // save into user object
    einzl.user.addresses.push(obj);
    
    // re-render template
    this.insertAddresses();
    
    // save user object into localStorage
    if(isLocalStorageNameSupported()) {
        localStorage.einzl_user = JSON.stringify(einzl.user);
    }
    
    // reset form
    form.get(0).reset();
    
    // close form
    this.view.find('.open-form').removeClass('open-form');
    
};