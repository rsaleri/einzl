var Shop = Backbone.Model.extend({
	
	
	initialize: function(model) {
		
		var self = this;
        
        // init some basic events (clicky stuff and all that)
        this.initEvents();
		
		// go get the copy
		Einzlstck.Models.Copy = new Lang('de');
		
		// after we have our copy...
		Einzlstck.Deferreds.copy.then(function(copy) {
			
			// ... get products from moltin
			self.getProducts();
			
            // ... and greet the user
            window.setTimeout(function() {
                notifyUser(copy.messages.welcome[getRandomInt(0, copy.messages.welcome.length -1)], 'success');
            }, 2000);
			
		});
		
	},
	
	initEvents: function() {
		
        // this is the cart button
		$(document).on('vclick', '.cart-button', function(e) {
		
			var cartButton = $(e.currentTarget);
			var menuButton = $('.hamburger-button');

			if(cartButton.hasClass('open')) {
				
				// close cart
				Einzlstck.Models.Cart.view.close();

			} else {
				
				// open cart
				Einzlstck.Models.Cart.view.open();

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

                // open menu
                menuButton.addClass('open');
                $('header nav').addClass('open');
                $('body').addClass('no-scroll-mobile');

                // close cart
                cartButton.removeClass('open')
                $('aside.cart-container').removeClass('open');

            }


            e.preventDefault();
            e.stopPropagation();
        });
		
	},
	
	getTemplate: function(path) {
		
		return $.get('/templates/'+path).then(function(src) {
			
			// is the copy already available?
			return Einzlstck.Deferreds.copy.then(function(copy) {
				
				// insert copy into this html string
				src = Einzlstck.Models.Copy.insertCopy(src, copy);
				
				// return a handlebars tempate with copy pre-filled
				return Handlebars.compile(src);
				
			});
			
			
		});
		
	},
	
	getProducts: function() {
		
		var self = this;
		
		// get product models
		var obj = {
			action: 'getProducts'
		};
		
		return this.askServer(obj).done(function(data) {

			if(data && data.status) {
				
				Einzlstck.Models.Products = [];

				$.each(data.result, function(i) {
					Einzlstck.Models.Products[i] = new ProductModel(this);
				});
				
				Einzlstck.Deferreds.products.resolve(data);
				
				
			} else {
				notifyUser(Einzlstck.Models.Copy.data.messages.noConnection, 'error');
				console.log('GET PRODUCTS FAILED');
				console.log(data);
			}
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



$(document).ready(function() {
	
	
	window.Einzlstck = {
		Pages: {},
		Models: {
			
		},
		Views: {
			
		},
		Deferreds: {
			products: $.Deferred(),
            copy: $.Deferred()
		}
		
	};
	
	// let's to this
	Einzlstck.Models.Shop = new Shop();
    Einzlstck.Models.User = new User();
	Einzlstck.Models.Cart = new Basket();
    
    Einzlstck.Router = new Router(config);
});