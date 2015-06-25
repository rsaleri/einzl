var AddressList = Backbone.View.extend({
	
	template: function(data) {
		return Templates.addressList(data)
	},
    
    initialize: function() {
        
    },
    
    render: function(data) {
        
        var self = this;
		
		
        var html = this.template(data);
            
		this.el = $(html);

		// activate the first one
		this.el.find('li:first-child').addClass('selected');

		this.initController();

		// insert into DOM
		$('.user-address-list').html('');
		this.el.clone(true).appendTo($('.user-address-list'));
        
    },
    
    initController: function() {
        
        
    }
    
});

var AddressForm = Backbone.View.extend({
	
	template: function(data) {
		return Templates.addressForm(data)
	},
    
    initialize: function() {
        
    },
    
    render: function(data) {
        
        var self = this;
		
        var html = this.template(data);
            
		this.el = $(html);

		this.initController();

		// insert into DOM
		$('.new-address-form').html('');
		this.el.clone(true).appendTo($('.new-address-form'));
        
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