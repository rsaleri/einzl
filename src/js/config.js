var userLang = navigator.language || navigator.userLanguage;

var config = {
     routes: [
         {
             title: 'Home',
             id: 'home',
             slug: ['/home', '/', ''],
             hbsPath: '/pages/home'
         },
         {
             title: 'Rings',
             id: 'rings',
             slug: ['/rings', '/ringe'],
             hbsPath: '/pages/rings'
         },
         {
             title: 'Necklaces',
             id: 'necklaces',
             slug: ['/necklaces', '/ketten'],
             hbsPath: '/pages/necklaces'
         },
         {
             title: 'Pendants',
             id: 'pendants',
             slug: ['/pendants', '/anhaenger'],
             hbsPath: '/pages/pendants'
         },
         {
             title: 'Bracelets',
             id: 'bracelets',
             slug: ['/bracelets', '/armbaender', '/armband'],
             hbsPath: '/pages/bracelets'
         },
         {
             title: '<3',
             id: 'likes',
             slug: ['/likes', '/yourlikes', '/mylikes'],
             hbsPath: '/pages/likes'
         },
         {
             title: 'Checkout',
             id: 'checkout',
             slug: ['/checkout', '/kasse'],
             hbsPath: '/pages/checkout'
         },
         {
             title: 'Confirmation',
             id: 'confirmation',
             slug: ['/confirmation'],
             hbsPath: '/pages/confirmation'
         },
         {
             title: 'Imprint',
             id: 'imprint',
             slug: ['/imprint', '/impressum'],
             hbsPath: '/pages/imprint'
         },
         {
             title: 'Developer Page',
             id: 'f12',
             slug: ['/f12'],
             hbsPath: '/pages/f12'
         },
         {
             title: '404',
             id: '404',
             slug: ['/404'],
             hbsPath: '/pages/404'
         }
     ]
 };
