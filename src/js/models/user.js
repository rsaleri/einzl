var User = new Backbone.Model.extend({
    
    data: {
        
    },
    
    getFromLocalStorage: function() {
        
        if(isLocalStorageNameSupported() && localStorage.einzl_user) {
        
            var user = JSON.parse(localStorage.einzl_user);
            $.extend(this.data, user);
        }
        
    }
    
    
    
    
});