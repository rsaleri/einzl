var Page = function(name) {
    this.name = name;
};

Page.prototype.createView = function() {
    
    var self = this;
    
    // get handlebars template
    return einzl.app.getTemplate('pages/'+this.name).then(function(hbs) {
        
        // compile handlebars template - insert data here, if there is any
        var html = hbs();
        
        // save jQuery object as view
        self.view = $(html);
        
        // render products template and insert into DOM
        $.when(einzl.products).then(function(products) {
            
            // outer loop: go through all products that need to be displayed in this view
            self.view.find('[data-product]').each(function() {
                var el = $(this);
                var id = parseInt(el.attr('data-product'));
                
                // inner loop: find the right products in the product models array
                $.each(products, function() {
                    
                    var model = this;
                    
                    if(model.id === id) {
                    // found the model
                        
                        // get handlebars template
                        $.when(einzl.templates.product).then(function(hbs) {
                            
                             // render handlebars template
                            var html = hbs(model);
                            
                            // insert HTML into view
                            el.html(html);
                        });
                        
                        // exit the inner loop
                        return false;
                    }
                });
            });
            
        });

    });
};

Page.prototype.start = function() {
    
    einzl.pages.active = this;
    
    // empty DOM
    $('main').html('');
    
    // insert view into DOM
    this.view.appendTo($('main'));
    
};