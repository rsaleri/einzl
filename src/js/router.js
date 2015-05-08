var Router = Backbone.Router.extend({
	
	initialize: function(config) {
        
        this.config = config;
		
		Backbone.history.start({pushState: true});
		
		// handle internal links
		$(document).on('vclick', 'a:not([target="_blank"])', function(e) {
			
			// prevent page reload
			e.preventDefault();
			
			// navigate to the target
			var href = $(this).attr('href');
			Einzlstck.Router.navigate(href, true);
			
		});
		
		
	},

	routes: {
        "checkout": "checkout",
        "kasse": "checkout",
        
		":page": "page",
        "*default": "page"
	},
    
    page: function(target) {		
        
        var slug = target ? "/" + target : "/";
        
        console.log('route to ' + slug);
        
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
        
        console.log('route to ' + slug);
        
        // get config information
        var config = this.getRouteConfig(slug);
		
        // init page if it isn't already
		if(!Einzlstck.Pages[config.id]) {
			Einzlstck.Pages[config.id] = new CheckoutModel(config);
		}
		
        // render the view
		Einzlstck.Pages[config.id].view.render();
		
	},
	
	confirmation: function(data) {
		
		console.log('route to home');
		
		if(!Einzlstck.Views.Confirmation) {
			Einzlstck.Views.Confirmation = new PageView({
				hbsPath: 'pages/confirmation.hbs'
			});
		}
		
		
		Einzlstck.Views.Confirmation.render();
		
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