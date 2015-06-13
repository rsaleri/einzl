var Basket = Backbone.Model.extend({
    
    initialize: function() {
        
        var self = this;
        
        this.getCart();
		
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
			
			// remove this as soon as everything is backboned
            self.data = data.cart;
			
			// save data
            self.set(data.cart);
			
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
            
            // remove this as soon as everything is backboned
            self.data = data.cart;
			
			// save data
            self.set(data.cart);
            
			einzl.views.cart.open();
			
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
				
				self.set(data.cart);
                
            } else {
                notifyUser(Einzlstck.Models.Copy.data.messages.noConnection, 'error');
            }


        });
    }
    
});
