var ProductModel = Backbone.Model.extend({
	
	
	initialize: function(data) {
		
		var self = this;
		
		this.data = data;
		
		this.set(data);
		
	},
	
	addToCart: function() {
        
        if(this.data.stock_level <= 0) {
            notifyUser(this.data.title + ' ist ausverkauft :-(', 'error');
            return $.Deferred().reject();
        } else {
            return einzl.views.cart.model.addItem(this.get('id'));
        }
        
	}
	
	
});