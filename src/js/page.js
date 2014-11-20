var Page = function(name) {
    this.name = name;
};

Page.prototype.createView = function() {
    
    var self = this;
    
    return einzl.app.getTemplate('pages/'+this.name).then(function(hbs) {

        var html = hbs();

        self.view = $(html);

    });
};

Page.prototype.start = function() {
    
    this.view.appendTo($('main'));
    
};