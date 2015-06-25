var BasketView = Backbone.View.extend({
	
	template: function(data) {
		return Templates.cart(data);
	},
	
	initialize: function() {
		
		var self = this;
		
		this.model.on('change', function() {
			self.render();
		});
		
	},
	
	close: function() {
		
		if($('aside.cart-container').hasClass('open')) {
			
			// close cart
			$('.cart-button').removeClass('open');
			$('aside.cart-container').removeClass('open');
			$('body').removeClass('no-scroll-mobile');
			
		}
		
	},
	
	open: function() {
		
		// open cart
		$('.cart-button').addClass('open');
		$('aside.cart-container').addClass('open');
		$('body').addClass('no-scroll-mobile');
		
	},
	
	render: function() {
		
		var self = this;
		
		var data = this.model.toJSON();

		$.each(data.contents, function() {

			this.pricing.rounded.with_tax = this.pricing.rounded.with_tax.toFixed(2);
			this.pricing.rounded.without_tax = this.pricing.rounded.without_tax.toFixed(2);

		});
		
        // render it
		var html = this.template(data);
		
		// save it
		self.el = $(html);

		// enable clicky stuff
		self.initEvents();

		// insert into DOM
		$('.cart').html(self.el.clone(true));

		// update totals outside of view
		$('.total-items').text(data.total_items);
		$('.total-price').text(data.totals.post_discount.rounded.with_tax.toFixed(2));
		
		return self.el;
		
	},
	
	initEvents: function() {
		
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
				self.model.removeItem(product_key);
			}

			e.stopPropagation();
			e.preventDefault();
		});
		
	}
	
	
	
});