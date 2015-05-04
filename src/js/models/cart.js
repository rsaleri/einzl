var Basket = Backbone.Model.extend({
	
	initialize: function() {
		
		var self = this;
		
		this.get().then(function() {
			
			console.log('got cart');
			
			self.view.render(self.data).then(function() {
				
				
				
			});
			
		});
		
		
	},
	
	get: function() {
		var self = this;
		
		this.view = new BasketView();
    
		// define question for server & moltin
		var obj = {
			action: 'getCart',
			cart: {
				// TODO: get id if already available from localStorage
				id: null
			}
		};

		// get cart data from moltin
		return Einzlstck.Models.Shop.askServer(obj).done(function(data) {

			if(data.cart) {
				// save cart model
				self.data = data.cart;

				// TODO: save id into user object
				
				
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
		
		return this.template.then(function(hbs) {
			
			var html = hbs(data);
			
			self.el = $(html);
			
			// insert into DOM
			$('.cart').html(self.el.clone(true));
			
			// update totals outside of view
			$('.total-items').text(data.total_items);
			$('.total-price').text(data.totals.rounded.with_tax);
			
		});
		
	}
	
	
	
});