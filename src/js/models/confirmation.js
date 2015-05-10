var OrderModel = PageModel.extend({
	
	initialize: function(data) {
        
        var self = this;
        
        this.data = data;
        this.view = new OrderView(this.data.hbsPath);
        this.view.model = this;
		
		console.log('Order Model created');
		console.log(data);
		
		this.getOrder(this.data.order.id).then(function() {
			
			self.view.render(self.data).then(function() {
				
			});
			
		});
        
    },
	
	getOrder: function(orderID) {
		
		var self = this;
		
		// prepare moltin request
		var obj = {
			action: 'getOrder',
			orderID: orderID
		};

		// do the moltin request and ask for the order, given via URL parameter
		return Einzlstck.Models.Shop.askServer(obj).done(function(data) {
			
			if(data.order.status) {
				
				self.data.order = data.order.result;
				
			}
			
		});
		
	}
	
});