var ProductViewExtract = Backbone.View.extend({
	
	template: function(data) {
		return Templates.productExtract(data);
	},
	
	initialize: function() {
		
		var self = this;
		
	},
	
	render: function() {
		
		var data = this.model.toJSON();
		
		var html = this.template(data);
		this.el = $(html);
		
		this.initController();
		
		return this.el;
	},
	
	initController: function() {
		
		var self = this;
        
        // enable link to details page
        this.el.on('vclick', function() {
            
            // navigate to confirmation page
            Einzlstck.Router.navigate('/product/' + self.model.get('id'), {
                trigger: true
            });
            
        });
		
		// enable plus button
		this.el.find('.drop.plus').on('vclick', function(e) {
			$(this).closest('.details').toggleClass('collapsed expanded');
			e.preventDefault();
			e.stopPropagation();
		});
		
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
		if(this.model.get('stock_level') === 0) {
			this.el.addClass('out-of-stock');
		}
		
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
	
	render: function() {
		
		var self = this;
		
		var data = this.model.toJSON();
		
		// call the original .render() function from the PageView super/parent class
		PageView.prototype.render.call(this, data).then(function() {
			
			console.log(data);
            
			if(data.recommendations) {
                
                $.each(data.recommendations.data, function() {
                    
                    var recommendedProduct = Einzlstck.Models.Inventory.selectProduct(this.id);
					
					var productViewExtract = new ProductViewExtract({
						model: recommendedProduct
					});
					
					// place its extractView into the random products of this detail-view
					productViewExtract.render().appendTo(self.el.find('.recommended-products'));                   
                    
                });
                
                
                
                
            }
			
			
			
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
		if(this.model.data.stock_level === 0) {
			this.el.addClass('out-of-stock');
		}
        
        // recommendations class
        if(this.model.data.recommendations) {
            this.el.addClass('has-recommendations');
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