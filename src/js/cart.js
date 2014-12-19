var Cart = function() {
    
    var self = this;
    
    // get cart data
    this.getCart().then(function() {
        // get cart template
        self.getTemplate().then(function() {
            // create cart view and insert into DOM
            self.createView();
            self.initController();
        });
    });

};

Cart.prototype.removeItem = function(product_key) {
    var self = this;
    
    console.log('remove product ' + product_key);
    var obj = {
        action: 'removeFromCart',
        cart: {
            id: self.model.id
        },
        product: {
            key: product_key,
            quantity: self.model.contents[product_key].quantity
        }
    };
    
    return einzl.app.askServer(obj).done(function(data) {
        self.model = data.cart;
        self.createView();
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
    };
    
    return einzl.app.askServer(obj).done(function(data) {
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
    var self = this;
    var container = $('.cart');
    
    container.on('vclick', '.button.checkout', function(e) {
        
    });
    
    container.on('vclick', '.remove', function(e) {
        var li = $(e.currentTarget).closest('li.item');
        var product_key = $(this).closest('li').attr('data-product-key');
        
        console.log(li);
        
        if(!li.hasClass('loading')) {
            li.addClass('loading');
            self.removeItem(product_key);
        }
        
        
    });
    
};

Cart.prototype.createView = function() {
    
    // render cart handlebars template
    var html = this.template(this.model);
    
    // save rendered template as view
    this.view = $(html);
    
    // insert into DOM
    $('.cart').html('');
    this.view.clone(true).appendTo($('.cart'));
    
    // update totals outside of view
    $('.total-items').text(this.model.total_items);
    $('.total-price').text(this.model.totals.formatted.with_tax);

};