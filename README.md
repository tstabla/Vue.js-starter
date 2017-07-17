# [Vue.js Starter](https://tstabla.github.io/Vue.js-starter/)

> Minimalist starter for Vue 2 with Vue-router and Babel, which uses static templates by http request.

[SEE DEMO](https://tstabla.github.io/Vue.js-starter/)

Sometimes maybe you need use some PHP scripts, then just use files with .php extension and also change line *8* in */app/app-router.js* or remove it.

Switch to branch *`php`* for example.

## How to use

Install
```bash
npm install
```


Run dev server
```bash 
npm run dev:html # html files
# or
npm run dev:php # php files
``` 
You can also set your own HOST and PORT to run dev server.
```bash 
npm run dev:html --host=127.0.0.1 --port=8080
```

Build static assets and run preview
```bash 
npm run view:html # html files
# or
npm run view:php # php files
```

Build static prod assets
```bash 
npm run prod
```

Remove static assets
```bash 
npm run clean
```

**Tested on macOS*
