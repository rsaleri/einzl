var Page = function(name) {
    this.name = name;
};

Page.prototype.createView = function() {
    
    var self = this;
    
    // get handlebars template
    return einzl.app.getTemplate('pages/'+this.name).then(function(hbs) {
        
        // compile handlebars template - insert data here, if there is any
        var html = hbs();
        
        // save jQuery object as view
        self.view = $(html);
        
        
    });
};

Page.prototype.start = function() {
    
    var self = this;
    
    // check if view exists
    if(this.view) {
        // save this page as the active one
        einzl.pages.active = this;
    
        // empty DOM
        $('main').html('');

        // insert view into DOM
        this.view.appendTo($('main'));
        
        // send pageview to GA
        ga('send', 'pageview');
        
    } else {
        // create view
        this.createView().then(function() {
            // call start again
            self.start();
        });
        
    }
    
    
    
};