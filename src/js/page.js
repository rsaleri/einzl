var Page = function(model) {
    this.model = model;
    
};

Page.prototype.renderView = function(hbs) {
    console.log('render view');
    var self = this;
    
    // compile handlebars template - pass model to it
    var html = hbs(this.model);

    // save jQuery object as view
    this.view = $(html);
    
    // insert copy
    einzl.app.insertCopy(this.view);

    // insert products into view once the product array is available
    $.when(einzl.deferreds.product).then(function() {
        self.insertProducts();
    });
};

Page.prototype.createView = function() {
    
    var self = this;
    
    console.log('create view');
    
    // get handlebars template
    return einzl.app.getTemplate(this.model.hbsPath).then(function(hbs) {
        
        console.log('got template');
        self.renderView(hbs);
        
        self.initController();
    });
};

Page.prototype.initController = function() {
    
    // init email subscribe button
    this.view.find('.newsletter-form').each(function() {
        var form = $(this);
        var input = form.find('input[type="email"]'),
            button = form.find('button.subscribe[type="submit"]');
        
        // enable subscribe button
        button.on('vclick', function(e) {
            
            // stop default stuff
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            
            if(!button.hasClass('loading')) {

                // check if entered email is valid
                if(form[0].checkValidity() && input.val().length > 0) {

                    button.addClass('loading');

                    // save entered user data
                    var userData = {
                        email: input.val()
                    };

                    // subscribe
                    einzl.app.subscribe(userData)
                    .always(function(data) {
                        button.removeClass('loading');
                        input.val('');
                    })
                    .done(function() {
                        button.addTempClass('success', 2000);
                    })
                    .fail(function() {
                        button.addTempClass('fail', 2000);
                    });

                } else {
                    
                    // email is invalid
                    input.addClass('error');
                    input.one('focus', function() {
                        input.removeClass('error');
                    });
                }
            }
        });
    });
};

Page.prototype.insertProducts = function() {
    
    var self = this;
    
    // loop #1: all products that need to be inserted on this page
    this.view.find('[data-product]').each(function() {
        var container = $(this);
        var prodID = container.attr('data-product');
        
        // loop #2: find the products in products array by ID
        $.each(einzl.products, function() {
            var id = this.model.id;
            
            if(prodID === id) {
                // found the product
                
                // insert clone of product view into DOM
                this.view.clone(true).appendTo(container);
                
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
    
        
        
        // scroll to top
        $(window).scrollTop(0);
        
        // remove body loading class
        $('body').removeClass('loading');

        // insert view into DOM
        this.view.appendTo($('main'));
        
    } else {
        
        // create view
        this.createView().then(function() {
            // call start again
            self.start();
        });
        
    }
};