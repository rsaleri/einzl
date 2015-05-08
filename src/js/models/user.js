var User = Backbone.Model.extend({
    
    data: {
        addresses: []
    },
    
    views: {
        addressList: null
    },
    
    initialize: function() {
        
        this.getFromLocalStorage();
        
        this.views.addressList = new AddressList();
    },
    
    saveToLocalstorage: function() {
        
        if(isLocalStorageNameSupported()) {
            localStorage.einzl_user = JSON.stringify(this.data);
        }
        
    },
    
    getFromLocalStorage: function() {
        
        if(isLocalStorageNameSupported() && localStorage.einzl_user) {
        
            var user = JSON.parse(localStorage.einzl_user);
            $.extend(this.data, user);
        }
        
    },
    
    addAddress: function(obj) {
        
        // save into user object
        this.data.addresses.push(obj);
        
        // save user
        this.saveToLocalstorage();
        
        // re-render address list template
        return this.views.addressList.render(this.data).then(function() {
            
            
            
        });
        
    }
    
    
    
    
});


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