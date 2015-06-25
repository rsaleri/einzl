var User = Backbone.Model.extend({
    
    data: {
        addresses: []
    },
    
    views: {
        addressList: null,
		addressForm: null
    },
    
    sayHello: _.once(function() {
        
        // greet the user - only once!
        var helloTimeout = window.setTimeout(function() {
            notifyUser(einzl.models.language.get('copy').messages.welcome[getRandomInt(0, einzl.models.language.get('copy').messages.welcome.length -1)], 'success');
        }, 2000);
        
        return helloTimeout;
        
    }),
    
    initialize: function() {
        
        this.getFromLocalStorage();
        
        this.views.addressList = new AddressList();
		this.views.addressForm = new AddressForm();
        
        this.sayHello();
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