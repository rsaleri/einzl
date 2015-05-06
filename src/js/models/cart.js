var Basket = Backbone.Model.extend({
	
	initialize: function() {
		
		var self = this;
		
		this.getCart().then(function() {
			
			self.view.render(self.data).then(function() {
				
			});
			
		});
		
		
	},
	
	removeItem: function(product_key) {
		var self = this;

		var obj = {
			action: 'removeFromCart',
			cart: {
				id: self.data.id
			},
			product: {
				key: product_key,
				quantity: self.data.contents[product_key].quantity
			}
		};

		return Einzlstck.Models.Shop.askServer(obj).done(function(data) {
														 
			self.data = data.cart;
														 
			self.view.render(self.data).then(function() {
				
			});
		});
	},
	
	addItem: function(prodID) {
		var self = this;

		var obj = {
			action: 'addToCart',
			cart: {
				id: self.data.id
			},
			product_id: prodID
		};

		return Einzlstck.Models.Shop.askServer(obj).done(function(data) {
			
			self.data = data.cart;
			
			self.view.render(self.data).then(function() {
				
			});
		});

	},
	
	getCart: function() {
		var self = this;
		
		this.view = new BasketView();
    
		// define question for server & moltin
		var obj = {
			action: 'getCart',
			cart: {
				// TODO: get id if already available from localStorage
				id: Einzlstck.Models.User.data.cart_id ? Einzlstck.Models.User.data.cart_id : null
			}
		};

		// get cart data from moltin
		return Einzlstck.Models.Shop.askServer(obj).done(function(data) {

			if(data.cart) {
				// save cart model
				self.data = data.cart;
                
                // save to user model
				Einzlstck.Models.User.data.cart_id = data.cart.id;
                
                // save user into localStorage. TODO: Replace this with a listener on the user model (auto-save onChange)
                Einzlstck.Models.User.saveToLocalstorage();
				
			} else {
				notifyUser(einzl.copy.messages.noConnection, 'error');
			}


		});
	}
	
});


var BasketView = Backbone.View.extend({
	
	template: $.Deferred(),
	
	initialize: function() {
		
		var self = this;
		
		Einzlstck.Models.Shop.getTemplate('modules/cart.hbs').then(function(hbs) {
			self.template.resolve(hbs);
		});
		
	},
	
	render: function(data) {
		
		var self = this;
		
		// round to two decimals (move this into PHP at some point)
		data.totals.rounded.with_tax = data.totals.rounded.with_tax.toFixed(2);
		data.totals.rounded.without_tax = data.totals.rounded.without_tax.toFixed(2);

		$.each(data.contents, function() {

			this.pricing.rounded.with_tax = this.pricing.rounded.with_tax.toFixed(2);
			this.pricing.rounded.without_tax = this.pricing.rounded.without_tax.toFixed(2);

		});
		
        // get the template
		return this.template.then(function(hbs) {
			
            // render it
			var html = hbs(data);
			
            // save it
			self.el = $(html);
			
            // enable clicky stuff
			self.initController();
			
			// insert into DOM
			$('.cart').html(self.el.clone(true));
			
			// update totals outside of view
			$('.total-items').text(data.total_items);
			$('.total-price').text(data.totals.rounded.with_tax);
			
		});
		
	},
	
	initController: function() {
		
		var self = this;
    
		this.el.find('.item').off('vclick');
		this.el.find('.item').on('vclick', function(e) {
			$(e.currentTarget).toggleClass('selected').siblings('li').removeClass('selected');
			e.preventDefault();
			e.stopPropagation();
		});

		this.el.find('.remove').off('vclick');
		this.el.find('.remove').on('vclick', function(e) {
			var li = $(e.currentTarget).closest('li.item');
			var product_key = $(this).closest('li').attr('data-product-key');

			if(!li.hasClass('loading')) {
				li.addClass('loading');
				Einzlstck.Models.Cart.removeItem(product_key);
			}

			e.stopPropagation();
			e.preventDefault();
		});
		
	}
	
	
	
});