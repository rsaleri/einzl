var CheckoutView = PageView.extend({
    
    insertAddresses: function() {
        
        var self = this;
		
		// insert "new address" form
		Einzlstck.Models.User.views.addressForm.render();
        
        // are there addresses?
        if(Einzlstck.Models.User.data.addresses.length > 0) {
            
            // yup, insert them
            Einzlstck.Models.User.views.addressList.render(Einzlstck.Models.User.data);
            
        } else {
            
            // nope, open the form
            this.el.find('#billing-address').addClass('open-form');
            
        }
        
        
        
    },
    
    initController: function() {
        
        PageView.prototype.initController.apply(this);
        
        
        var self = this;
        
        
        // insert addresses
        this.insertAddresses();
        
        // enable new address button
        this.el.find('.new-address-button').on('vclick', function(e) {
            $(e.currentTarget).closest('.unit').addClass('open-form');
        });

        

        

        // enable process order button
        this.el.find('.button.buy').on('vclick', function(e) {

            var button = $(e.currentTarget);

            if(!button.hasClass('loading')) {
                button.addClass('loading');

                self.model.processOrder().always(function() {
					
                    button.removeClass('loading');
					
                }).done(function(data) {

                    if(data.order.status) {
						
						self.model.confirmOrder(data.order.result);
                        
                    } else {
                        notifyUser(Einzlstck.Models.Copy.data.messages.nl_error, 'error');
                    }

                });
            }

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