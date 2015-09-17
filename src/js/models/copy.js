var Lang = Backbone.Model.extend({
	
	defaults: {
		language: 'de'
	},
	
	url: function() {
		return 'copy/' + this.get('language') + '.json';
	},
	
	insertCopy: function(htmlStr) {
		
		var self = this;
		
		// insert copy
    
		// save HTML string into jQuery object so we can work with it
		var html = $('<div></div>').append(htmlStr);

		// insert copy
		html.find('[data-copy]').each(function() {
			var copy = self.get('copy')[$(this).attr('data-copy')];
			$(this).html(copy);
		});

		// insert placeholders
		html.find('[data-placeholder]').each(function() {
			var placeholder = self.get('copy').placeholders[$(this).attr('data-placeholder')];
			$(this).attr('placeholder', placeholder);
		});

		// return the copy-filled HTML string without the DIV we created above
		return html.html();
		
	}
	
});