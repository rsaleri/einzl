var ProductViewExtract = Backbone.View.extend({
	
	template: $.Deferred(),
	
	initialize: function() {
		
		var self = this;
		
		Einzlstck.Models.Shop.getTemplate('modules/product.hbs').then(function(hbs) {
			self.template.resolve(hbs);
		});
		
	},
	
	render: function(data) {
		
		var self = this;
		
		return this.template.then(function(hbs) {
			
			var html = hbs(data);
			
			self.el = $(html);
			
		});
		
	}
	
});


var ProductView = PageView.extend({
	
	template: $.Deferred(),
	
	initialize: function() {
		
		var self = this;
		
		Einzlstck.Models.Shop.getTemplate('pages/product.hbs').then(function(hbs) {
			self.template.resolve(hbs);
		});
		
	},
	
	
	initController: function() {
		
		var self = this;
		
		// enable add-to-cart button
		this.el.find('.add-to-cart').on('vclick', function(e) {
			var button = $(this);

			if(!button.hasClass('loading')) {
				button.addClass('loading').removeClass('success fail');

				self.model.addToCart()
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
		if(this.model.data.stock_level == 0) {
			this.el.addClass('out-of-stock');
		}
		
		this.el.find('.accordeon li').on('vclick', function() {
			var li = $(this);
			li.toggleClass('extended');
		});
		
		var images = $('.image-gallery .images img');
		console.log(images.length);
		this.el.find('.gallery-navigation .thumb').each(function(i) {
			
			$(this).on('vclick', function(e) {
				
				images.eq(i).addClass('active').siblings('img').removeClass('active');
			});
			
		});
		
	}
	
});