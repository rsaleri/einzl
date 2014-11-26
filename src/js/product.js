var Product = function(model) {
    this.model = model;
    this.createView();
};

Product.prototype.createView = function() {
    
    // render handlebars template
    var html = einzl.templates.product(this.model);

    // save jQuery object of HTML as view
    this.view = $(html);
        
    this.initController();
    
};

Product.prototype.initController = function() {
    this.view.find('.drop').on('vclick', function() {
        alert('test');
    });
};