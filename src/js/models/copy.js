var Lang = Backbone.Model.extend({
	
	
	initialize: function(language) {
		
		
		this.language = language;
		
		this.model = $.Deferred();
		this.getCopy();
		
		
	},
	
	getCopy: function() {
		
		var self = this;
		
		return $.getJSON('copy/' + this.language + '.json', function(data) {

			// resolve the deferred to let everyone know that we learned words
			self.model.resolve(data.copy);

		});
		
	},
	
	insertCopy: function(htmlStr, allCopy) {
		
		var self = this;
		
		// insert copy
    
		// save HTML string into jQuery object so we can work with it
		var html = $('<div></div>').append(htmlStr);

		// insert copy
		html.find('[data-copy]').each(function() {
			var copy = allCopy[$(this).attr('data-copy')];
			$(this).html(copy);
		});

		// insert placeholders
		html.find('[data-placeholder]').each(function() {
			var placeholder = allCopy.placeholders[$(this).attr('data-placeholder')];
			$(this).attr('placeholder', placeholder);
		});

		// return the copy-filled HTML string without the DIV we created above
		return html.html();
		
	}
	
});