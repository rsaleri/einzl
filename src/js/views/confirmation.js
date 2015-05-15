var OrderView = PageView.extend({
	
	initController: function() {
        
        PageView.prototype.initController.apply(this);
        
        this.el.find('#pay-manual').show();
        
    }
	
});