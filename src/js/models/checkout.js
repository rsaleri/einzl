var CheckoutModel = PageModel.extend({
	
	initialize: function(data) {
        
        this.data = data;
        this.view = new CheckoutView(this.data.hbsPath);
        this.view.model = this;
    },
    
    test: function() {
        
    }
	
});


var CheckoutView = PageView.extend({
    
    initController: function() {
        
        PageView.prototype.initController.apply(this);
        
        
        var self = this;    
        console.log('init controller');
        // enable new address button
        this.el.find('.new-address-button').on('vclick', function(e) {
            $(e.currentTarget).closest('.unit').addClass('open-form');
        });

        // enable cancel address button
        this.el.find('.new-address-form button[type="reset"]').on('vclick', function(e) {

            // close form
            $(e.currentTarget).closest('.unit').removeClass('open-form');

            // reset form
            self.view.find('form').get(0).reset();

            // remove focus
            $(':focus').blur();

            // scroll to address list
            $(window).scrollTop(self.view.find('#billing-address').offset().top);

            e.preventDefault();
            e.stopPropagation();
        });

        // enable save address button
        this.el.find('.new-address-form button[type="submit"]').on('vclick', function(e) {

            e.preventDefault();
            e.stopPropagation();

            var form = $(e.currentTarget).closest('form');

//            self.addUserAddress(form);

        });

        // enable process order button
        this.el.find('.button.buy').on('vclick', function(e) {

            var button = $(e.currentTarget);

            if(!button.hasClass('loading')) {
                button.addClass('loading');

//                self.processOrder().always(function() {
//                    button.removeClass('loading');
//                }).done(function(data) {
//
//                    console.log(data);
//
//                    if(data.order.status) {
//
//                        // remove current cart
//                        einzl.user.cart_id = null;
//
//                        // create new cart
//                        einzl.cart = new Cart();
//
//                        // save order
//                        einzl.order = data.order.result;
//
//                        // track order with google analytics
//                        self.trackOrder(einzl.order);
//
//                        History.pushState("", 'Confirmation', '/confirmation?orderID=' + einzl.order.id);
//                    } else {
//                        notifyUser(Einzlstck.Models.Copy.data.messages.nl_error, 'error');
//                    }
//
//                });
            }





        });


        // add user addresses
        Einzlstck.Models.Shop.getTemplate('/modules/addressList').then(function(hbs) {
            self.addressTemplate = hbs;
//            self.insertAddresses();
        });

        // enable address buttons
        this.el.find('.user-address-list').on('vclick', 'li', function(e) {
            $(this).addClass('selected');
            $(this).siblings('li').removeClass('selected');

            e.preventDefault();
            e.stopPropagation();
        });
        
        
        
        // insert cart (move this if template isnt rendered on each visit anymore)
        try {
            this.el.find('.cart').html(Einzlstck.Models.Cart.view.el.clone(true));
        } catch(e) {
            // cart will be inserted when it's ready by the CartView
        }

        $('.cart-container').removeClass('open');
        $('.cart-button').removeClass('open');
        
    }
    
});