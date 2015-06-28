var PageView = Backbone.View.extend({
	
	render: function() {
        
		var self = this;
		
		var data = this.model.toJSON();
		
		return this.template.then(function(hbs) {
			
			var html = hbs(data);
			
			self.el = $(html);
			
			// scroll to top
			$('html, body').scrollTop(0);
			
			// insert into DOM
			$('main').html(self.el);
			
			// remove loading class from body
			$('body').removeClass('loading');
			
			self.initController();
			
			Einzlstck.Deferreds.products.then(function() {
				self.insertProducts();
			});
			
			
		});
		
	},
	
	initialize: function() {
		
		var self = this;
		
		// get the template
		this.template = $.Deferred();
		Einzlstck.Models.Shop.getTemplate(this.model.get('hbsPath')).then(function(hbs) {
			
			// resolve template deferred
			self.template.resolve(hbs);
			
		});
		
	},
	
	insertProducts: function() {
		
		// find all products on this page
		this.el.find('[data-product]').each(function() {
			
			var container = $(this);
			var prodID = container.attr('data-product');
			
			var productModel = Einzlstck.Models.Inventory.selectProduct(prodID);
			
			var productViewExtract = new ProductViewExtract({
				model: productModel
			});
            
            productViewExtract.render().appendTo(container);
			
		});
		
		
		// find all product categories on this page
		this.el.find('[data-product-category]').each(function() {
			
			var container = $(this);
			var category = container.attr('data-product-category');
			
			
			
			$.each(Einzlstck.Models.Inventory.models, function() {
				
				
				
				if(this.data.category.data[category]) {
					
					var productModel = Einzlstck.Models.Inventory.selectProduct(this.data.id);
            		
					var productViewExtract = new ProductViewExtract({
						model: productModel
					});

					productViewExtract.render().appendTo(container);
					
				}
				
			});
			
			
			
		});
		
	},
	
	initController: function() {
        
        var self = this;
		
        // init email subscribe button
        this.el.find('.newsletter-form').each(function() {
			
            var form = $(this);
            var input = form.find('input[type="email"]'),
                button = form.find('button.subscribe[type="submit"]');

            // enable subscribe button
            button.on('vclick', function(e) {

                // stop default stuff
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();

                if(!button.hasClass('loading')) {

                    // check if entered email is valid
                    if(form[0].checkValidity() && input.val().length > 0) {

                        button.addClass('loading');

                        // save entered user data
                        var userData = {
                            email: input.val()
                        };

                        // subscribe
                        Einzlstck.Models.Shop.subscribe(userData)
                        .always(function(data) {
                            button.removeClass('loading');
                            input.val('');
                        })
                        .done(function() {
                            button.addTempClass('success', 2000);
                        })
                        .fail(function() {
                            button.addTempClass('fail', 2000);
                        });

                    } else {

                        // email is invalid
                        input.addClass('error');
                        input.one('focus', function() {
                            input.removeClass('error');
                        });
                    }
                }
            });
        });
		
	}
	
	
});