var PageView = Backbone.View.extend({
	
	render: function() {
		
		var self = this;
		
		return this.template.then(function(hbs) {
			var html = hbs();
			
			self.el = $(html);
			
			// scroll to top
			$('html, body').scrollTop(0);
			
			// insert into DOM
			$('main').html(self.el);
			
			self.initController();
			
			Einzlstck.Deferreds.products.then(function() {
				self.insertProducts();
			});
			
			
		});
		
	},
	
	initialize: function(model) {
		
		var self = this;
		
		// page specific data
		this.model = model;
		
		// get the template
		this.template = $.Deferred();
		Einzlstck.Models.Shop.getTemplate(this.model.hbsPath).then(function(hbs) {
			
			// resolve template deferred
			self.template.resolve(hbs);
			
		});
		
	},
	
	insertProducts: function() {
		
		console.log('insert products');
		
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
					$.when(product.view.template).then(function() {
						
						// yes, so insert the products view into the product container on this page
						product.view.el.clone(true).appendTo(container);
						
					});
					
					return false;
				}
				
			});
			
		});
		
	},
	
	initController: function() {
		
		
		
	}
	
	
});