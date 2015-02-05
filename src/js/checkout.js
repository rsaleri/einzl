var Checkout = function(model) {
    
    console.log('this is checkout calling');
    
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
    this.view.find('.new-address-form button[type="reset"]').on('vclick', function() {
        self.view.find('.new-address-form').removeClass('open');
    });
    
    // enable save address button
    this.view.find('.new-address-form button[type="submit"]').on('vclick', function(e) {
        
        e.preventDefault();
        e.stopPropagation();
        
        var form = $(e.currentTarget).closest('form');
        
        self.addUserAddress(form);
        
        
    });
    
    // add user addresses
    einzl.app.getTemplate('/modules/addressList').then(function(hbs) {
        self.addressTemplate = hbs;
        self.insertAddresses();
    });
    
    // enable address buttons
    this.view.find('.user-address-list').on('vclick', 'li', function() {
        $(this).addClass('selected');
        $(this).siblings('li').removeClass('selected');
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
    obj.firstname = form.find('.firstname').val();
    obj.lastname = form.find('.lastname').val();
    obj.email = form.find('.email').val();
    obj.street = form.find('.street').val();
    obj.code = form.find('.code').val();
    obj.city = form.find('.city').val();
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