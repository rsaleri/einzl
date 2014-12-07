var Cart = function() {
    
    var self = this;
    
    // get cart data
    this.getCart().then(function() {
        // get cart template
        self.getTemplate().then(function() {
            // create cart view and insert into DOM
            self.createView();
        });
    });
    
};

Cart.prototype.addItem = function(prodID) {
    var self = this;
    
    var obj = {
        action: 'addToCart',
        cart: {
            id: self.model.id
        },
        product_id: prodID
    }
    
    return einzl.app.askServer(obj).done(function(data) {
        console.log(data);
        
        self.model = data.cart;
        self.createView();
    });
    
};

Cart.prototype.getCart = function() {
    var self = this;
    
    // define question for server & moltin
    var obj = {
        action: 'getCart',
        cart: {
            id: einzl.user.cart_id ? einzl.user.cart_id : null
        }
    };
    
    // get cart data from moltin
    return einzl.app.askServer(obj).done(function(data) {
        console.log(data);
        
        // save cart model
        self.model = data.cart;
        
        // save id into user object
        einzl.user.cart_id = data.cart.id;

        // save user object into localStorage
        if(isLocalStorageNameSupported()) {
            localStorage.einzl_user = JSON.stringify(einzl.user);
        }
    });
    
};

Cart.prototype.getTemplate = function() {
    var self = this;
    return einzl.app.getTemplate('modules/cart').then(function(hbs) {
        self.template = hbs;
    });
};

Cart.prototype.initController = function() {
    
    // enable remove-button
    // try it without a data-prodID in the cart, think about how to do it via models only
    
};

Cart.prototype.createView = function() {
    console.log('create view');
    console.log(this.model);
    
    var html = this.template(this.model);
    
    this.view = $(html);
    
    // insert into DOM
    $('.cart').html('');
    this.view.clone(true).appendTo($('.cart'));
    
    this.initController();
};