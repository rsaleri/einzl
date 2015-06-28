var OrderView = PageView.extend({
	
	initialize: function() {
		
		var self = this;
		
		this.model.on('change', function() {
			self.render();
		});
		
		
	},
	
	handlePayment: function() {
		
		if(this.model.get('order').status.value === 'Paid' || this.model.get('order').status.value === 'Dispatched') {
			
			// order is already paid
			this.el.find('#paid').show();
			
			
			
		} else {
			
			// show payment info for manual gateway
			this.el.find('#pay-manual').show();
			
		}
		
	},
	render: function() {
		
		PageView.prototype.render.apply(this);
		
		this.handlePayment();
		
	},
	
	initController: function() {
        
        PageView.prototype.initController.apply(this);
        
    }
	
});