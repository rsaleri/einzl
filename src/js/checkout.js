var Checkout = function(model) {
    
    console.log('this is checkout calling');
    
    this.model = model;
    
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
    this.view.find('.new-address-form button[type="reset"]').on('vclick', function() {
        self.view.find('.new-address-form').removeClass('open');
    });
    
    // enable save address button
    this.view.find('.new-address-form button[type="save"]').on('vclick', function() {
        
    });
    
    // add user addresses
    einzl.app.getTemplate('/modules/addressList').then(function(hbs) {
        self.addressTemplate = hbs;
        
        self.insertAddresses();
    });
};


Checkout.prototype.insertAddresses = function() {
    
    var self = this;
    var container = $('.user-address-list');
    
    var html = this.addressTemplate(einzl.user);
    
    container.html(html);
};