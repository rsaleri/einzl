var Cart = function() {
    
    var self = this;
    
    this.getTemplate().then(function() {
        self.createView();
        
        self.view.appendTo($('.cart'));
    });
    
    this.getCart();
    
};

Cart.prototype.getCart = function() {
    var self = this;
    
    var obj = {
        action: 'getCart',
        cart: {
            id: einzl.user.cart_id ? einzl.user.cart_id : null
        }
    };
    
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

Cart.prototype.createView = function() {
    
    var html = this.template();
    
    this.view = $(html);
};