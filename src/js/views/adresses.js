var AddressList = Backbone.View.extend({
    
    initialize: function() {
        this.template = Einzlstck.Models.Shop.getTemplate('/modules/addressList.hbs');
    },
    
    render: function(data) {
        
        var self = this;
        
        return this.template.then(function(hbs) {
            
            var html = hbs(data);
            
            self.el = $(html);
            
            // activate the first one
            self.el.find('li:first-child').addClass('selected');
            
            self.initController();
            
            // insert into DOM
            $('.user-address-list').html('');
            self.el.clone(true).appendTo($('.user-address-list'));
            
        });
        
    },
    
    initController: function() {
        
        
    }
    
});

var AddressForm = Backbone.View.extend({
    
    initialize: function() {
        this.template = Einzlstck.Models.Shop.getTemplate('/modules/addressForm.hbs');
    },
    
    render: function(data) {
        
        var self = this;
        
        return this.template.then(function(hbs) {
            
            var html = hbs(data);
            
            self.el = $(html);
            
            self.initController();
            
            // insert into DOM
            $('.new-address-form').html('');
            self.el.clone(true).appendTo($('.new-address-form'));
            
        });
        
    },
    
    initController: function() {
		
		var self = this;
        
		// enable cancel address button
        this.el.find('button[type="reset"]').on('vclick', function(e) {

            // close form
            $(e.currentTarget).closest('.unit').removeClass('open-form');

            // reset form
            self.el.get(0).reset();

            // remove focus
            $(':focus').blur();

            // scroll to address list
            $(window).scrollTop($('#billing-address').offset().top);

            e.preventDefault();
            e.stopPropagation();
        });
		
		
		// enable save address button
        this.el.find('button[type="submit"]').on('vclick', function(e) {

            e.preventDefault();
            e.stopPropagation();

            var form = $(e.currentTarget).closest('form');
            
            
            if(!validateForm(form[0])) {
				return false;
			}
            
            
            var obj = {};
    
            // extract address information
            obj.first_name = form.find('.firstname input').val();
            obj.last_name = form.find('.lastname input').val();
            obj.email = form.find('.email input').val();
            obj.phone = '000';
            obj.address_1 = form.find('.address_1 input').val();
            obj.postcode = form.find('.code input').val();
            obj.city = form.find('.city input').val();
            obj.county = '--';
            obj.country = form.find('.country select').val();
            obj.note = form.find('.note textarea').val();
            obj.id = guid();

            Einzlstck.Models.User.addAddress(obj).then(function() {                
                
                // reset form
                form.get(0).reset();

                // close form
                $('.open-form').removeClass('open-form');
                
            });

        });
        
    }
    
});