var Confirmation = function(model) {
    
    this.model = model;
    
    
    
//    einzl.order = JSON.parse('{"id":"914473201281532904","created_at":"2015-02-06 14:42:02","updated_at":"2015-02-06 14:42:02","customer":{"value":"Sumit","data":{"id":"523","order":null,"created_at":"2014-06-12 15:36:49","updated_at":"2014-06-12 15:36:49","first_name":"Sumit","last_name":"Kumar","email":"sk@outlook.com","group":null,"gender":"male","fbid":528632405,"lastlogin":null,"instaid":0,"hash":"IZNRGpoiIJ","role":"user"}},"gateway":{"value":"Manual","data":{"name":"Manual","slug":"manual","description":null,"enabled":true}},"status":{"value":"Unpaid","data":{"key":"unpaid","value":"Unpaid"}},"subtotal":55,"shipping_price":0,"total":65.45,"currency":{"value":"Euro","data":{"id":26,"code":"EUR","title":"Euro","enabled":true,"modifier":"+0","exchange_rate":1,"format":"EUR {price}","decimal_point":",","thousand_point":".","rounding":null,"default":false,"created_at":null,"updated_at":null}},"currency_code":"EUR","exchange_rate":1,"shipping":null,"ship_to":{"value":"","data":{"id":"914473199779972071","order":null,"created_at":"2015-02-06 14:42:02","updated_at":"2015-02-06 14:42:02","save_as":"","first_name":"Sumit","last_name":"Kumar","address_1":"Schwabstraße 32","address_2":"","postcode":"70197","country":{"value":"Germany","data":{"code":"DE","name":"Germany"}},"company":"","city":"Stuttgart","customer":{"value":"Sumit","data":{"id":"523","order":null,"created_at":"2014-06-12 15:36:49","updated_at":"2014-06-12 15:36:49","first_name":"Sumit","last_name":"Kumar","email":"sk@outlook.com","group":null,"gender":"male","fbid":528632405,"lastlogin":null,"instaid":0,"hash":"IZNRGpoiIJ","role":"user"}},"phone":"000","county":"--","instructions":""}},"bill_to":{"value":"","data":{"id":"914473199779972071","order":null,"created_at":"2015-02-06 14:42:02","updated_at":"2015-02-06 14:42:02","save_as":"","first_name":"Sumit","last_name":"Kumar","address_1":"Schwabstraße 32","address_2":"","postcode":"70197","country":{"value":"Germany","data":{"code":"DE","name":"Germany"}},"company":"","city":"Stuttgart","customer":{"value":"Sumit","data":{"id":"523","order":null,"created_at":"2014-06-12 15:36:49","updated_at":"2014-06-12 15:36:49","first_name":"Sumit","last_name":"Kumar","email":"sk@outlook.com","group":null,"gender":"male","fbid":528632405,"lastlogin":null,"instaid":0,"hash":"IZNRGpoiIJ","role":"user"}},"phone":"000","county":"--","instructions":""}}}');
    
    
    this.model.order = einzl.order;
    
    Page.apply(this,arguments);
    
};

// inherit Experience prototype and all it's variables and functions
Confirmation.prototype = Object.create(Page.prototype);
Confirmation.prototype.constructor = Confirmation;

Confirmation.prototype.start = function() {
    
    Page.prototype.start.call(this);
    
    if(this.view) {
        this.handleAccess();
    }
    
    
};

Confirmation.prototype.handleAccess = function() {
    
    var self = this;
	var parameters = getUrlParams();
    
    console.log(parameters);
    
    // redirect user to home if he tries to access confirmation page without placing an order
    if(einzl.order || parameters.orderID) {
        
        
        if(parameters.orderID) {
            
            var obj = {
                action: 'getOrder',
                orderID: parameters.orderID
            };
            
            einzl.app.askServer(obj).done(function(data) {
                
                console.log(data);
                
                if(data.order && data.order.status) {
                    einzl.order = data.order.result;
                    self.createView().then(function() {
                        self.view.appendTo($('main'));
                    });
                    
                    
                }
                
            });
            
        } else {
            // check gateway
            self.handlePayment();
        }
        
        
        
    } else {
        History.pushState("", 'Home', '/');
    }
	
    
    
    
};


Confirmation.prototype.handlePayment = function() {
    
    var self = this;
    
    if(einzl.order.gateway.data.slug === 'paypal-express') {
            
        var payButton = self.view.find('.button.pay');

        payButton.addClass('loading');

        var obj = {
            action: "processPayment",
            orderID: einzl.order.id
        }

        einzl.app.askServer(obj).done(function(data) {

            console.log(data);
            payButton.removeClass('loading');

            if(data.payment.status && data.payment.result.url) {

                // show payment
                payButton.on('vclick', function() {

                    window.open(data.payment.result.url);

                });

            }

        });


        $('#pay-paypal').show();

    } else {
        $('#pay-manual').show();
    }
    
}