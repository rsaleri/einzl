//HELPER FUNCTIONS

function validateForm(form) {
	
	
	// check that all required fields are filled out
    $(form).find('[required]').each(function() {
        
        var input = $(this);
        
        if(input.val().length === 0) {
            
            input.closest('div').addClass('error');
            input.one('focus', function() {
                input.closest('div').removeClass('error');
            });
            
        }
    });
    
    if($(form).find('.error').length > 0) {
        notifyUser(Einzlstck.Models.Copy.data.messages.form_empty_input, 'error');
        return false;
    }
    
    // check email validity
    var inputEmail = $(form).find('.email input');
    if(!inputEmail.get(0).checkValidity()) {
        
        inputEmail.closest('div').addClass('error');
        inputEmail.one('focus', function() {
            inputEmail.closest('div').removeClass('error');
        });
        
        notifyUser(Einzlstck.Models.Copy.data.messages.form_email_invalid, 'error');
        return false;
        
    }
    
    // check HTML5 validity
    if(!form.checkValidity()) {
        return false;
    }
    
    return true;
	
	
};

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);
    });
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

function removeSlash(site) {
    return site.replace(/\/$/, "");
};

function goToByScroll(obj){
    $('html,body').animate({scrollTop: obj.offset().top - 65},'slow');
}

function isLocalStorageNameSupported() {
	var testKey = 'test', storage = window.sessionStorage;
	try {
	    storage.setItem(testKey, '1');
	    storage.removeItem(testKey);
	    return true;
	} catch (error) {
		return false;
	}
};

function getUrlParams() {
    var url = location.search.substring(1);
    var params = url?JSON.parse('{"' + url.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
    function(key, value) { return key===""?value:decodeURIComponent(value); }):{};
    
    return params;
};

// Notifications
var t1;
var t2;
function notifyUser(msg, type) {

    var el = $('#notification'),
        span = el.find('.message');

    el.removeClass('success info error').addClass(type).removeClass('hide');
    span.text(msg);

    clearTimeout(t1);
    clearTimeout(t2);

    t1 = window.setTimeout(function() {
        el.addClass('hide');
        t2 = window.setTimeout(function() {
            el.removeClass(type);
            span.text('');
        }, 1000);
    }, 4500);
};


// temporarily adds a class to an element and removes it after a timeout
jQuery.fn.addTempClass = function(c, t) {
    var o = $(this[0]); // It's your element
    
    o.addClass(c);
    window.setTimeout(function() {
        o.removeClass(c);
    }, t);
};