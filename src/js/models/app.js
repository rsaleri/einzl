$(document).ready(function() {
    
    window.einzl = {
        views: {},
        models: {}
    };
    
    
    
    // let's to this
    einzl.models.user = new User();
    einzl.models.language = new Lang();
    
    einzl.models.language.fetch().then(function() {
        
        einzl.models.shop = new Shop();
        einzl.models.inventory = new Inventory();

        einzl.router = new Router(config);

        einzl.models.inventory.getProducts().then(function() {

            Backbone.history.start({pushState: true});
            
            einzl.models.cart = new Basket();
            einzl.views.cart = new BasketView({
                model: einzl.models.cart
            });
            
            
            // greet user
            einzl.models.user.sayHello();

        });
        
        
    });
    
    
    
});