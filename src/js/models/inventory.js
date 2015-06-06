var Inventory = Backbone.Model.extend({
    
    initialize: function() {
        
        this.getProducts();
        
    },
    
    products: {},
    
    selectProduct: function(id) {
        
        return this.products[id];
        
    },
    
    getProducts: function() {
        
        var self = this;
        
        // get product models
        var obj = {
            action: 'getProducts'
        };
        
        return Einzlstck.Models.Shop.askServer(obj).done(function(data) {

            if(data && data.status) {
                
                Einzlstck.Models.Products = [];

                $.each(data.result, function(i) {
                    var prodData = this;
                    
                    // init all products
                    if(!self.products[prodData.id]) {                        
                        self.products[prodData.id] = new ProductModel(prodData);
                    }
                    
                });
                
                Einzlstck.Deferreds.products.resolve(data);
                
            } else {
                notifyUser(Einzlstck.Models.Copy.data.messages.noConnection, 'error');
            }
        });
    }
    
    
});