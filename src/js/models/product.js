var ProductModel = Backbone.Model.extend({
	
	
	initialize: function(data) {
		
		var self = this;
		
		this.data = data;
		
		this.view = new ProductView();
		
		this.view.render(this.data).then(function() {
			
			self.initController();
			
		});
	},
	
	addToCart: function() {
		
		console.log('add this product to cart: ' + this.data.id);
		
		return Einzlstck.Models.Cart.addItem(this.data.id);
	},
	
	initController: function() {
		
		var self = this;
		
		// enable plus button
		this.view.el.find('.drop.plus').on('vclick', function(e) {
			$(this).closest('.details').toggleClass('collapsed expanded');
			e.preventDefault();
			e.stopPropagation();
		});
		
		// enable add-to-cart button
		this.view.el.find('.drop.add-to-cart').on('vclick', function(e) {
			var button = $(this);

			if(!button.hasClass('loading')) {
				button.addClass('loading').removeClass('success fail');

				self.addToCart()
				.always(function() {
					button.removeClass('loading');
				})
				.done(function() {
					button.addTempClass('success', 1500);
				})
				.fail(function() {
					button.addTempClass('fail', 1500);
				});
			}

			e.preventDefault();
			e.stopPropagation();

		});

		// add stock class
		if(this.data.stock_level === 0) {
			this.view.el.addClass('out-of-stock');
		}
		
	}
	
	
});