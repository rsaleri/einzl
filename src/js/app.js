var App = function(model) {
    var self = this;
    
    this.model = config;
    
    this.updateFromLocalStorage();
    this.getCopy().then(function() {
        self.getProducts();
    });
    this.initRouting();
    this.initNavigation();
    
};

App.changeLanguageTo = function(lang) {
    
    this.model.lang = lang;
    
    this.getCopy().then(function() {
        // TODO: insertCopy for all Pages, and App (and whereever it will be used again)
    });
    
};

App.prototype.getCopy = function() {
    // get copy, the words, the spaces and all typo
    return $.getJSON('copy/' + this.model.lang + '.json', function(data) {
        
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
            self.getTemplate('modules/product').then(function(hbs) {
                einzl.templates.product = hbs;
                
                // instantiate Product() for each product in data.result
                $.each(data.result, function(i) {
                    einzl.products[i] = new Product(this);
                });
                
                // resolve Deferred for products (tell the App that the products have been loaded);
                einzl.deferreds.product.resolve();
                
            });
        } else {
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
    
    $('.hamburger-button').on('vclick', function() {
        $('header nav').toggleClass('open');
    });
    
    $('.cart-button').on('vclick', function() {
        $('aside.cart-container').toggleClass('open');
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
    
    // TODO: clean that shit up
    if(einzl.pages[route.id] && einzl.pages[route.id].view.length > 0) {
        einzl.pages[route.id].start();
    } else {
        einzl.pages[route.id] = new Page(route);
        if(route.id == 'checkout') {
            einzl.pages[route.id] = new Checkout(route);
        } else {
            einzl.pages[route.id] = new Page(route);
        }
        
        einzl.pages[route.id].start();
    }
    
    // edit document title
    document.title = route.title+ ' - Einzelstück';
    
    // send pageview to GA
    ga('send', 'pageview');
    
    // mark item in main menu
    $('header nav a').removeClass('active').filter('[href="' + route.slug[0] + '"]').addClass('active');
    
};

App.prototype.getTemplate = function(name) {
    return $.get('/templates/'+name+'.hbs').then(function(src) {
       return Handlebars.compile(src);
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
            likes: {}
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

    ga('create', 'UA-46833918-1', 'auto');

});