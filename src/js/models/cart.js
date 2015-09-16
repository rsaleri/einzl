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
                id: this.get('id')
            },
            product: {
                key: product_key,
                quantity: this.get('contents')[product_key].quantity
            }
        };

        return einzl.models.shop.askServer(obj).done(function(data) {
			
			// save data
            self.set(data.cart);
			
        });
    },
    
    addItem: function(prodID) {
        var self = this;

        var obj = {
            action: 'addToCart',
            cart: {
                id: this.get('id')
            },
            product_id: prodID
			
        };

        return einzl.models.shop.askServer(obj).done(function(data) {
			
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
        return einzl.models.shop.askServer(obj).done(function(data) {
			
			console.log('GOT CART');
			
            if(data.cart) {
                // save cart model
				self.set(data.cart);
                
            } else {
                notifyUser(einzl.models.language.get('copy').messages.noConnection, 'error');
            }


        });
    }
    
});
