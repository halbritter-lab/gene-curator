(function(){"use strict";var e={4547:function(e,t,n){n.d(t,{k:function(){return r}});const r={admin:{canCurate:!0,canViewAllRecords:!0,canEditAllRecords:!0,canAccessAdminPanel:!0,canManageUsers:!0,description:"Admins have full access to all records, user management, and administrative settings."},curator:{canCurate:!0,canViewAllRecords:!0,canEditOwnRecords:!0,canAccessAdminPanel:!1,canManageUsers:!1,description:"Curators can view all records, and curate or edit records they have created."},viewer:{canCurate:!1,canViewAllRecords:!0,canEditOwnRecords:!1,canAccessAdminPanel:!1,canManageUsers:!1,description:"Viewers have read-only access to all records."}}},6056:function(e,t,n){n.d(t,{I:function(){return l},db:function(){return c}});var r=n(7795),o=n(4287),a=n(4690);const i={apiKey:"AIzaSyAlK6flaIujhnq9SUa4a3BCnezxZu583fI",authDomain:"kidney-genetics.firebaseapp.com",projectId:"kidney-genetics",storageBucket:"kidney-genetics.appspot.com",messagingSenderId:"363889916499",appId:"1:363889916499:web:f6e81c45d3c2705b0d64a6",measurementId:"production"},u=(0,r.ZF)(i),c=(0,o.ad)(u),l=(0,a.v0)(u)},7025:function(e,t,n){var r=n(9242),o=n(3396);function a(e,t,n,r,a,i){const u=(0,o.up)("AppBar"),c=(0,o.up)("router-view"),l=(0,o.up)("v-main"),s=(0,o.up)("FooterBar"),d=(0,o.up)("v-app");return(0,o.wg)(),(0,o.j4)(d,null,{default:(0,o.w5)((()=>[(0,o.Wm)(u),(0,o.Wm)(l,null,{default:(0,o.w5)((()=>[(0,o.Wm)(c)])),_:1}),(0,o.Wm)(s)])),_:1})}n(560);var i=n(7139);const u=e=>((0,o.dD)("data-v-270ebb53"),e=e(),(0,o.Cn)(),e),c=u((()=>(0,o._)("br",null,null,-1)));function l(e,t,n,r,a,u){const l=(0,o.up)("v-img"),s=(0,o.up)("v-icon"),d=(0,o.up)("v-toolbar-title"),f=(0,o.up)("v-btn"),m=(0,o.up)("v-list-item-title"),p=(0,o.up)("v-list-item"),g=(0,o.up)("v-list"),h=(0,o.up)("v-menu"),v=(0,o.up)("v-avatar"),b=(0,o.up)("v-app-bar"),w=(0,o.up)("v-snackbar");return(0,o.wg)(),(0,o.iD)(o.HY,null,[(0,o.Wm)(b,{app:"",color:"primary",dark:""},{default:(0,o.w5)((()=>[(0,o.Wm)(l,{src:"logo.png",class:"mr-3 app-logo",contain:"","max-height":"48","max-width":"48",onClick:t[0]||(t[0]=t=>e.$router.push("/"))}),(0,o.Wm)(d,null,{default:(0,o.w5)((()=>[(0,o._)("span",{class:"clickable",onClick:t[1]||(t[1]=t=>e.$router.push("/"))}," Gene Curator "),c,(0,o._)("span",{class:"version-info",onMouseenter:t[2]||(t[2]=e=>r.showCopyIcon=!0),onMouseleave:t[3]||(t[3]=e=>r.showCopyIcon=!1)},[(0,o.Uk)(" Version: "+(0,i.zw)(r.version)+" - Commit: "+(0,i.zw)(r.lastCommitHash)+" ",1),r.showCopyIcon?((0,o.wg)(),(0,o.j4)(s,{key:0,onClick:r.copyCitation},{default:(0,o.w5)((()=>[(0,o.Uk)("mdi-content-copy")])),_:1},8,["onClick"])):(0,o.kq)("",!0)],32)])),_:1}),((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(r.menuItems,(e=>((0,o.wg)(),(0,o.iD)(o.HY,{key:e.text},[e.children?((0,o.wg)(),(0,o.j4)(h,{key:0,"offset-y":""},{activator:(0,o.w5)((({props:t})=>[(0,o.Wm)(f,(0,o.dG)({text:""},t),{default:(0,o.w5)((()=>[e.icon?((0,o.wg)(),(0,o.j4)(s,{key:0,left:""},{default:(0,o.w5)((()=>[(0,o.Uk)((0,i.zw)(e.icon),1)])),_:2},1024)):(0,o.kq)("",!0),(0,o.Uk)(" "+(0,i.zw)(e.text),1)])),_:2},1040)])),default:(0,o.w5)((()=>[(0,o.Wm)(g,null,{default:(0,o.w5)((()=>[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(e.children,(e=>((0,o.wg)(),(0,o.j4)(p,{key:e.text,to:e.to},{default:(0,o.w5)((()=>[(0,o.Wm)(m,null,{default:(0,o.w5)((()=>[e.icon?((0,o.wg)(),(0,o.j4)(s,{key:0},{default:(0,o.w5)((()=>[(0,o.Uk)((0,i.zw)(e.icon),1)])),_:2},1024)):(0,o.kq)("",!0),(0,o.Uk)(" "+(0,i.zw)(e.text),1)])),_:2},1024)])),_:2},1032,["to"])))),128))])),_:2},1024)])),_:2},1024)):((0,o.wg)(),(0,o.j4)(f,{key:1,to:e.to,text:""},{default:(0,o.w5)((()=>[e.icon?((0,o.wg)(),(0,o.j4)(s,{key:0,left:""},{default:(0,o.w5)((()=>[(0,o.Uk)((0,i.zw)(e.icon),1)])),_:2},1024)):(0,o.kq)("",!0),(0,o.Uk)(" "+(0,i.zw)(e.text),1)])),_:2},1032,["to"]))],64)))),128)),(0,o.Wm)(f,{icon:"",onClick:r.toggleTheme},{default:(0,o.w5)((()=>[(0,o.Wm)(s,null,{default:(0,o.w5)((()=>[(0,o.Uk)((0,i.zw)(r.darkTheme?"mdi-weather-night":"mdi-white-balance-sunny"),1)])),_:1})])),_:1},8,["onClick"]),r.isLoggedIn?((0,o.wg)(),(0,o.j4)(h,{key:0,"offset-y":""},{activator:(0,o.w5)((({props:e})=>[(0,o.Wm)(f,(0,o.dG)({icon:""},e),{default:(0,o.w5)((()=>[(0,o.Wm)(v,{image:r.userAvatar},null,8,["image"])])),_:2},1040)])),default:(0,o.w5)((()=>[(0,o.Wm)(g,null,{default:(0,o.w5)((()=>[(0,o.Wm)(p,{onClick:r.openUserProfile},{default:(0,o.w5)((()=>[(0,o.Wm)(m,null,{default:(0,o.w5)((()=>[(0,o.Uk)("User Page")])),_:1})])),_:1},8,["onClick"]),(0,o.Wm)(p,{onClick:r.logout},{default:(0,o.w5)((()=>[(0,o.Wm)(m,null,{default:(0,o.w5)((()=>[(0,o.Uk)("Logout")])),_:1})])),_:1},8,["onClick"])])),_:1})])),_:1})):((0,o.wg)(),(0,o.j4)(f,{key:1,icon:"",onClick:r.redirectToLogin},{default:(0,o.w5)((()=>[(0,o.Wm)(s,null,{default:(0,o.w5)((()=>[(0,o.Uk)("mdi-account-circle")])),_:1})])),_:1},8,["onClick"]))])),_:1}),(0,o.Wm)(w,{modelValue:r.snackbarVisible,"onUpdate:modelValue":t[4]||(t[4]=e=>r.snackbarVisible=e),timeout:r.snackbarTimeout,color:r.snackbarColor},{default:(0,o.w5)((()=>[(0,o.Uk)((0,i.zw)(r.snackbarMessage),1)])),_:1},8,["modelValue","timeout","color"])],64)}var s=n(4870),d=n(4690),f=n(2483),m=n(5935),p={i8:"0.1.0"},g=JSON.parse('{"f":"halbritter-lab/gene-curator"}'),h=JSON.parse('{"e":[{"text":"Admin","icon":"mdi-cog","visibility":"loggedIn","requiredRoles":["admin"],"children":[{"text":"Gene Admin","to":"/upload","icon":"mdi-upload","visibility":"loggedIn","requiredRoles":["admin"]},{"text":"User Admin","to":"/useradmin","icon":"mdi-account-supervisor","visibility":"loggedIn","requiredRoles":["admin"]}]},{"text":"Tables","icon":"mdi-table","children":[{"text":"Genes","to":"/genes","icon":"mdi-dna"},{"text":"Pre-Curation","to":"/precurations","icon":"mdi-table-edit"},{"text":"Curation","to":"/curations","icon":"mdi-book-open-page-variant"}]},{"text":"FAQ","icon":"mdi-help-circle","to":"/faq","visibility":"all"}]}'),v=n(5573),b={name:"AppBar",setup(){const e=(0,m.Fg)(),t=(0,s.iH)(e.global.current.value.dark),n=p.i8,r=(0,s.iH)("loading..."),a=(0,s.iH)(!1),i=(0,d.v0)(),u=(0,s.iH)(JSON.parse(localStorage.getItem("user"))),c=(0,s.iH)(null),l=(0,f.tv)(),b=(0,o.Fl)((()=>!!u.value)),w=(0,o.Fl)((()=>u.value?.photoURL||"logo.png")),k=(0,s.iH)(!1),y=(0,s.iH)(""),C=6e3,_=(0,s.iH)("success"),A=(0,s.iH)(!1),O=()=>{const e=`Gene Curator, Version: ${n} - Commit: ${r.value}, an open-source platform designed for the curation and management of genetic information. Code available at https://github.com/halbritter-lab/gene-curator (accessed ${(new Date).toISOString().split("T")[0]}).`;navigator.clipboard.writeText(e).then((()=>{y.value="Citation copied to clipboard!",k.value=!0})).catch((e=>{console.error("Error copying citation:",e),y.value="Error copying citation!",k.value=!0}))},j=()=>{const n=!e.global.current.value.dark;e.global.name.value=n?"dark":"light",localStorage.setItem("darkTheme",n.toString()),t.value=n},x=async()=>{try{const e=g.f,t=await fetch(`https://api.github.com/repos/${e}/commits?per_page=1`);if(!t.ok)throw new Error("Network response was not ok.");const n=await t.json();n.length&&(r.value=n[0].sha.substring(0,7))}catch(e){console.error("Error fetching last commit:",e),a.value=!0,r.value="offline"}},I=()=>{l.push("/user")},E=async()=>{if(u.value)try{const e=await(0,v.CX)(u.value.email);c.value=e&&e.role?e.role:"viewer"}catch(e){console.error("Error fetching user role:",e),c.value="viewer"}else c.value="viewer"};(0,d.Aj)(i,(e=>{u.value=e,E()})),(0,o.m0)((()=>{u.value?E():c.value=null}));const U=()=>{l.push("/login")},q=async()=>{try{await(0,d.w7)(i),u.value=null,localStorage.removeItem("user"),l.push("/"),y.value="Successfully logged out",_.value="success",k.value=!0}catch(e){console.error("Logout error:",e),y.value="Error during logout: "+e.message,_.value="error",k.value=!0}};(0,o.bv)((async()=>{await x();const n=localStorage.getItem("darkTheme");null!==n&&(e.global.name.value="true"===n?"dark":"light",t.value="true"===n)}));const S=(0,o.Fl)((()=>u.value?["admin","curator"]:[])),P=(0,o.Fl)((()=>h.e.filter((e=>!(e.requiredRoles&&!e.requiredRoles.includes(c.value))&&(!("loggedIn"===e.visibility&&!u.value)&&(("loggedOut"!==e.visibility||!u.value)&&(!e.requiredRoles||!e.requiredRoles.some((e=>!S.value.includes(e))))))))));return{darkTheme:t,toggleTheme:j,menuItems:P,userRole:c,version:n,lastCommitHash:r,isLoggedIn:b,userAvatar:w,openUserProfile:I,redirectToLogin:U,logout:q,snackbarVisible:k,snackbarMessage:y,snackbarTimeout:C,snackbarColor:_,copyCitation:O,showCopyIcon:A}}},w=n(89);const k=(0,w.Z)(b,[["render",l],["__scopeId","data-v-270ebb53"]]);var y=k;function C(e,t,n,r,a,u){const c=(0,o.up)("v-icon"),l=(0,o.up)("v-btn"),s=(0,o.up)("v-col"),d=(0,o.up)("v-row"),f=(0,o.up)("v-footer");return(0,o.wg)(),(0,o.j4)(f,{app:"",padless:"",class:"elevation-3"},{default:(0,o.w5)((()=>[(0,o.Wm)(d,{justify:"center","no-gutters":""},{default:(0,o.w5)((()=>[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(r.footerLinks,(e=>((0,o.wg)(),(0,o.j4)(s,{cols:"auto",key:e.text},{default:(0,o.w5)((()=>[(0,o.Wm)(l,{icon:"",href:e.href,target:"_blank",text:""},{default:(0,o.w5)((()=>[(0,o.Wm)(c,null,{default:(0,o.w5)((()=>[(0,o.Uk)((0,i.zw)(e.icon),1)])),_:2},1024)])),_:2},1032,["href"])])),_:2},1024)))),128))])),_:1})])),_:1})}var _=JSON.parse('{"O":[{"icon":"mdi-github","href":"https://github.com/halbritter-lab/gene-curator","text":"GitHub"},{"icon":"mdi-file-document-outline","href":"https://github.com/halbritter-lab/gene-curator/wiki","text":"Documentation"},{"icon":"mdi-certificate","href":"https://github.com/halbritter-lab/gene-curator/blob/master/LICENSE","text":"License"}]}'),A={name:"FooterBar",setup(){const e=(0,s.iH)(_.O);return(0,o.bv)((()=>{})),{footerLinks:e}}};const O=(0,w.Z)(A,[["render",C],["__scopeId","data-v-592fd315"]]);var j=O,x={name:"App",components:{AppBar:y,FooterBar:j}};const I=(0,w.Z)(x,[["render",a]]);var E=I;const U=()=>n.e(65).then(n.bind(n,7065)),q=()=>n.e(539).then(n.bind(n,8539)),S=()=>n.e(262).then(n.bind(n,5262)),P=()=>Promise.all([n.e(191),n.e(763)]).then(n.bind(n,763)),W=()=>Promise.all([n.e(191),n.e(550)]).then(n.bind(n,4550)),R=()=>Promise.all([n.e(191),n.e(339)]).then(n.bind(n,7339)),T=()=>n.e(680).then(n.bind(n,3680)),N=()=>n.e(686).then(n.bind(n,1686)),H=()=>n.e(432).then(n.bind(n,7432)),L=()=>n.e(24).then(n.bind(n,1024)),D=()=>n.e(733).then(n.bind(n,9733)),z=()=>n.e(331).then(n.bind(n,1331)),F=()=>n.e(334).then(n.bind(n,9334)),V=()=>n.e(896).then(n.bind(n,8896)),B=[{path:"/",name:"Home",component:U},{path:"/about",name:"About",component:S},{path:"/faq",name:"FAQ",component:q},{path:"/genes",name:"Genes",component:P},{path:"/upload",name:"UploadGenes",component:W,meta:{requiresAuth:!0,requiredRole:["admin"]}},{path:"/gene/:id",name:"GeneDetail",component:R,props:!0},{path:"/login",name:"Login",component:T},{path:"/register",name:"Register",component:N},{path:"/user",name:"UserPage",component:H,meta:{requiresAuth:!0}},{path:"/useradmin",name:"UserAdminView",component:z,meta:{requiresAuth:!0,requiredRole:["admin"]}},{path:"/not-authorized",name:"NotAuthorized",component:L},{path:"/:catchAll(.*)",name:"PageNotFound",component:D},{path:"/precurations",name:"PreCuration",component:F,meta:{requiresAuth:!0,requiredRole:["admin","curator"]}},{path:"/curations",name:"Curation",component:V,meta:{requiresAuth:!0,requiredRole:["admin","curator"]}}],M=(0,f.p7)({history:(0,f.PO)("/gene-curator/"),routes:B});M.beforeEach((async(e,t,n)=>{const r=e.matched.some((e=>e.meta.requiresAuth)),o=e.meta.requiredRole,a=JSON.parse(localStorage.getItem("user"));if(r&&!a)n({name:"Login"});else if(r&&o)try{const e=await(0,v.CX)(a.email);e&&o.includes(e.role)?n():n({name:"NotAuthorized"})}catch(i){console.error("Error fetching user role:",i),n({name:"NotAuthorized"})}else n()}));var G=M,J=(n(9773),n(8957)),K=n(4926),$=n(8600);const Y=(0,J.Rd)({components:K,directives:$,theme:{defaultTheme:"dark"}});(0,r.ri)(E).use(Y).use(G).mount("#app")},5573:function(e,t,n){n.d(t,{CX:function(){return l},Nq:function(){return c},Rf:function(){return i},r4:function(){return u}});var r=n(4287),o=n(6056),a=n(4547);const i=async()=>{const e=await(0,r.PL)((0,r.hJ)(o.db,"users"));let t={};return e.forEach((e=>{t[e.id]={id:e.id,...e.data()}})),t},u=async(e,t)=>{const n=e.role||"viewer",i=a.k[n],u=(0,r.JU)(o.db,"users",t);await(0,r.pl)(u,{...e,role:n,permissions:i,createdAt:r.EK.fromDate(new Date),updatedAt:r.EK.fromDate(new Date)})},c=async(e,t)=>{const n=(0,r.JU)(o.db,"users",e);await(0,r.r7)(n,{...t,updatedAt:r.EK.fromDate(new Date)})},l=async e=>{const t=(0,r.hJ)(o.db,"users"),n=(0,r.IO)(t,(0,r.ar)("email","==",e)),a=await(0,r.PL)(n);let i=null;return a.forEach((e=>{e.exists()&&(i={id:e.id,...e.data()})})),i}}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={exports:{}};return e[r].call(a.exports,a,a.exports,n),a.exports}n.m=e,function(){var e=[];n.O=function(t,r,o,a){if(!r){var i=1/0;for(s=0;s<e.length;s++){r=e[s][0],o=e[s][1],a=e[s][2];for(var u=!0,c=0;c<r.length;c++)(!1&a||i>=a)&&Object.keys(n.O).every((function(e){return n.O[e](r[c])}))?r.splice(c--,1):(u=!1,a<i&&(i=a));if(u){e.splice(s--,1);var l=o();void 0!==l&&(t=l)}}return t}a=a||0;for(var s=e.length;s>0&&e[s-1][2]>a;s--)e[s]=e[s-1];e[s]=[r,o,a]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){var e,t=Object.getPrototypeOf?function(e){return Object.getPrototypeOf(e)}:function(e){return e.__proto__};n.t=function(r,o){if(1&o&&(r=this(r)),8&o)return r;if("object"===typeof r&&r){if(4&o&&r.__esModule)return r;if(16&o&&"function"===typeof r.then)return r}var a=Object.create(null);n.r(a);var i={};e=e||[null,t({}),t([]),t(t)];for(var u=2&o&&r;"object"==typeof u&&!~e.indexOf(u);u=t(u))Object.getOwnPropertyNames(u).forEach((function(e){i[e]=function(){return r[e]}}));return i["default"]=function(){return r},n.d(a,i),a}}(),function(){n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}}(),function(){n.f={},n.e=function(e){return Promise.all(Object.keys(n.f).reduce((function(t,r){return n.f[r](e,t),t}),[]))}}(),function(){n.u=function(e){return"js/"+e+"."+{24:"d2909aa1",65:"a33ee874",191:"dd0e13cd",262:"47f41644",269:"cdcdea15",297:"f7df371e",331:"06e5e04c",334:"6e904246",339:"d7d15c18",432:"1e2b2f8d",539:"0067af47",550:"1267d3fc",617:"0f178688",680:"cc142490",686:"0de47ce0",733:"ee149ee3",763:"dc73dc8a",896:"c281be69"}[e]+".js"}}(),function(){n.miniCssF=function(e){return"css/"+e+"."+{24:"0cc406aa",65:"28c73af8",262:"28c73af8",334:"a16e8dce",339:"fe557a19",539:"28c73af8",680:"7d666e55",733:"7648bbfd",763:"6812d9c4",896:"a16e8dce"}[e]+".css"}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={},t="gene-curator:";n.l=function(r,o,a,i){if(e[r])e[r].push(o);else{var u,c;if(void 0!==a)for(var l=document.getElementsByTagName("script"),s=0;s<l.length;s++){var d=l[s];if(d.getAttribute("src")==r||d.getAttribute("data-webpack")==t+a){u=d;break}}u||(c=!0,u=document.createElement("script"),u.charset="utf-8",u.timeout=120,n.nc&&u.setAttribute("nonce",n.nc),u.setAttribute("data-webpack",t+a),u.src=r),e[r]=[o];var f=function(t,n){u.onerror=u.onload=null,clearTimeout(m);var o=e[r];if(delete e[r],u.parentNode&&u.parentNode.removeChild(u),o&&o.forEach((function(e){return e(n)})),t)return t(n)},m=setTimeout(f.bind(null,void 0,{type:"timeout",target:u}),12e4);u.onerror=f.bind(null,u.onerror),u.onload=f.bind(null,u.onload),c&&document.head.appendChild(u)}}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){n.p="/gene-curator/"}(),function(){if("undefined"!==typeof document){var e=function(e,t,n,r,o){var a=document.createElement("link");a.rel="stylesheet",a.type="text/css";var i=function(n){if(a.onerror=a.onload=null,"load"===n.type)r();else{var i=n&&("load"===n.type?"missing":n.type),u=n&&n.target&&n.target.href||t,c=new Error("Loading CSS chunk "+e+" failed.\n("+u+")");c.code="CSS_CHUNK_LOAD_FAILED",c.type=i,c.request=u,a.parentNode&&a.parentNode.removeChild(a),o(c)}};return a.onerror=a.onload=i,a.href=t,n?n.parentNode.insertBefore(a,n.nextSibling):document.head.appendChild(a),a},t=function(e,t){for(var n=document.getElementsByTagName("link"),r=0;r<n.length;r++){var o=n[r],a=o.getAttribute("data-href")||o.getAttribute("href");if("stylesheet"===o.rel&&(a===e||a===t))return o}var i=document.getElementsByTagName("style");for(r=0;r<i.length;r++){o=i[r],a=o.getAttribute("data-href");if(a===e||a===t)return o}},r=function(r){return new Promise((function(o,a){var i=n.miniCssF(r),u=n.p+i;if(t(i,u))return o();e(r,u,null,o,a)}))},o={143:0};n.f.miniCss=function(e,t){var n={24:1,65:1,262:1,334:1,339:1,539:1,680:1,733:1,763:1,896:1};o[e]?t.push(o[e]):0!==o[e]&&n[e]&&t.push(o[e]=r(e).then((function(){o[e]=0}),(function(t){throw delete o[e],t})))}}}(),function(){var e={143:0};n.f.j=function(t,r){var o=n.o(e,t)?e[t]:void 0;if(0!==o)if(o)r.push(o[2]);else{var a=new Promise((function(n,r){o=e[t]=[n,r]}));r.push(o[2]=a);var i=n.p+n.u(t),u=new Error,c=function(r){if(n.o(e,t)&&(o=e[t],0!==o&&(e[t]=void 0),o)){var a=r&&("load"===r.type?"missing":r.type),i=r&&r.target&&r.target.src;u.message="Loading chunk "+t+" failed.\n("+a+": "+i+")",u.name="ChunkLoadError",u.type=a,u.request=i,o[1](u)}};n.l(i,c,"chunk-"+t,t)}},n.O.j=function(t){return 0===e[t]};var t=function(t,r){var o,a,i=r[0],u=r[1],c=r[2],l=0;if(i.some((function(t){return 0!==e[t]}))){for(o in u)n.o(u,o)&&(n.m[o]=u[o]);if(c)var s=c(n)}for(t&&t(r);l<i.length;l++)a=i[l],n.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return n.O(s)},r=self["webpackChunkgene_curator"]=self["webpackChunkgene_curator"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))}();var r=n.O(void 0,[998],(function(){return n(7025)}));r=n.O(r)})();
//# sourceMappingURL=app.4d5a47f4.js.map