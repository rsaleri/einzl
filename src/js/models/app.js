var Shop = Backbone.Model.extend({
	
	
	initialize: function(model) {
		
	},
	
	getTemplate: function(path) {
		return $.get('/templates/'+path).then(function(src) {
			return Handlebars.compile(src);
		});
	}
	
});


var PageView = Backbone.View.extend({
	
	render: function() {
		var self = this;
		return this.template.then(function(hbs) {
			var html = hbs();
			
			self.el = $(html);

			$('main').html(self.el);
			
			self.initController();
		});
		
	},
	
	initialize: function(model) {
		
		var self = this;
		
		// page specific data
		this.model = model;
		this.template = $.Deferred();
		
		// get the template
		Einzlstck.Models.Shop.getTemplate(this.model.hbsPath).then(function(hbs) {
			
			// resolve template deferred
			self.template.resolve(hbs);
			
		});
		
	},
	
	initController: function() {
		
		
		
	}
	
	
});


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


$(document).ready(function() {
	
	
	window.Einzlstck = {
		
		Models: {
			
			Shop: new Shop()
			
		},
		Views: {
			
			
			
		},
		Router: new Router()
		
	};
	
	Backbone.history.start({pushState: true});
});