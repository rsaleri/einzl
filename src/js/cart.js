var Cart = function() {
    
    var self = this;
    
    // get cart data
    this.getCart().then(function() {
        self.createView();
    });
    
};

Cart.prototype.removeItem = function(product_key) {
    var self = this;
    
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
        // TODO: parse cart data and fix moltins pricings
        self.model = data.cart;
        self.renderView();
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
        self.renderView();
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
        
		if(data.cart) {
			// save cart model
			self.model = data.cart;

			// save id into user object
			einzl.user.cart_id = data.cart.id;

			einzl.app.saveUser();
		} else {
			notifyUser(einzl.copy.messages.noConnection, 'error');
		}
        
        
    });
    
};

Cart.prototype.createView = function() {
    var self = this;
    return einzl.app.getTemplate('modules/cart').then(function(hbs) {
        self.template = hbs;
        self.renderView(hbs);
    });
};

Cart.prototype.initController = function() {
    var self = this;
    
	this.view.find('.item').off('vclick');
    this.view.find('.item').on('vclick', function(e) {
        $(e.currentTarget).toggleClass('selected').siblings('li').removeClass('selected');
        e.preventDefault();
        e.stopPropagation();
    });
    
	this.view.find('.remove').off('vclick');
    this.view.find('.remove').on('vclick', function(e) {
        var li = $(e.currentTarget).closest('li.item');
        var product_key = $(this).closest('li').attr('data-product-key');
        
        if(!li.hasClass('loading')) {
            li.addClass('loading');
            self.removeItem(product_key);
        }
		
        
        e.stopPropagation();
        e.preventDefault();
    });
    
};


Cart.prototype.insertIntoDOM = function() {
    
    // insert into DOM
    $('.cart').html('');
    this.view.clone(true).appendTo($('.cart'));
    
    // re-init app links
    einzl.app.initAppRoutingLinks();
    
    // update totals outside of view
    $('.total-items').text(this.model.total_items);
    $('.total-price').text(this.model.totals.rounded.with_tax);
    
};


Cart.prototype.renderView = function() {
    
    var self = this;
    
    // round to two decimals (move this into PHP at some point)
    this.model.totals.rounded.with_tax = this.model.totals.rounded.with_tax.toFixed(2);
    this.model.totals.rounded.without_tax = this.model.totals.rounded.without_tax.toFixed(2);

    $.each(this.model.contents, function() {

        this.pricing.rounded.with_tax = this.pricing.rounded.with_tax.toFixed(2);
        this.pricing.rounded.without_tax = this.pricing.rounded.without_tax.toFixed(2);

    });
    
    // render cart handlebars template
    var html = this.template(this.model);
    
    // save rendered template as view
    this.view = $(html);
    
	this.initController();
	
    this.insertIntoDOM();
    
    

};