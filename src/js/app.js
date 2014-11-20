var App = function() {
    
    this.initRouting();
};

App.prototype.route = function(target) {
    var self = this;
    
    if(!target) {
		target = removeSlash(window.location.pathname);
	}
    
    console.log('navigate to: ' + target);
    
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
    einzl.app.route('home');
});