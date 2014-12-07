var App = function() {
    this.updateFromLocalStorage();
    this.getCopy();
    this.initRouting();
    this.initNavigation();
    this.getProducts();
};

App.changeLanguageTo = function(lang) {
    
    config.lang = lang;
    
    this.getCopy().then(function() {
        // insertCopy for all Pages, and App (and whereever it will be used again)
    });
    
};

App.prototype.getCopy = function() {
    return $.getJSON('copy/' + config.lang + '.json', function(data) {
        einzl.copy = data.copy;
        
        einzl.deferreds.copy.resolve();
    }).done(function() {
        // insert copy into current DOM
        $('[data-copy]').each(function() {
            var copy = einzl.copy[$(this).attr('data-copy')];
            $(this).html(copy);
        });
        
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
    
    var obj = {
        action: 'subscribe',
        user: userData
    };
    
    return this.askServer(obj).done(function(data) {
        console.log('user successfully subscribed');
        console.log(data);
        notifyUser('Hey das hat geklappt :-) Wir freuen uns!', 'success');
    }).fail(function(data) {
        console.log('something is wrong with that email');
        console.log(data);
        notifyUser('Oh, da ging etwas schief :(', 'error');
    });
    
};

App.prototype.findDestination = function(target) {
    // find target in config.routes (slug)
    
    // define variable which will be returned
    var route = null; 
    
    // loop through pre-defined routes
    $.each(config.routes, function() {
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
        einzl.pages[route.id].start();
    }
    
    // edit document title
    document.title = route.title; // add  + ' - Einzelstück' later
    
    // send pageview to GA
    ga('send', 'pageview');
    
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
    
    einzl.app = new App();
    einzl.app.route(null);
    
    einzl.cart = new Cart();

    ga('create', 'UA-46833918-1', 'auto');

});

// init google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// CUSTOM EVENTS: ga('send', 'event', 'category', 'action', 'label', value);
