var Shop = Backbone.Model.extend({
	
	
	initialize: function(model) {
		
		var self = this;
		
		// go get the copy
		Einzlstck.Models.Copy = new Lang('de');
		
		// after we have our copy...
		Einzlstck.Models.Copy.model.then(function() {
			
			// ... get products from moltin
			self.getProducts();
			
		});
		
		this.initEvents();
		
	},
	
	initEvents: function() {
		
		$(document).on('vclick', '.cart-button', function(e) {
		
			var cartButton = $(e.currentTarget);
			var menuButton = $('.hamburger-button');

			if(cartButton.hasClass('open')) {

				// close cart
				cartButton.removeClass('open')
				$('aside.cart-container').removeClass('open');
				$('body').removeClass('no-scroll-mobile');

			} else {

				// open cart
				cartButton.addClass('open')
				$('aside.cart-container').addClass('open');
				$('body').addClass('no-scroll-mobile');

				// close menu
				menuButton.removeClass('open');
				$('header nav').removeClass('open');


			}

			e.preventDefault();
			e.stopPropagation();
		});
		
	},
	
	getTemplate: function(path) {
		
		return $.get('/templates/'+path).then(function(src) {
			
			// is the copy already available?
			return Einzlstck.Models.Copy.model.then(function(copy) {
				
				// insert copy into this html string
				src = Einzlstck.Models.Copy.insertCopy(src, copy);
				
				// return a handlebars tempate with copy pre-filled
				return Handlebars.compile(src);
				
			});
			
			
		});
		
	},
	
	getProducts: function() {
		
		var self = this;
		
		// get product models
		var obj = {
			action: 'getProducts'
		};
		
		return this.askServer(obj).done(function(data) {

			if(data && data.status) {
				
				Einzlstck.Models.Products = [];

				$.each(data.result, function(i) {
					Einzlstck.Models.Products[i] = new ProductModel(this);
				});
				
				Einzlstck.Deferreds.products.resolve(data);
				
				
			} else {
				notifyUser(einzl.copy.messages.noConnection, 'error');
				console.log('GET PRODUCTS FAILED');
				console.log(data);
			}
		});
	},
	
	askServer: function(obj) {
		
		return $.ajax({
			type: 'POST',
			dataType:'json',
			url: 'php/ajax.php',
			data: obj
		}).done(function(result) {

		}).fail(function(a,b,c) {
			console.log('AJAX Call failed');
			console.log('tried to send this data:');
			console.log(obj);
			console.log('response data:');
			console.log(a);
			console.log(b);
			console.log(c);
		});
		
	}
	
});



$(document).ready(function() {
	
	
	window.Einzlstck = {
		
		Models: {
			
		},
		Views: {
			
		},
		Deferreds: {
			products: $.Deferred()
		}
		
	};
	
	// let's to this
	Einzlstck.Models.Shop = new Shop();
	Einzlstck.Router = new Router();
    Einzlstck.Models.User = new User();
	Einzlstck.Models.Cart = new Basket();
});