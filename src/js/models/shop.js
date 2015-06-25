var Shop = Backbone.Model.extend({
    
    
    initialize: function(model) {
        
        var self = this;
        
        // init some basic events (clicky stuff and all that)
        this.initEvents();
        
        
    },
    
    initEvents: function() {
        
        // this is the cart button
        $(document).on('vclick', '.cart-button', function(e) {
        
            var cartButton = $(e.currentTarget);
            var menuButton = $('.hamburger-button');

            if(cartButton.hasClass('open')) {
                
                // close cart
                einzl.views.cart.close();

            } else {
                
                // open cart
                einzl.views.cart.open();

                // close menu
                menuButton.removeClass('open');
                $('header nav').removeClass('open');


            }

            e.preventDefault();
            e.stopPropagation();
        });
        
        // this is the menu button
        $(document).on('vclick', '.hamburger-button', function(e) {
        
            var menuButton = $(e.currentTarget);
            var cartButton = $('.cart-button');

            if(menuButton.hasClass('open')) {

                // close menu
                menuButton.removeClass('open');
                $('header nav').removeClass('open');
                $('body').removeClass('no-scroll-mobile');

            } else {
				
				// close cart
                einzl.views.cart.close();

                // open menu
                menuButton.addClass('open');
                $('header nav').addClass('open');
                $('body').addClass('no-scroll-mobile');

            }


            e.preventDefault();
            e.stopPropagation();
        });
        
		
		// enable cart close when clicked outside
		$(document).on('vclick', function(e) {
			
			if(!$(e.target).closest('.cart-container').length) {
				if($('.cart-container').hasClass('open')) {
					einzl.views.cart.close();
				}
			}
			
		});
		
    },
    
    getTemplate: function(path) {
        
        return $.get('/templates/'+path).then(function(src) {
                
			// insert copy into this html string
			src = einzl.models.language.insertCopy(src);

			// return a handlebars tempate with copy pre-filled
			return Handlebars.compile(src);
                
            
            
            
        });
        
    },
    
    askServer: function(obj) {
        
        
        return $.ajax({
            type: 'POST',
            dataType:'json',
            url: 'php/ajax.php',
            data: obj
        }).done(function(result) {
            

        }).fail(function(a,b,c) {
            console.log('AJAX Call failed');
            console.log('tried to send this data:');
            console.log(obj);
            console.log('response data:');
            console.log(a);
            console.log(b);
            console.log(c);
        });
        
    },
    
    subscribe: function(userData) {
        var self = this;
        var obj = {
            action: 'subscribe',
            user: userData
        };

        return this.askServer(obj).done(function(data) {
            console.log('user successfully subscribed');
            console.log(data);
            notifyUser(Einzlstck.Models.Copy.data.messages.nl_subscribed, 'success');
        }).fail(function(data) {
            console.log('something is wrong with that email');
            console.log(data);
            notifyUser(Einzlstck.Models.Copy.data.messages.nl_error, 'error');
        });

    }
    
});