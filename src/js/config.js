 var config = {
     lang: 'en',
     routes: [
         {
             title: 'Home',
             id: 'home',
             slug: ['/home', '/', ''],
             hbsPath: '/pages/home'
         },
         {
             title: 'Ringe',
             id: 'rings',
             slug: ['/ringe'],
             hbsPath: '/pages/ringe'
         },
         {
             title: 'Ketten',
             id: 'ketten',
             slug: ['/ketten'],
             hbsPath: '/pages/ketten'
         },
         {
             title: 'Armbänder',
             id: 'bracelets',
             slug: ['/armbaender'],
             hbsPath: '/pages/armbaender'
         },
         {
             title: 'Impressum',
             id: 'imprint',
             slug: ['/impressum'],
             hbsPath: '/pages/impressum'
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
     ],
     messages: {
        welcome: [
            'Hi du :-)',
            'Willkommen bei Einzelstück',
            'Hey, schön dich zu sehen :-)'
        ]
    }
 };