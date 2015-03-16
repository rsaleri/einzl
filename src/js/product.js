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
    console.log(this.model);
    return einzl.cart.addItem(this.model.id);
    
};

Product.prototype.initController = function() {
    var self = this;
    
    // enable plus button
    this.view.find('.drop.plus').on('vclick', function(e) {
        $(this).closest('.details').toggleClass('collapsed expanded');
        e.preventDefault();
        e.stopPropagation();
    });
    
    // enable add-to-cart button
    this.view.find('.drop.add-to-cart').on('vclick', function(e) {
        var button = $(this);
        
        if(!button.hasClass('loading')) {
            button.addClass('loading').removeClass('success fail');
        
            self.addToCart()
            .always(function() {
                button.removeClass('loading');
            })
            .done(function() {
                button.addTempClass('success', 1500);
            })
            .fail(function() {
                button.addTempClass('fail', 1500);
            });
        }
        
        e.preventDefault();
        e.stopPropagation();
        
    });
	
	// enable image gallery indicators
	this.view.find('.indicators span').each(function(e) {
		
		$(this).on('vclick', function(e) {
			
			var button = $(e.currentTarget);
			var container = button.closest('.product');
			
			if(!button.hasClass('fa-circle')) {
				
				container.find('.background .image.active').removeClass('active');
				container.find('.background .image').eq(button.index()).addClass('active');
				
				container.find('.indicators span.active').removeClass('active');
				container.find('.indicators span').eq(button.index()).addClass('active');
				
				container.find('.background').addTempClass('changeImage', 500);
			}
			
		});
		
	});
	
	// enable image gallery swipe
	this.view.on('swipeleft', function(e) {
		
		var container = $(e.currentTarget);
		
		var activeImage = container.find('.background .image.active');
		var activeIndicator = container.find('.indicators span.active');
		
		if(activeImage.next('.image').length > 0) {
			
			activeImage.next().addClass('active');
			activeIndicator.next().addClass('active');

			activeImage.removeClass('active');
			activeIndicator.removeClass('active');
			
		}
		
		
	});
    
    // enable like button
    this.view.find('.drop.like').on('vclick', function(e) {
        
        // toggle like class
        $(this).toggleClass('liked');
        
        // save like-status
        var liked = $(this).hasClass('liked');
        
        // save like into user object
        einzl.user.likes[self.model.id] = liked;
        
        einzl.app.saveUser();
        
        // send like to google analytics
        if(liked) {
            ga('send', 'event', 'product', self.model.id, 'liked');
        } else {
            ga('send', 'event', 'product', self.model.id, 'unliked');
        }
        
        einzl.app.handleLikes();
        
        e.preventDefault();
        e.stopPropagation();
    });
    
    // add liked-class
    if(einzl.user.likes[this.model.id]) {
        this.view.find('.drop.like').addClass('liked');
    }
};