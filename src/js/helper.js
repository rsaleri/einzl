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