var Inventory = Backbone.Collection.extend({
    
    model: ProductModel,
    
    initialize: function() {
        
        this.getProducts();
        
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
        
        return Einzlstck.Models.Shop.askServer(obj).done(function(data) {

            if(data && data.status) {
                
                self.add(data.result);
                Einzlstck.Deferreds.products.resolve(data);
                
            } else {
                notifyUser(Einzlstck.Models.Copy.data.messages.noConnection, 'error');
            }
        });
    }
    
});