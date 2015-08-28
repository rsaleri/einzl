var Inventory = Backbone.Collection.extend({
    
    model: ProductModel,
    
    initialize: function() {
        
        
        
    },
    
    selectProduct: function(id) {
        
        return this.get(id);
        
    },
    
    getProducts: function() {
        
        var self = this;
        
        // get product models
        var obj = {
            action: 'getProducts'
        };
        
        return einzl.models.shop.askServer(obj).done(function(data) {

            if(data && data.status) {
                
                self.add(data.result);
                
            } else {
                notifyUser(einzl.models.language.get('copy').messages.noConnection, 'error');
            }
        });
    }
    
});