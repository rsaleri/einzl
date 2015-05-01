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
	
	template: function() {
		console.log('template func');
		console.log(this.model.hbsPath);
		return Einzlstck.Models.Shop.getTemplate(this.model.hbsPath);
		
	},
	
	render: function() {
		var self = this;
		return this.template().then(function(hbs) {
			
			var html = hbs();
			
			self.el = $(html);

			console.log(self.el);
		});
		
	},
	
	initialize: function(model) {
		
		this.model = model;
		console.log(this.model);
	}
	
	
});


var Router = Backbone.Router.extend({

	routes: {
		"*default": "page"
	},

	page: function(data) {
		
		// start the view
		console.log('start view');
		if(!Einzlstck.Views.Home) {
			Einzlstck.Views.Home = new PageView({
				hbsPath: 'pages/home.hbs'
			});
		}
		
		Einzlstck.Views.Home.render();
		
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