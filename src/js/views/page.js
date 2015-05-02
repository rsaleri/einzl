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
		
		// get the template
		this.template = $.Deferred();
		Einzlstck.Models.Shop.getTemplate(this.model.hbsPath).then(function(hbs) {
			
			// resolve template deferred
			self.template.resolve(hbs);
			
		});
		
	},
	
	initController: function() {
		
		
		
	}
	
	
});