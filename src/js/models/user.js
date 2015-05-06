var User = Backbone.Model.extend({
    
    data: {
        
    },
    
    initialize: function() {
        
        this.getFromLocalStorage();
        
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
        
    }
    
    
    
    
});