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
		
		"armbaender": "bracelets",
		"bracelets": "bracelets",
		
		"anhaenger": "pendants",
		"pendants": "pendants",
		
		"checkout": "checkout",
		"kasse": "checkout",
		
		"confirmation": "confirmation",
		"bestaetigung": "confirmation",
		
		"marke": "brand",
		"brand": "brand",
		
		"impressum": "imprint",
		"imprint": "imprint",
		
		"shipping": "shipping",
		
		"privacy": "privacy",
		
		"*default": "home"
		
	},
	
	checkout: function(data) {
		
		console.log('route to home');
		
		if(!Einzlstck.Views.Checkout) {
			Einzlstck.Views.Checkout = new PageView({
				hbsPath: 'pages/checkout.hbs'
			});
		}
		
		
		Einzlstck.Views.Checkout.render();
		
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
		
	},
	
	bracelets: function(data) {
		
		console.log('route to bracelets');
		
		if(!Einzlstck.Views.Bracelets) {
			Einzlstck.Views.Bracelets = new PageView({
				hbsPath: 'pages/bracelets.hbs'
			});
		}
		
		
		Einzlstck.Views.Bracelets.render();
		
	},
	
	pendants: function(data) {
		
		console.log('route to pendants');
		
		if(!Einzlstck.Views.Pendants) {
			Einzlstck.Views.Pendants = new PageView({
				hbsPath: 'pages/pendants.hbs'
			});
		}
		
		
		Einzlstck.Views.Pendants.render();
		
	},
	
	brand: function(data) {
		
		console.log('route to brand');
		
		if(!Einzlstck.Views.Brand) {
			Einzlstck.Views.Brand = new PageView({
				hbsPath: 'pages/brand.hbs'
			});
		}
		
		
		Einzlstck.Views.Brand.render();
		
	},
	
	imprint: function(data) {
		
		console.log('route to imprint');
		
		if(!Einzlstck.Views.Imprint) {
			Einzlstck.Views.Imprint = new PageView({
				hbsPath: 'pages/imprint.hbs'
			});
		}
		
		
		Einzlstck.Views.Imprint.render();
		
	},
	
	shipping: function(data) {
		
		console.log('route to shipping');
		
		if(!Einzlstck.Views.Shipping) {
			Einzlstck.Views.Shipping = new PageView({
				hbsPath: 'pages/shipping.hbs'
			});
		}
		
		
		Einzlstck.Views.Shipping.render();
		
	},
	
	privacy: function(data) {
		
		console.log('route to privacy');
		
		if(!Einzlstck.Views.Privacy) {
			Einzlstck.Views.Privacy = new PageView({
				hbsPath: 'pages/privacy.hbs'
			});
		}
		
		
		Einzlstck.Views.Privacy.render();
		
	}

});