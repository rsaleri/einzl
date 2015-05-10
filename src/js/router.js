var Router = Backbone.Router.extend({
	
	initialize: function(config) {
        
        this.config = config;
		
		Backbone.history.start({pushState: true});
		
		
		// add loadinging class to body
		$('body').addClass('loading');
		
		// handle internal links
		$(document).on('vclick', 'a:not([target="_blank"])', function(e) {
			
			// prevent page reload
			e.preventDefault();
			
			// navigate to the target
			var href = $(this).attr('href');
			Einzlstck.Router.navigate(href, true);
			
		});
		
		
	},
	
	execute: function(callback, args) {
		
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
		
		"confirmation/:orderID": "confirmation",
        
		":page": "page",
        "*default": "page"
	},
    
    page: function(target) {
        
        var slug = target ? "/" + target : "/";
        
        // get config information
        var config = this.getRouteConfig(slug);
		
        // init page if it isn't already
		if(!Einzlstck.Pages[config.id]) {
			Einzlstck.Pages[config.id] = new PageModel(config);
		}
		
        // render the view
		Einzlstck.Pages[config.id].view.render();
		
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
		if(!Einzlstck.Pages[config.id]) {
			Einzlstck.Pages[config.id] = new CheckoutModel(config);
		}
		
        // render the view
		Einzlstck.Pages[config.id].view.render();
		
	},
	
	confirmation: function(orderID) {
		
		/* check if this can be done dynamically
         * as discussed here:
         * http://stackoverflow.com/questions/7563949/backbone-js-get-current-route
         */ 
		var slug = "/confirmation";
        
        // get config information
        var config = this.getRouteConfig(slug);
		
		config.order = {
			id: orderID
		};
		
        // init page
		Einzlstck.Pages[config.id] = new OrderModel(config);
		
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

        if(route) {
            // route was found, return it
            return route;
        } else {
            // requested URL doesn't exist, send to 404
            return this.getRouteConfig('/404');
        }



    }

});