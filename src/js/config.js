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
             slug: ['/necklaces'],
             hbsPath: '/pages/necklaces'
         },
         {
             title: 'Bracelets',
             id: 'bracelets',
             slug: ['/bracelets'],
             hbsPath: '/pages/bracelets'
         },
         {
             title: 'Checkout',
             id: 'checkout',
             slug: ['/checkout'],
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
             slug: ['/imprint'],
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
