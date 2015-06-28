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
    
    
    Einzlstck.Models.User = new User();
	
	einzl.models.language = new Lang();
	
	einzl.models.language.fetch().then(function() {
		
		Einzlstck.Models.Shop = new Shop();
		Einzlstck.Models.Inventory = new Inventory();
		
		einzl.views.cart = new BasketView({
			model: new Basket()
		});

		Einzlstck.Router = new Router(config);

		Einzlstck.Deferreds.products.then(function() {

			Backbone.history.start({pushState: true});

		});
		
		
	});
	
	
    
});