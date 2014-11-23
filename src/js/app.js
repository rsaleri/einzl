var App = function() {
    
    this.initRouting();
    this.initNavigation();
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

App.prototype.route = function(target) {
    var self = this;
    
    if(!target) {
		target = removeSlash(window.location.pathname);
	}
    
    
    var pageName;
	if(target === "/" || target === "") {
        pageName = 'home';
    } else {
        pageName = target;
    }
    
    if(einzl.pages[pageName] && einzl.pages[pageName].view.length > 0) {
        einzl.pages[pageName].start();
    } else {
        einzl.pages[pageName] = new Page(pageName);
        einzl.pages[pageName].createView().then(function() {
            einzl.pages[pageName].start();
        });
    }
    
    
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
        pages: {}
    };
    einzl.app = new App();
    einzl.app.route(null);
});
