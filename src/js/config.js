var userLang = navigator.language || navigator.userLanguage;

var config = {
     routes: [
         {
             title: {
				 en: 'Home',
				 de: 'Home'
			 },
             id: 'home',
             slug: ['/home', '/', ''],
             hbsPath: '/pages/home'
         },
         {
             title: {
				 en: 'Rings',
				 de: 'Ringe'
			 },
             id: 'rings',
             slug: ['/rings', '/ringe'],
             hbsPath: '/pages/rings'
         },
         {
             title: {
				 en: 'Necklaces',
				 de: 'Ketten'
			 },
             id: 'necklaces',
             slug: ['/necklaces', '/ketten'],
             hbsPath: '/pages/necklaces'
         },
         {
             title: {
				 en: 'Pendants',
				 de: 'Anhänger'
			 },
             id: 'pendants',
             slug: ['/pendants', '/anhaenger'],
             hbsPath: '/pages/pendants'
         },
         {
             title: {
				 en: 'Bracelets',
				 de: 'Armbänder'
			 },
             id: 'bracelets',
             slug: ['/bracelets', '/armbaender', '/armband'],
             hbsPath: '/pages/bracelets'
         },
         {
             title: {
				 en: '<3',
				 de: '<3'
			 },
             id: 'likes',
             slug: ['/likes', '/yourlikes', '/mylikes'],
             hbsPath: '/pages/likes'
         },
         {
             title: {
				 en: 'Checkout',
				 de: 'Kasse'
			 },
             id: 'checkout',
             slug: ['/checkout', '/kasse'],
             hbsPath: '/pages/checkout'
         },
         {
             title: {
				 en: 'Confirmation',
				 de: 'Bestätigung'
			 },
             id: 'confirmation',
             slug: ['/confirmation'],
             hbsPath: '/pages/confirmation'
         },
         {
             title: {
				 en: 'GTC',
				 de: 'AGB'
			 },
             id: 'terms',
             slug: ['/terms', '/agb'],
             hbsPath: '/pages/terms'
         },
         {
             title: {
				 en: 'Imprint',
				 de: 'Impressum'
			 },
             id: 'imprint',
             slug: ['/imprint', '/impressum'],
             hbsPath: '/pages/imprint'
         },
         {
             title: {
				 en: 'Shipping & Retour',
				 de: 'Versand & Rückgabe'
			 },
             id: 'shipping',
             slug: ['/shipping', '/versand'],
             hbsPath: '/pages/shipping'
         },
         {
             title: {
				 en: 'Privacy',
				 de: 'Datenschutz'
			 },
             id: 'privacy',
             slug: ['/privacy', '/datenschutz'],
             hbsPath: '/pages/privacy'
         },
         {
             title: {
				 en: 'The Brand',
				 de: 'Die Marke'
			 },
             id: 'brand',
             slug: ['/brand', '/marke'],
             hbsPath: '/pages/brand'
         },
         {
             title: {
				 en: 'Developer Page',
				 de: 'Entwickler Seite'
			 },
             id: 'f12',
             slug: ['/f12'],
             hbsPath: '/pages/f12'
         },
         {
             title: {
				 en: '404',
				 de: '404'
			 },
             id: '404',
             slug: ['/404'],
             hbsPath: '/pages/404'
         }
     ]
 };
