//HELPER FUNCTIONS

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function removeSlash(site) {
    return site.replace(/\/$/, "");
}

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
}

// Notifications
var t1;
var t2;
function notifyUser(msg, type) {

    var el = $('#notification'),
        span = el.find('.message');

    el.addClass(type).removeClass('hide');
    span.text(msg);

    clearTimeout(t1);
    clearTimeout(t2);

    t1 = window.setTimeout(function() {
        el.addClass('hide');
        t2 = window.setTimeout(function() {
            el.removeClass(type);
            span.text('');
        }, 1000);
    }, 3500);
};
