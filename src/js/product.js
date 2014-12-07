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

Product.prototype.addToCart = function() {
    var obj = {
        
    }
};

Product.prototype.initController = function() {
    var self = this;
    
    // enable add-to-cart button
    this.view.find('.drop.add-to-cart').on('vclick', function() {
        
    });
    
    // enable like button
    this.view.find('.drop.like').on('vclick', function() {
        
        // toggle like class
        $(this).toggleClass('liked');
        
        // save like-status
        var liked = $(this).hasClass('liked');
        
        // send to google analytics
        if(liked) {
            ga('send', 'event', 'product', self.model.id, 'liked');
        } else {
            ga('send', 'event', 'product', self.model.id, 'unliked');
        }
        
        // save like into user object
        einzl.user.likes[self.model.id] = liked;
        
        // save user object into localStorage
        if(isLocalStorageNameSupported()) {
            localStorage.einzl_user = JSON.stringify(einzl.user);
        }
    });
    
    // add liked-class
    if(einzl.user.likes[this.model.id]) {
        this.view.find('.drop.like').addClass('liked');
    }
};