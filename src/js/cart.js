var Cart = function() {
    
    var self = this;
    
    this.getTemplate().then(function() {
        self.createView();
        
        self.view.appendTo($('.cart'));
    });
    
};

Cart.prototype.getTemplate = function() {
    var self = this;
    return einzl.app.getTemplate('modules/cart').then(function(hbs) {
        self.template = hbs;
    });
};

Cart.prototype.createView = function() {
    
    var html = this.template();
    
    this.view = $(html);
};