var Shop = Backbone.Model.extend({
	
	
	initialize: function(model) {
		
	},
	
	getTemplate: function(path) {
		return $.get('/templates/'+path).then(function(src) {
			return Handlebars.compile(src);
		});
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