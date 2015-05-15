var AddressList = Backbone.View.extend({
    
    initialize: function() {
        this.template = Einzlstck.Models.Shop.getTemplate('/modules/addressList.hbs');
    },
    
    render: function(data) {
        
        var self = this;
        
        return this.template.then(function(hbs) {
            
            var html = hbs(data);
            
            self.el = $(html);
            
            // activate the first one
            self.el.find('li:first-child').addClass('selected');
            
            self.initController();
            
            // insert into DOM
            $('.user-address-list').html('');
            self.el.clone(true).appendTo($('.user-address-list'));
            
        });
        
    },
    
    initController: function() {
        
        
    }
    
});