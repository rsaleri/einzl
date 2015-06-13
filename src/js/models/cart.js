var Basket = Backbone.Model.extend({
    
    initialize: function() {
        
        var self = this;
        
        this.view = new BasketView();
        
        this.getCart().then(function() {
            
            self.view.render(self.data).then(function() {
                
            });
            
        });
        
        
    },
    
    removeItem: function(product_key) {
        var self = this;

        var obj = {
            action: 'removeFromCart',
            cart: {
                id: self.data.id
            },
            product: {
                key: product_key,
                quantity: self.data.contents[product_key].quantity
            }
        };

        return Einzlstck.Models.Shop.askServer(obj).done(function(data) {
                                                         
            self.data = data.cart;
                                                         
            self.view.render(self.data).then(function() {
                
            });
        });
    },
    
    addItem: function(prodID) {
        var self = this;

        var obj = {
            action: 'addToCart',
            cart: {
                id: self.data.id
            },
            product_id: prodID
        };

        return Einzlstck.Models.Shop.askServer(obj).done(function(data) {
            
            self.data = data.cart;
            
            console.log(data);
            
            self.view.render(self.data).then(function() {
                
				Einzlstck.Models.Cart.view.open();
				
            });
        });

    },
    
    getCart: function() {
        var self = this;
    
        // define question for server & moltin
        var obj = {
            action: 'getCart'
        };

        // get cart data from moltin
        return Einzlstck.Models.Shop.askServer(obj).done(function(data) {

            if(data.cart) {
                // save cart model
                self.data = data.cart;
                
                // save to user model
                Einzlstck.Models.User.data.cart_id = data.cart.id;
                
                // save user into localStorage. TODO: Replace this with a listener on the user model (auto-save onChange)
                Einzlstck.Models.User.saveToLocalstorage();
                
            } else {
                notifyUser(Einzlstck.Models.Copy.data.messages.noConnection, 'error');
            }


        });
    }
    
});
