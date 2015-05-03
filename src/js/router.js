var Router = Backbone.Router.extend({
	
	initialize: function() {
		
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
		"home": "home",
		"rings": "rings",
		"ringe": "rings",
		"*default": "home"
	},

	home: function(data) {
		
		console.log('route to home');
		
		if(!Einzlstck.Views.Home) {
			Einzlstck.Views.Home = new PageView({
				hbsPath: 'pages/home.hbs'
			});
		}
		
		
		Einzlstck.Views.Home.render();
		
	},
	
	rings: function(data) {
		
		console.log('route to rings');
		
		if(!Einzlstck.Views.Rings) {
			Einzlstck.Views.Rings = new PageView({
				hbsPath: 'pages/rings.hbs'
			});
		}
		
		
		Einzlstck.Views.Rings.render();
		
	}

});