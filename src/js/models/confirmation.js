var OrderModel = PageModel.extend({
	
	initialize: function(data) {
        
		this.set(data);
		this.getOrder(this.get('order').id);
        
    },
	
	getOrder: function(orderID) {
		
		var self = this;
		
		// prepare moltin request
		var obj = {
			action: 'getOrder',
			orderID: orderID
		};

		// do the moltin request and ask for the order, given via URL parameter
		return einzl.models.shop.askServer(obj).done(function(data) {
			
			if(data.order.status) {
				self.set({
					order: data.order.result
				});
				
			}
			
		});
		
	}
	
});