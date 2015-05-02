var Shop = Backbone.Model.extend({
	
	
	initialize: function(model) {
		
		
		
		
		
		
	},
	
	getTemplate: function(path) {
		return $.get('/templates/'+path).then(function(src) {
			
			// insert copy into this HTML string before we do the handlebars magic
			return Einzlstck.Models.Copy.model.then(function(copy) {
				
				src = Einzlstck.Models.Copy.insertCopy(src, copy);
				
				return Handlebars.compile(src);
				
				
			});
			
			
		});
	},
	
	askServer: function(obj) {
		
		return $.ajax({
			type: 'POST',
			dataType:'json',
			url: 'php/ajax.php',
			data: obj
		}).done(function(result) {

		}).fail(function(a,b,c) {
			console.log('AJAX Call failed');
			console.log('tried to send this data:');
			console.log(obj);
			console.log('response data:');
			console.log(a);
			console.log(b);
			console.log(c);
		});
		
	}
	
});



$(document).ready(function() {
	
	
	window.Einzlstck = {
		
		Models: {
			
			Shop: new Shop(),
			Copy: new Lang('de')
			
		},
		Views: {
			
			
			
		},
		Router: new Router()
		
	};
	
	Backbone.history.start({pushState: true});
});