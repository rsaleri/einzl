var ProductDetailsModel = PageModel.extend({
	
	initialize: function(data) {
        
        var self = this;
        
        this.data = data;
        this.view = new ProductDetailsView(this.data.hbsPath);
        this.view.model = this;
		
		this.getProductById(this.data.product.id).then(function() {
			
			self.view.render(self.data.product).then(function() {
				
				self.insertProducts();
				self.initController();
				
			});
			
		});
		

		
		
        
    },
	
	addToCart: function() {
		return Einzlstck.Models.Cart.addItem(this.data.product.id);
	},
	
	getProductById: function(id) {
		
		var self = this;
		
		// prepare moltin request
		var obj = {
			action: 'getProductById',
			productId: id
		};

		// do the moltin request and ask for the order, given via URL parameter
		return Einzlstck.Models.Shop.askServer(obj).done(function(data) {
			
			if(data.status) {
				self.data.product = data.result;
			}
			
			
		});
		
	},
	
	initController: function() {
		
		var self = this;
		
		// enable add-to-cart button
		this.view.el.find('.add-to-cart').on('vclick', function(e) {
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
		
	}
	
});


var ProductDetailsView = PageView.extend({
	
	initController: function() {
		
		this.el.find('.accordeon li').on('vclick', function() {
			var li = $(this);
			li.addClass('extended').siblings('li').removeClass('extended');
		});
		
	}
	
});