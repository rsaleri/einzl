var Router = Backbone.Router.extend({

	routes: {
		"home": "home",
		"rings": "rings",
		"ringe": "rings",
		"*default": "home"
	},

	home: function(data) {
		
		if(!Einzlstck.Views.Home) {
			Einzlstck.Views.Home = new PageView({
				hbsPath: 'pages/home.hbs'
			});
		}
		
		
		Einzlstck.Views.Home.render();
		
	},
	
	rings: function(data) {
		
		if(!Einzlstck.Views.Rings) {
			Einzlstck.Views.Rings = new PageView({
				hbsPath: 'pages/rings.hbs'
			});
		}
		
		
		Einzlstck.Views.Rings.render();
		
	}

});