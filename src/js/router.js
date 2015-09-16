var Router = Backbone.Router.extend({
	
	initialize: function(config) {
		
		var self = this;
        
        this.config = config;
		
		
		
		
		// add loading class to body
		$('body').addClass('loading');
		
		// handle internal links
		$(document).on('vclick', 'a:not([target="_blank"])', function(e) {
			
			// prevent page reload
			e.preventDefault();
			
			// navigate to the target
			var href = $(this).attr('href');
			self.navigate(href, true);
            
            // The following is done in execute() as well. This is dirty. Find a better way
            // close menu
            $('.hamburger-button').removeClass('open');
            $('header nav').removeClass('open');
			
		});
		
	},
	
	execute: function(callback, args) {
		
		// close menu
		$('.hamburger-button').removeClass('open');
		$('header nav').removeClass('open');
		
		// add loading class to body
		$('body').addClass('loading');

		// remove current page from DOM
		$('main section').remove();
		
		if(callback)  {
			callback.apply(this, args);
		}
		
	},

	routes: {
        "checkout": "checkout",
        "kasse": "checkout",
        
        "gateway": "gateway",
		
		"product/:id": "product",
        "p/:id": "product",
		
		"confirmation/:orderID": "confirmation",
        
        "": "page",
		":page": "page",
        "*default": "notfound"
	},
	
	product: function(id) {
		
		var slug = "/product/:id";
		
		console.log('product id: ' + id);
        
        // get config information
        var config = this.getRouteConfig(slug);
		
		var productModel = einzl.models.inventory.selectProduct(id);
			
		var productView = new ProductView({model: productModel});
		productView.render();

		// set document title
		document.title = productModel.data.title + ' - ' + productModel.data.category.value + ' - Einzelstück';
		
		
		
		$('header nav a').removeClass('active');
		
	},
    
    notfound: function(target) {
        
        var slug = '/404';
        
        // get config information
        var config = this.getRouteConfig(slug);
        
        // init page if it isn't already
		if(!einzl.views[config.id]) {
			einzl.views[config.id] = new PageView({model: new PageModel(config)});
		}
		
        // render the view
		einzl.views[config.id].render();
		
		// set document title
		document.title = config.title.de + ' - Einzelstück';
        
    },
    
    page: function(target) {
        
        var slug = target ? "/" + target : "/";
        
        // get config information
        var config = this.getRouteConfig(slug);
		
        // init page if it isn't already
		if(!einzl.views[config.id]) {
			einzl.views[config.id] = new PageView({model: new PageModel(config)});
		}
		
        // render the view
		einzl.views[config.id].render();
		
		// set document title
		document.title = config.title.de + ' - Einzelstück';
		
		// mark item in main menu
    	$('header nav a').removeClass('active').filter('[href="' + config.slug[0] + '"]').addClass('active');
		
	},
	
	checkout: function(target) {
        
        /* check if this can be done dynamically
         * as discussed here:
         * http://stackoverflow.com/questions/7563949/backbone-js-get-current-route
         */ 
		var slug = "/checkout";
        
        // get config information
        var config = this.getRouteConfig(slug);
		
		// init page if it isn't already
		if(!einzl.views[config.id]) {
			einzl.views[config.id] = new CheckoutView({model: new CheckoutModel(config)});
		}
		
        // render the view
		einzl.views[config.id].render();
		
		// set document title
		document.title = config.title.de + ' - Einzelstück';
		
		$('header nav a').removeClass('active');
		
	},
	
	confirmation: function(orderID) {
		
		/* check if this can be done dynamically
         * as discussed here:
         * http://stackoverflow.com/questions/7563949/backbone-js-get-current-route
         */ 
		var slug = "/confirmation/:orderID";
        
        // get config information
        var config = this.getRouteConfig(slug);
		
		config.order = {
			id: orderID
		};
		
		// init page
		einzl.views[config.id] = new OrderView({model: new OrderModel(config)});
		
		// set document title
		document.title = config.title.de + ' - Einzelstück';
		
		$('header nav a').removeClass('active');
		
	},
    
    gateway: function() {
        
        /* check if this can be done dynamically
         * as discussed here:
         * http://stackoverflow.com/questions/7563949/backbone-js-get-current-route
         */ 
		var slug = "/confirmation/:orderID";
        
        // get config information
        var config = this.getRouteConfig(slug);
        
        config.urlParams = getUrlParams();
        
        // init page
		einzl.models.gateway = new GatewayModel(config);
        
    },
    
    getRouteConfig: function(target) {
        // find target (slug) in this.model.routes

        // define variable which will be returned
        var route = null; 

        // loop through pre-defined routes
        $.each(this.config, function() {
            var match = false;

            // check their slugs
            $.each(this.slug, function(i, v) {

                if(v === target) {
                    // found the requested target slug
                    match = true;
                    // cancel loop
                    return false;
                }
            });

            if(match) {
            // found route

                // save route to return it
                route = this;

                // cancel loop
                return false;
            }

        });
		
		$('body').attr('data-route', route.id);

        if(route) {
            // route was found, return it
            return route;
        } else {
            // requested URL doesn't exist, send to 404
            return this.getRouteConfig('/404');
        }



    }

});