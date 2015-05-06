var User = Backbone.Model.extend({
    
    data: {
        
    },
    
    initialize: function() {
        
        this.getFromLocalStorage();
        
    },
    
    getFromLocalStorage: function() {
        
        if(isLocalStorageNameSupported() && localStorage.einzl_user) {
        
            var user = JSON.parse(localStorage.einzl_user);
            $.extend(this.data, user);
        }
        
    }
    
    
    
    
});