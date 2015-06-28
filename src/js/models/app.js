$(document).ready(function() {
    
    
    window.Einzlstck = {
        Pages: {},
        Models: {
            
        },
        Views: {
            
        },
        Deferreds: {
            products: $.Deferred(),
            copy: $.Deferred()
        }
        
    };
	
	window.einzl = {
		views: {},
		models: {}
	};
	
	
    
    // let's to this
    einzl.models.user = new User();
	einzl.models.language = new Lang();
	
	einzl.models.language.fetch().then(function() {
		
		Einzlstck.Models.Shop = new Shop();
		einzl.models.inventory = new Inventory();

		einzl.router = new Router(config);

		Einzlstck.Deferreds.products.then(function() {

			Backbone.history.start({pushState: true});
			
			einzl.views.cart = new BasketView({
				model: new Basket()
			});

		});
		
		
	});
	
	
    
});