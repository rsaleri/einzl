var ProductModel = Backbone.Model.extend({
	
	
	initialize: function(data) {
		
		var self = this;
		
		this.data = data;
		
		this.view = new ProductView();
		this.view.model = this;
		
		this.extractView = new ProductViewExtract();
		
		this.extractView.render(this.data).then(function() {
			self.initController();
		});
		
	},
	
	addToCart: function() {
		return Einzlstck.Models.Cart.addItem(this.data.id);
	},
	
	initController: function() {
		
		var self = this;
        
        // enable link to details page
        this.extractView.el.on('vclick', function() {
            
            // navigate to confirmation page
            Einzlstck.Router.navigate('/product/' + self.data.id, {
                trigger: true
            });
            
        });
		
		// enable plus button
		this.extractView.el.find('.drop.plus').on('vclick', function(e) {
			$(this).closest('.details').toggleClass('collapsed expanded');
			e.preventDefault();
			e.stopPropagation();
		});
		
		// enable add-to-cart button
		this.extractView.el.find('.add-to-cart').on('vclick', function(e) {
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
		if(this.data.stock_level == 0) {
			this.extractView.el.addClass('out-of-stock');
		}
		
	}
	
	
});