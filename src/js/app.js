var App = function(model) {
    var self = this;
    
    this.model = model;
    
    this.updateFromLocalStorage();
    this.getCopy().then(function() {
        self.getProducts();
    });
    this.initRouting();
    this.initNavigation();
    
};

App.prototype.saveUser = function() {
    // save user object into localStorage
    if(isLocalStorageNameSupported()) {
        localStorage.einzl_user = JSON.stringify(einzl.user);
    }
};

App.prototype.changeLanguageTo = function(lang) {
    
    var self = this;
    
    // save the new language as this users preferred language
    einzl.user.lang = lang;
    
    $('body').attr('data-active-lang', einzl.user.lang);
    
    this.getCopy().then(function() {
        
        // insert new copy for pages
        $.each(einzl.pages, function(key, value) {
            
            if(this.view) {
                this.view.remove();
                delete this.view;
            }
            
            if(key == 'active') {
                this.start();
            }
            
        });
        
        // insert new copy for cart
        einzl.cart.createView();
    });
    
    einzl.app.saveUser();
    
};

App.prototype.insertCopy = function(htmlStr) {
    
    // insert copy
    
    // save HTML string into jQuery object so we can work with it
    var html = $('<div></div>').append(htmlStr);
    
    // insert copy
    html.find('[data-copy]').each(function() {
        var copy = einzl.copy[$(this).attr('data-copy')];
        $(this).html(copy);
    });
	
	// insert placeholders
	html.find('[data-placeholder]').each(function() {
		var placeholder = einzl.copy.placeholders[$(this).attr('data-placeholder')];
		$(this).attr('placeholder', placeholder);
	});
    
    // return the copy-filled HTML string without the DIV we created above
    return html.html();
    
};

App.prototype.getCopy = function() {
    // get copy, the words, the spaces and all typos
    return $.getJSON('copy/' + einzl.user.lang + '.json', function(data) {
        
        // save copy into einzl object
        einzl.copy = data.copy;
        
        // resolve the deferred to let everyone know that we learned words
        einzl.deferreds.copy.resolve();
        
    }).done(function() {
        
        // insert copy into current DOM
        $('[data-copy]').each(function() {
            var copy = einzl.copy[$(this).attr('data-copy')];
            $(this).html(copy);
        });
		
		// TODO: insert placeholders if there are any in index.php (outside of all hbs templates)

        // we just learned words, so say hello to our beloved user
        window.setTimeout(function() {
            notifyUser(einzl.copy.messages.welcome[getRandomInt(0, einzl.copy.messages.welcome.length -1)], 'success');
        }, 2000);
        
    });
};

App.prototype.updateFromLocalStorage = function() {
    if(isLocalStorageNameSupported() && localStorage.einzl_user) {
        
        var user = JSON.parse(localStorage.einzl_user);
        $.extend(einzl.user, user);
    }
    
    // let body know about our language
    $('body').attr('data-active-lang', einzl.user.lang);
    
    this.handleLikes(true);
};

App.prototype.handleLikes = function(onPageLoad) {
    
    var self = this;
    
    // if this function is called on page load
    if(onPageLoad) {
        
        // remove all likes from products that aren't listed anymore
        einzl.deferreds.product.then(function() {
            
            $.each(einzl.user.likes, function(productID, liked) {
            
                var listed = false;
                
                if(liked) {
                    
                    $.each(einzl.products, function(i, product) {
                        
                        if(product.model.id === productID) {
                            listed = true;
                            return false;
                        }

                    });
                    
                }
                

                if(!listed) {
                    console.log('delete like');
                    delete einzl.user.likes[productID];
                }

            });
            
            self.handleLikes();
            
        });
        
    } else {
        
        // provide "has-likes" class, if user got likes or remove it, if not
        var hasLikes = false;
        $.each(einzl.user.likes, function(productID, liked) {

            if(liked) {
                hasLikes = true;
                return false;
            }

        });

        if(hasLikes) {
            $('html').addClass('has-likes');
        } else {
            $('html').removeClass('has-likes');
        }
        
    }
    
};

App.prototype.getProducts = function() {
    var self = this;
    
    // get product models
    var obj = {
        action: 'getProducts'
    };
    
    return this.askServer(obj).done(function(data) {
        
        if(data && data.status) {
            
            // get product template
            self.getTemplate('modules/product').then(function(src) {
                einzl.templates.product = src;
                
                // instantiate Product() for each product in data.result
                $.each(data.result, function(i) {
                    einzl.products[i] = new Product(this);
                });
                
                // resolve Deferred for products (tell the App that the products have been loaded);
                einzl.deferreds.product.resolve();
                
            });
        } else {
			notifyUser(einzl.copy.messages.noConnection, 'error');
            console.log('GET PRODUCTS FAILED');
            console.log(data);
        }
    });
};

App.prototype.askServer = function(obj) {
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
};

App.prototype.initNavigation = function() {
    
    var self = this;
    
    $('.hamburger-button').on('vclick', function(e) {
		
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
    
    $('.cart-button').on('vclick', function(e) {
		
		var cartButton = $(e.currentTarget);
		var menuButton = $('.hamburger-button');
		
		if(cartButton.hasClass('open')) {
			
			// close cart
			cartButton.removeClass('open')
			$('aside.cart-container').removeClass('open');
			$('body').removeClass('no-scroll-mobile');
			
		} else {
			
			// open cart
			cartButton.addClass('open')
			$('aside.cart-container').addClass('open');
			$('body').addClass('no-scroll-mobile');
			
			// close menu
			menuButton.removeClass('open');
			$('header nav').removeClass('open');
			
			
		}
		
        e.preventDefault();
        e.stopPropagation();
    });
    
    $('.language-button span').on('vclick', function(e) {
        var button = $(e.currentTarget);
        self.changeLanguageTo(button.attr('data-language'));
        
    });

    this.initAppRoutingLinks();
};

App.prototype.initAppRoutingLinks = function() {
    
    if(Modernizr.history) {
        $('a').off('vclick');
        $('a').not('[target="_blank"]').on('vclick', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var target = $(this).attr('href');
            var title = $(this).attr('title');
            var current = window.location.pathname;

            if(current !== target) {
                History.pushState("", title, target);
            }
            
            // close navigation
            $('header nav').removeClass('open');
        });
    }
    
};

App.prototype.subscribe = function(userData) {
    var self = this;
    var obj = {
        action: 'subscribe',
        user: userData
    };
    
    return this.askServer(obj).done(function(data) {
        console.log('user successfully subscribed');
        console.log(data);
        notifyUser(einzl.copy.messages.nl_subscribed, 'success');
    }).fail(function(data) {
        console.log('something is wrong with that email');
        console.log(data);
        notifyUser(einzl.copy.messages.nl_error, 'error');
    });
    
};

App.prototype.findDestination = function(target) {
    // find target (slug) in this.model.routes
    
    // define variable which will be returned
    var route = null; 
    
    // loop through pre-defined routes
    $.each(this.model.routes, function() {
        var match = false;
        
        // check their slugs
        $.each(this.slug, function(i, v) {
            
            if(v === target) {
                // found the requested target slug
                match = true;
                // cancel loop
                return false;
            }
        });
        
        if(match) {
        // found route
            
            // save route to return it
            route = this;
            
            // cancel loop
            return false;
        }
        
    });
    
    if(route) {
        // route was found, return it
        return route;
    } else {
        // requested URL doesn't exist, send to 404
        return this.findDestination('/404');
    }
    
    
    
};

App.prototype.route = function(target) {
    var self = this;
    
    if(!target) {
		target = removeSlash(window.location.pathname);
	}
    
    console.log('route to: ' + target);
    
    // get page model
    var route = this.findDestination(target);
    
    // empty DOM but keep jQuery data (events and stuff)
    $('main').children('section').detach();
    
    // give body a loading class
    $('body').addClass('loading');
    
    // TODO: clean that shit up
    if(einzl.pages[route.id] && einzl.pages[route.id].view && einzl.pages[route.id].view.length > 0) {
        einzl.pages[route.id].start();
    } else {
        einzl.pages[route.id] = new Page(route);
        if(route.id == 'checkout') {
            einzl.pages[route.id] = new Checkout(route);
        } else if(route.id == 'confirmation') {
            einzl.pages[route.id] = new Confirmation(route);
        } else {
            einzl.pages[route.id] = new Page(route);
        }
        
        einzl.pages[route.id].start();
    }
    
    // edit document title
    document.title = route.title[einzl.user.lang] + ' - Einzelstück';
	
	// add body attribute
	$('body').attr('active-page', route.id);
    
    // send pageview to GA
    ga('send', 'pageview');
    
    // mark item in main menu
    $('header nav a').removeClass('active').filter('[href="' + route.slug[0] + '"]').addClass('active');
	
	// close cart
	$('.cart-button').removeClass('open')
	$('aside.cart-container').removeClass('open');
    
};



App.prototype.getTemplate = function(name) {
    var self = this;
    return $.when(einzl.deferreds.copy).then(function() {
        return $.get('/templates/'+name+'.hbs').then(function(src) {
            src = self.insertCopy(src)
            return Handlebars.compile(src);
        });
    });
    
};

App.prototype.initRouting = function() {
    
    var self = this;
    var History = window.History;
    
	History.Adapter.bind(window,'statechange',function () {
		var State = History.getState();
		self.route(null);
    });
};

$(document).ready(function() {
    
    // define the main object
    window.einzl = {
        pages: {},
        user: {
            likes: {},
            addresses: [],
            lang: function() {
				
				// default language
				var language = 'de';
				
//				if(userLang) {
//					language = userLang.split('-')[0];
//				}
				
				if(!language || language === 'de') {
					return 'de';
				} else {
					return 'en';
				}
				
			}()
        },
        products: [],
        templates: {},
        deferreds: {
            product: new $.Deferred(),
            copy: new $.Deferred()
        }
    };
    
    // init app
    einzl.app = new App(config);
    
    // route to URL
    einzl.app.route(null);
    
    // init cart
    einzl.cart = new Cart();

});