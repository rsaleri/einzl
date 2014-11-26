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
        
        // insert products into DOM once the product array is available
        $.when(einzl.deferreds.product).then(function() {
            self.insertProducts();
        });
    });
};

Page.prototype.insertProducts = function() {
    
    var self = this;
    
    // loop #1: all products that need to be inserted on this page
    this.view.find('[data-product]').each(function() {
        var container = $(this);
        var prodID = parseInt(container.attr('data-product'));
        
        // loop #2: find the products in products array by ID
        $.each(einzl.products, function() {
            var id = this.model.id;
            
            if(prodID === id) {
                // found the product
                
                // insert into DOM
                this.view.appendTo(container);
                
                // cancel loop #2
                return false;
            }
            
        });
    });
    
};

Page.prototype.start = function() {
    
    var self = this;
    
    // check if view exists
    if(this.view) {
        // save this page as the active one
        einzl.pages.active = this;
    
        // empty DOM but keep jQuery data (events and stuff)
        $('main').children().detach();

        // insert view into DOM
        this.view.appendTo($('main'));
        
        // send pageview to GA
        ga('send', 'pageview');
        
    } else {
        // create view
        this.createView().then(function() {
            // call start again
            self.start();
        });
        
    }
    
    
    
};