var BasketView = Backbone.View.extend({
	
	template: $.Deferred(),
	
	initialize: function() {
		
		var self = this;
		
		Einzlstck.Models.Shop.getTemplate('modules/cart.hbs').then(function(hbs) {
			self.template.resolve(hbs);
		});
		
		this.model.on('change', function() {
			console.log('cart model changed');
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
		
        // get the template
		return this.template.then(function(hbs) {
			
            // render it
			var html = hbs(data);
			
            // save it
			self.el = $(html);
			
            // enable clicky stuff
			self.initEvents();
			
			// insert into DOM
			$('.cart').html(self.el.clone(true));
			
			// update totals outside of view
			$('.total-items').text(data.total_items);
			$('.total-price').text(data.totals.post_discount.rounded.with_tax.toFixed(2));
			
		});
		
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