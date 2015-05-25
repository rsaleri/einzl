var PageModel = Backbone.Model.extend({
    
    initialize: function(data) {
        
        this.data = data;
        this.view = new PageView(this.data.hbsPath);
        this.view.model = this;
    }
    
});

var PageView = Backbone.View.extend({
	
	render: function(data) {
        
		var self = this;
		
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
	
	initialize: function(hbsPath) {
		
		var self = this;
		
		// get the template
		this.template = $.Deferred();
		Einzlstck.Models.Shop.getTemplate(hbsPath).then(function(hbs) {
			
			// resolve template deferred
			self.template.resolve(hbs);
			
		});
		
	},
	
	insertProducts: function() {
		
		// find all products on this page
		this.el.find('[data-product]').each(function() {
			
			var container = $(this);
			var prodID = container.attr('data-product');
			
			// loop through all products
			$.each(Einzlstck.Models.Products, function() {
				
				var product = this;
				
				// do we have a product match?
				if(product.data.id === prodID) {
					
					// is the product template availble?
					$.when(product.extractView.template).then(function() {
						
						// yes, so insert the products view into the product container on this page
						product.extractView.el.clone(true).appendTo(container);
						
					});
					
					return false;
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