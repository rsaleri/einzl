var Checkout = function(model) {
    
    this.model = model;
    
    this.order = {};
    
    Page.apply(this,arguments);
    
};

// inherit Experience prototype and all it's variables and functions
Checkout.prototype = Object.create(Page.prototype);
Checkout.prototype.constructor = Checkout;

Checkout.prototype.initController = function() {
    
    var self = this;
    
    // enable new address button
    this.view.find('.new-address-button').on('vclick', function() {
        self.view.find('.new-address-form').addClass('open');
    });
    
    // enable cancel address button
    this.view.find('.new-address-form button[type="reset"]').on('vclick', function(e) {
        self.view.find('.new-address-form').removeClass('open');
        
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
                
                if(data.order.status) {
                    // remove current cart
                    einzl.user.cart_id = null;

                    // create new cart
                    einzl.cart = new Cart();
                    
                    einzl.order = data.order.result;
                    
                    History.pushState("", 'Confirmation', '/confirmation');
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
            console.log('insert cart into view');
            this.view.find('.cart').html(einzl.cart.view);
        }
    }
    
    $('.cart-container').removeClass('open');
    $('.cart-button').removeClass('open');
    
};

Checkout.prototype.processOrder = function() {
    
    console.log('process order');
    
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
        console.log('error');
        return false;
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
        console.log('error');
        return false;
    }
    
    order.shipAd = shippingAddress;
    
    // check if cart is empty
    if(!einzl.cart.model || einzl.cart.model.total_items <= 0) {
        // display error
        console.log('error');
        return false;
    }
    
    
    // get payment choice
    var payContainer = $('#payment-choice');
    var choice = payContainer.find('[name="paymentOption"]:checked').val();
    order.payment = choice;
    
    var obj = {
        action: 'processOrder',
        order: order,
        cart: einzl.cart.model
    };
    
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

Checkout.prototype.addUserAddress = function(form) {
    
    // TODO: add form validation
    
    var obj = {};
    
    // extract address information
    obj.first_name = form.find('.firstname').val();
    obj.last_name = form.find('.lastname').val();
    obj.email = form.find('.email').val();
    obj.phone = '000';
    obj.address_1 = form.find('.address_1').val();
    obj.postcode = form.find('.code').val();
    obj.city = form.find('.city').val();
    obj.county = '--';
    obj.country = form.find('.country').val();
    obj.note = form.find('.note').val();
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
    this.view.find('.new-address-form').removeClass('open');
    
};