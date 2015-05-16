var ProductViewExtract = Backbone.View.extend({
	
	template: $.Deferred(),
	
	initialize: function() {
		
		var self = this;
		
		Einzlstck.Models.Shop.getTemplate('modules/product.hbs').then(function(hbs) {
			self.template.resolve(hbs);
		});
		
	},
	
	render: function(data) {
		
		var self = this;
		
		return this.template.then(function(hbs) {
			
			var html = hbs(data);
			
			self.el = $(html);
			
		});
		
	}
	
});


var ProductView = PageView.extend({
	
	template: $.Deferred(),
	
	initialize: function() {
		
		var self = this;
		
		Einzlstck.Models.Shop.getTemplate('pages/product.hbs').then(function(hbs) {
			self.template.resolve(hbs);
		});
		
	},
	
	
	initController: function() {
		
		this.el.find('.accordeon li').on('vclick', function() {
			var li = $(this);
			li.addClass('extended').siblings('li').removeClass('extended');
		});
		
	}
	
});