var Page = function(model) {
    this.model = model;
};

Page.prototype.createView = function() {
    
    var self = this;
    
    // get handlebars template
    return einzl.app.getTemplate(this.model.hbsPath).then(function(hbs) {
        
        // compile handlebars template - insert data here, if there is any
        var html = hbs();
        
        // save jQuery object as view
        self.view = $(html);
        
        // insert copy into view once JSON is available
        $.when(einzl.deferreds.copy).then(function() {
            self.insertCopy();
        });
        
        // insert products into view once the product array is available
        $.when(einzl.deferreds.product).then(function() {
            self.insertProducts();
        });
        
        self.initController();
    });
};

Page.prototype.insertCopy = function() {
    
    this.view.find('[data-copy]').each(function() {
        var copy = einzl.copy[$(this).attr('data-copy')];
        
        $(this).html(copy);
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
            
            if(!button.hasClass('loading')) {
                // stop default stuff
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();

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
            console.log(this);
            if(prodID === id) {
                // found the product
                console.log(this);
                // insert copy of product view into DOM
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
    
        // empty DOM but keep jQuery data (events and stuff)
        $('main').children('section').detach();
        
        // scroll to top
        $(window).scrollTop(0);

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