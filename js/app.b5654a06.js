(function(){"use strict";var e={4547:function(e,t,n){n.d(t,{k:function(){return o}});const o={admin:{canCurate:!0,canViewAllRecords:!0,canEditAllRecords:!0,canAccessAdminPanel:!0,canManageUsers:!0,description:"Admins have full access to all records, user management, and administrative settings."},curator:{canCurate:!0,canViewAllRecords:!0,canEditOwnRecords:!0,canAccessAdminPanel:!1,canManageUsers:!1,description:"Curators can view all records, and curate or edit records they have created."},viewer:{canCurate:!1,canViewAllRecords:!0,canEditOwnRecords:!1,canAccessAdminPanel:!1,canManageUsers:!1,description:"Viewers have read-only access to all records."}}},6056:function(e,t,n){n.d(t,{I:function(){return l},db:function(){return c}});var o=n(7795),r=n(4287),a=n(4690);const i={apiKey:"AIzaSyAlK6flaIujhnq9SUa4a3BCnezxZu583fI",authDomain:"kidney-genetics.firebaseapp.com",projectId:"kidney-genetics",storageBucket:"kidney-genetics.appspot.com",messagingSenderId:"363889916499",appId:"1:363889916499:web:f6e81c45d3c2705b0d64a6",measurementId:"production"},u=(0,o.ZF)(i),c=(0,r.ad)(u),l=(0,a.v0)(u)},1514:function(e,t,n){var o=n(9242),r=n(3396);function a(e,t,n,o,a,i){const u=(0,r.up)("AppBar"),c=(0,r.up)("router-view"),l=(0,r.up)("v-main"),s=(0,r.up)("FooterBar"),d=(0,r.up)("v-app");return(0,r.wg)(),(0,r.j4)(d,null,{default:(0,r.w5)((()=>[(0,r.Wm)(u),(0,r.Wm)(l,null,{default:(0,r.w5)((()=>[(0,r.Wm)(c)])),_:1}),(0,r.Wm)(s)])),_:1})}n(560);var i=n(7139);const u=e=>((0,r.dD)("data-v-270ebb53"),e=e(),(0,r.Cn)(),e),c=u((()=>(0,r._)("br",null,null,-1)));function l(e,t,n,o,a,u){const l=(0,r.up)("v-img"),s=(0,r.up)("v-icon"),d=(0,r.up)("v-toolbar-title"),f=(0,r.up)("v-btn"),m=(0,r.up)("v-list-item-title"),p=(0,r.up)("v-list-item"),g=(0,r.up)("v-list"),h=(0,r.up)("v-menu"),v=(0,r.up)("v-avatar"),b=(0,r.up)("v-app-bar"),w=(0,r.up)("v-snackbar");return(0,r.wg)(),(0,r.iD)(r.HY,null,[(0,r.Wm)(b,{app:"",color:"primary",dark:""},{default:(0,r.w5)((()=>[(0,r.Wm)(l,{src:"logo.png",class:"mr-3 app-logo",contain:"","max-height":"48","max-width":"48",onClick:t[0]||(t[0]=t=>e.$router.push("/"))}),(0,r.Wm)(d,null,{default:(0,r.w5)((()=>[(0,r._)("span",{class:"clickable",onClick:t[1]||(t[1]=t=>e.$router.push("/"))}," Gene Curator "),c,(0,r._)("span",{class:"version-info",onMouseenter:t[2]||(t[2]=e=>o.showCopyIcon=!0),onMouseleave:t[3]||(t[3]=e=>o.showCopyIcon=!1)},[(0,r.Uk)(" Version: "+(0,i.zw)(o.version)+" - Commit: "+(0,i.zw)(o.lastCommitHash)+" ",1),o.showCopyIcon?((0,r.wg)(),(0,r.j4)(s,{key:0,onClick:o.copyCitation},{default:(0,r.w5)((()=>[(0,r.Uk)("mdi-content-copy")])),_:1},8,["onClick"])):(0,r.kq)("",!0)],32)])),_:1}),((0,r.wg)(!0),(0,r.iD)(r.HY,null,(0,r.Ko)(o.menuItems,(e=>((0,r.wg)(),(0,r.iD)(r.HY,{key:e.text},[e.children?((0,r.wg)(),(0,r.j4)(h,{key:0,"offset-y":""},{activator:(0,r.w5)((({props:t})=>[(0,r.Wm)(f,(0,r.dG)({text:""},t),{default:(0,r.w5)((()=>[e.icon?((0,r.wg)(),(0,r.j4)(s,{key:0,left:""},{default:(0,r.w5)((()=>[(0,r.Uk)((0,i.zw)(e.icon),1)])),_:2},1024)):(0,r.kq)("",!0),(0,r.Uk)(" "+(0,i.zw)(e.text),1)])),_:2},1040)])),default:(0,r.w5)((()=>[(0,r.Wm)(g,null,{default:(0,r.w5)((()=>[((0,r.wg)(!0),(0,r.iD)(r.HY,null,(0,r.Ko)(e.children,(e=>((0,r.wg)(),(0,r.j4)(p,{key:e.text,to:e.to},{default:(0,r.w5)((()=>[(0,r.Wm)(m,null,{default:(0,r.w5)((()=>[e.icon?((0,r.wg)(),(0,r.j4)(s,{key:0},{default:(0,r.w5)((()=>[(0,r.Uk)((0,i.zw)(e.icon),1)])),_:2},1024)):(0,r.kq)("",!0),(0,r.Uk)(" "+(0,i.zw)(e.text),1)])),_:2},1024)])),_:2},1032,["to"])))),128))])),_:2},1024)])),_:2},1024)):((0,r.wg)(),(0,r.j4)(f,{key:1,to:e.to,text:""},{default:(0,r.w5)((()=>[e.icon?((0,r.wg)(),(0,r.j4)(s,{key:0,left:""},{default:(0,r.w5)((()=>[(0,r.Uk)((0,i.zw)(e.icon),1)])),_:2},1024)):(0,r.kq)("",!0),(0,r.Uk)(" "+(0,i.zw)(e.text),1)])),_:2},1032,["to"]))],64)))),128)),(0,r.Wm)(f,{icon:"",onClick:o.toggleTheme},{default:(0,r.w5)((()=>[(0,r.Wm)(s,null,{default:(0,r.w5)((()=>[(0,r.Uk)((0,i.zw)(o.darkTheme?"mdi-weather-night":"mdi-white-balance-sunny"),1)])),_:1})])),_:1},8,["onClick"]),o.isLoggedIn?((0,r.wg)(),(0,r.j4)(h,{key:0,"offset-y":""},{activator:(0,r.w5)((({props:e})=>[(0,r.Wm)(f,(0,r.dG)({icon:""},e),{default:(0,r.w5)((()=>[(0,r.Wm)(v,{image:o.userAvatar},null,8,["image"])])),_:2},1040)])),default:(0,r.w5)((()=>[(0,r.Wm)(g,null,{default:(0,r.w5)((()=>[(0,r.Wm)(p,{onClick:o.openUserProfile},{default:(0,r.w5)((()=>[(0,r.Wm)(m,null,{default:(0,r.w5)((()=>[(0,r.Uk)("User Page")])),_:1})])),_:1},8,["onClick"]),(0,r.Wm)(p,{onClick:o.logout},{default:(0,r.w5)((()=>[(0,r.Wm)(m,null,{default:(0,r.w5)((()=>[(0,r.Uk)("Logout")])),_:1})])),_:1},8,["onClick"])])),_:1})])),_:1})):((0,r.wg)(),(0,r.j4)(f,{key:1,icon:"",onClick:o.redirectToLogin},{default:(0,r.w5)((()=>[(0,r.Wm)(s,null,{default:(0,r.w5)((()=>[(0,r.Uk)("mdi-account-circle")])),_:1})])),_:1},8,["onClick"]))])),_:1}),(0,r.Wm)(w,{modelValue:o.snackbarVisible,"onUpdate:modelValue":t[4]||(t[4]=e=>o.snackbarVisible=e),timeout:o.snackbarTimeout,color:o.snackbarColor},{default:(0,r.w5)((()=>[(0,r.Uk)((0,i.zw)(o.snackbarMessage),1)])),_:1},8,["modelValue","timeout","color"])],64)}var s=n(4870),d=n(4690),f=n(2483),m=n(5935),p={i8:"0.2.0"},g=JSON.parse('{"f":"halbritter-lab/gene-curator"}'),h=JSON.parse('{"e":[{"text":"Admin","icon":"mdi-cog","visibility":"loggedIn","requiredRoles":["admin"],"children":[{"text":"Gene Admin","to":"/upload","icon":"mdi-upload","visibility":"loggedIn","requiredRoles":["admin"]},{"text":"User Admin","to":"/useradmin","icon":"mdi-account-supervisor","visibility":"loggedIn","requiredRoles":["admin"]}]},{"text":"Tables","icon":"mdi-table","children":[{"text":"Genes","to":"/genes","icon":"mdi-dna"},{"text":"Pre-Curation","to":"/precurations","icon":"mdi-table-edit"},{"text":"Curation","to":"/curations","icon":"mdi-book-open-page-variant"}]},{"text":"FAQ","icon":"mdi-help-circle","to":"/faq","visibility":"all"}]}'),v=n(5573),b={name:"AppBar",setup(){const e=(0,m.Fg)(),t=(0,s.iH)(e.global.current.value.dark),n=p.i8,o=(0,s.iH)("loading..."),a=(0,s.iH)(!1),i=(0,d.v0)(),u=(0,s.iH)(JSON.parse(localStorage.getItem("user"))),c=(0,s.iH)(null),l=(0,f.tv)(),b=(0,r.Fl)((()=>!!u.value)),w=(0,r.Fl)((()=>u.value?.photoURL||"logo.png")),k=(0,s.iH)(!1),y=(0,s.iH)(""),_=6e3,C=(0,s.iH)("success"),A=(0,s.iH)(!1),j=()=>{const e=`Gene Curator, Version: ${n} - Commit: ${o.value}, an open-source platform designed for the curation and management of genetic information. Code available at https://github.com/halbritter-lab/gene-curator (accessed ${(new Date).toISOString().split("T")[0]}).`;navigator.clipboard.writeText(e).then((()=>{y.value="Citation copied to clipboard!",k.value=!0})).catch((e=>{console.error("Error copying citation:",e),y.value="Error copying citation!",k.value=!0}))},O=()=>{const n=!e.global.current.value.dark;e.global.name.value=n?"dark":"light",localStorage.setItem("darkTheme",n.toString()),t.value=n},x=async()=>{try{const e=g.f,t=await fetch(`https://api.github.com/repos/${e}/commits?per_page=1`);if(!t.ok)throw new Error("Network response was not ok.");const n=await t.json();n.length&&(o.value=n[0].sha.substring(0,7))}catch(e){console.error("Error fetching last commit:",e),a.value=!0,o.value="offline"}},I=()=>{l.push("/user")},S=async()=>{if(u.value)try{const e=await(0,v.CX)(u.value.email);c.value=e&&e.role?e.role:"viewer"}catch(e){console.error("Error fetching user role:",e),c.value="viewer"}else c.value="viewer"};(0,d.Aj)(i,(e=>{u.value=e,S()})),(0,r.m0)((()=>{u.value?S():c.value=null}));const U=()=>{l.push("/login")},q=async()=>{try{await(0,d.w7)(i),u.value=null,localStorage.removeItem("user"),l.push("/"),y.value="Successfully logged out",C.value="success",k.value=!0}catch(e){console.error("Logout error:",e),y.value="Error during logout: "+e.message,C.value="error",k.value=!0}};(0,r.bv)((async()=>{await x();const n=localStorage.getItem("darkTheme");null!==n&&(e.global.name.value="true"===n?"dark":"light",t.value="true"===n)}));const E=(0,r.Fl)((()=>u.value?["admin","curator"]:[])),P=(0,r.Fl)((()=>h.e.filter((e=>!(e.requiredRoles&&!e.requiredRoles.includes(c.value))&&(!("loggedIn"===e.visibility&&!u.value)&&(("loggedOut"!==e.visibility||!u.value)&&(!e.requiredRoles||!e.requiredRoles.some((e=>!E.value.includes(e))))))))));return{darkTheme:t,toggleTheme:O,menuItems:P,userRole:c,version:n,lastCommitHash:o,isLoggedIn:b,userAvatar:w,openUserProfile:I,redirectToLogin:U,logout:q,snackbarVisible:k,snackbarMessage:y,snackbarTimeout:_,snackbarColor:C,copyCitation:j,showCopyIcon:A}}},w=n(89);const k=(0,w.Z)(b,[["render",l],["__scopeId","data-v-270ebb53"]]);var y=k;function _(e,t,n,o,a,u){const c=(0,r.up)("v-icon"),l=(0,r.up)("v-btn"),s=(0,r.up)("v-col"),d=(0,r.up)("v-row"),f=(0,r.up)("v-footer");return(0,r.wg)(),(0,r.j4)(f,{app:"",padless:"",class:"elevation-3"},{default:(0,r.w5)((()=>[(0,r.Wm)(d,{justify:"center","no-gutters":""},{default:(0,r.w5)((()=>[((0,r.wg)(!0),(0,r.iD)(r.HY,null,(0,r.Ko)(o.footerLinks,(e=>((0,r.wg)(),(0,r.j4)(s,{cols:"auto",key:e.text},{default:(0,r.w5)((()=>[(0,r.Wm)(l,{icon:"",href:e.href,target:"_blank",text:""},{default:(0,r.w5)((()=>[(0,r.Wm)(c,null,{default:(0,r.w5)((()=>[(0,r.Uk)((0,i.zw)(e.icon),1)])),_:2},1024)])),_:2},1032,["href"])])),_:2},1024)))),128))])),_:1})])),_:1})}var C=JSON.parse('{"O":[{"icon":"mdi-github","href":"https://github.com/halbritter-lab/gene-curator","text":"GitHub"},{"icon":"mdi-file-document-outline","href":"https://github.com/halbritter-lab/gene-curator/wiki","text":"Documentation"},{"icon":"mdi-certificate","href":"https://github.com/halbritter-lab/gene-curator/blob/master/LICENSE","text":"License"}]}'),A={name:"FooterBar",setup(){const e=(0,s.iH)(C.O);return(0,r.bv)((()=>{})),{footerLinks:e}}};const j=(0,w.Z)(A,[["render",_],["__scopeId","data-v-592fd315"]]);var O=j,x={name:"App",components:{AppBar:y,FooterBar:O}};const I=(0,w.Z)(x,[["render",a]]);var S=I;const U=()=>n.e(65).then(n.bind(n,7065)),q=()=>n.e(539).then(n.bind(n,8539)),E=()=>n.e(262).then(n.bind(n,5262)),P=()=>Promise.all([n.e(191),n.e(160),n.e(603)]).then(n.bind(n,5257)),T=()=>Promise.all([n.e(191),n.e(550)]).then(n.bind(n,4550)),W=()=>Promise.all([n.e(191),n.e(339)]).then(n.bind(n,7339)),R=()=>n.e(489).then(n.bind(n,6489)),N=()=>n.e(227).then(n.bind(n,4227)),H=()=>n.e(432).then(n.bind(n,7432)),L=()=>n.e(24).then(n.bind(n,1024)),z=()=>n.e(733).then(n.bind(n,9733)),D=()=>n.e(331).then(n.bind(n,1331)),V=()=>Promise.all([n.e(191),n.e(160),n.e(449)]).then(n.bind(n,4306)),F=()=>Promise.all([n.e(191),n.e(160),n.e(416)]).then(n.bind(n,9404)),M=[{path:"/",name:"Home",component:U},{path:"/about",name:"About",component:E},{path:"/faq",name:"FAQ",component:q},{path:"/genes",name:"Genes",component:P},{path:"/upload",name:"UploadGenes",component:T,meta:{requiresAuth:!0,requiredRole:["admin"]}},{path:"/gene/:id",name:"GeneDetail",component:W,props:!0},{path:"/login",name:"Login",component:R},{path:"/register",name:"Register",component:N},{path:"/user",name:"UserPage",component:H,meta:{requiresAuth:!0}},{path:"/useradmin",name:"UserAdminView",component:D,meta:{requiresAuth:!0,requiredRole:["admin"]}},{path:"/not-authorized",name:"NotAuthorized",component:L},{path:"/:catchAll(.*)",name:"PageNotFound",component:z},{path:"/precurations",name:"PreCuration",component:V,meta:{requiresAuth:!0,requiredRole:["admin","curator"]}},{path:"/curations",name:"Curation",component:F,meta:{requiresAuth:!0,requiredRole:["admin","curator"]}}],B=(0,f.p7)({history:(0,f.PO)("/gene-curator/"),routes:M});B.beforeEach(((e,t,n)=>{const o=JSON.parse(localStorage.getItem("user")),r=o&&o.uid,a=e.meta.requiredRole;e.meta.requiresAuth&&!r?n({name:"Login"}):!a||o&&a.includes(o.role)?n():n({name:"NotAuthorized"})}));var G=B;function J(e,t,n,o,a,u){const c=(0,r.up)("v-icon"),l=(0,r.up)("v-snackbar");return(0,r.wg)(),(0,r.j4)(l,{modelValue:a.visible,"onUpdate:modelValue":t[0]||(t[0]=e=>a.visible=e),color:n.color,timeout:n.timeout,vertical:""},{default:(0,r.w5)((()=>[(0,r._)("strong",null,(0,i.zw)(n.title),1),(0,r.Uk)(" - "+(0,i.zw)(n.message)+" ",1),a.copyIconVisible?((0,r.wg)(),(0,r.j4)(c,{key:0,right:"",onClick:u.copyMessage},{default:(0,r.w5)((()=>[(0,r.Uk)("mdi-content-copy")])),_:1},8,["onClick"])):(0,r.kq)("",!0)])),_:1},8,["modelValue","color","timeout"])}var K={name:"MessageSnackbar",props:{title:{type:String,default:""},message:{type:String,required:!0},color:{type:String,default:"info"},timeout:{type:Number,default:3e3}},data(){return{visible:!1,copyIconVisible:!0}},methods:{show(){this.visible=!0},hide(){this.visible=!1},copyMessage(){navigator.clipboard.writeText(this.message).then((()=>{console.log("Message copied to clipboard")})).catch((e=>{console.error("Could not copy message: ",e)}))}}};const Z=(0,w.Z)(K,[["render",J],["__scopeId","data-v-2e39c90d"]]);var $=Z,Y=(n(9773),n(8957)),Q=n(4926),X=n(8600);const ee=(0,Y.Rd)({components:Q,directives:X,theme:{defaultTheme:"dark"}});(0,o.ri)(S).use(ee).use(G).component("MessageSnackbar",$).mount("#app")},5573:function(e,t,n){n.d(t,{CX:function(){return l},Nq:function(){return c},Rf:function(){return i},r4:function(){return u}});var o=n(4287),r=n(6056),a=n(4547);const i=async()=>{const e=await(0,o.PL)((0,o.hJ)(r.db,"users"));let t={};return e.forEach((e=>{t[e.id]={id:e.id,...e.data()}})),t},u=async(e,t)=>{const n=e.role||"viewer",i=a.k[n],u=(0,o.JU)(r.db,"users",t);await(0,o.pl)(u,{...e,role:n,permissions:i,createdAt:o.EK.fromDate(new Date),updatedAt:o.EK.fromDate(new Date)})},c=async(e,t)=>{const n=(0,o.JU)(r.db,"users",e);await(0,o.r7)(n,{...t,updatedAt:o.EK.fromDate(new Date)})},l=async e=>{const t=(0,o.hJ)(r.db,"users"),n=(0,o.IO)(t,(0,o.ar)("email","==",e)),a=await(0,o.PL)(n);let i=null;return a.forEach((e=>{e.exists()&&(i={id:e.id,...e.data()})})),i}}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var a=t[o]={exports:{}};return e[o].call(a.exports,a,a.exports,n),a.exports}n.m=e,function(){var e=[];n.O=function(t,o,r,a){if(!o){var i=1/0;for(s=0;s<e.length;s++){o=e[s][0],r=e[s][1],a=e[s][2];for(var u=!0,c=0;c<o.length;c++)(!1&a||i>=a)&&Object.keys(n.O).every((function(e){return n.O[e](o[c])}))?o.splice(c--,1):(u=!1,a<i&&(i=a));if(u){e.splice(s--,1);var l=r();void 0!==l&&(t=l)}}return t}a=a||0;for(var s=e.length;s>0&&e[s-1][2]>a;s--)e[s]=e[s-1];e[s]=[o,r,a]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){var e,t=Object.getPrototypeOf?function(e){return Object.getPrototypeOf(e)}:function(e){return e.__proto__};n.t=function(o,r){if(1&r&&(o=this(o)),8&r)return o;if("object"===typeof o&&o){if(4&r&&o.__esModule)return o;if(16&r&&"function"===typeof o.then)return o}var a=Object.create(null);n.r(a);var i={};e=e||[null,t({}),t([]),t(t)];for(var u=2&r&&o;"object"==typeof u&&!~e.indexOf(u);u=t(u))Object.getOwnPropertyNames(u).forEach((function(e){i[e]=function(){return o[e]}}));return i["default"]=function(){return o},n.d(a,i),a}}(),function(){n.d=function(e,t){for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})}}(),function(){n.f={},n.e=function(e){return Promise.all(Object.keys(n.f).reduce((function(t,o){return n.f[o](e,t),t}),[]))}}(),function(){n.u=function(e){return"js/"+e+"."+{24:"d2909aa1",65:"bd2fbf63",160:"f3d19762",191:"126063c6",227:"8f32a0b4",262:"38d61bff",269:"cdcdea15",297:"b40b4c83",331:"f745fdfa",339:"3fdf64f9",416:"c90b0f5c",432:"1e2b2f8d",449:"ef2c9f4e",489:"b7f37317",539:"f7252a60",550:"efd551f3",603:"c058a43e",617:"0f178688",733:"ee149ee3"}[e]+".js"}}(),function(){n.miniCssF=function(e){return"css/"+e+"."+{24:"0cc406aa",65:"8ce0092e",262:"8ce0092e",339:"19295595",416:"68835915",449:"68835915",489:"7d666e55",539:"8ce0092e",603:"ec99ce33",733:"7648bbfd"}[e]+".css"}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={},t="gene-curator:";n.l=function(o,r,a,i){if(e[o])e[o].push(r);else{var u,c;if(void 0!==a)for(var l=document.getElementsByTagName("script"),s=0;s<l.length;s++){var d=l[s];if(d.getAttribute("src")==o||d.getAttribute("data-webpack")==t+a){u=d;break}}u||(c=!0,u=document.createElement("script"),u.charset="utf-8",u.timeout=120,n.nc&&u.setAttribute("nonce",n.nc),u.setAttribute("data-webpack",t+a),u.src=o),e[o]=[r];var f=function(t,n){u.onerror=u.onload=null,clearTimeout(m);var r=e[o];if(delete e[o],u.parentNode&&u.parentNode.removeChild(u),r&&r.forEach((function(e){return e(n)})),t)return t(n)},m=setTimeout(f.bind(null,void 0,{type:"timeout",target:u}),12e4);u.onerror=f.bind(null,u.onerror),u.onload=f.bind(null,u.onload),c&&document.head.appendChild(u)}}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){n.p="/gene-curator/"}(),function(){if("undefined"!==typeof document){var e=function(e,t,n,o,r){var a=document.createElement("link");a.rel="stylesheet",a.type="text/css";var i=function(n){if(a.onerror=a.onload=null,"load"===n.type)o();else{var i=n&&("load"===n.type?"missing":n.type),u=n&&n.target&&n.target.href||t,c=new Error("Loading CSS chunk "+e+" failed.\n("+u+")");c.code="CSS_CHUNK_LOAD_FAILED",c.type=i,c.request=u,a.parentNode&&a.parentNode.removeChild(a),r(c)}};return a.onerror=a.onload=i,a.href=t,n?n.parentNode.insertBefore(a,n.nextSibling):document.head.appendChild(a),a},t=function(e,t){for(var n=document.getElementsByTagName("link"),o=0;o<n.length;o++){var r=n[o],a=r.getAttribute("data-href")||r.getAttribute("href");if("stylesheet"===r.rel&&(a===e||a===t))return r}var i=document.getElementsByTagName("style");for(o=0;o<i.length;o++){r=i[o],a=r.getAttribute("data-href");if(a===e||a===t)return r}},o=function(o){return new Promise((function(r,a){var i=n.miniCssF(o),u=n.p+i;if(t(i,u))return r();e(o,u,null,r,a)}))},r={143:0};n.f.miniCss=function(e,t){var n={24:1,65:1,262:1,339:1,416:1,449:1,489:1,539:1,603:1,733:1};r[e]?t.push(r[e]):0!==r[e]&&n[e]&&t.push(r[e]=o(e).then((function(){r[e]=0}),(function(t){throw delete r[e],t})))}}}(),function(){var e={143:0};n.f.j=function(t,o){var r=n.o(e,t)?e[t]:void 0;if(0!==r)if(r)o.push(r[2]);else{var a=new Promise((function(n,o){r=e[t]=[n,o]}));o.push(r[2]=a);var i=n.p+n.u(t),u=new Error,c=function(o){if(n.o(e,t)&&(r=e[t],0!==r&&(e[t]=void 0),r)){var a=o&&("load"===o.type?"missing":o.type),i=o&&o.target&&o.target.src;u.message="Loading chunk "+t+" failed.\n("+a+": "+i+")",u.name="ChunkLoadError",u.type=a,u.request=i,r[1](u)}};n.l(i,c,"chunk-"+t,t)}},n.O.j=function(t){return 0===e[t]};var t=function(t,o){var r,a,i=o[0],u=o[1],c=o[2],l=0;if(i.some((function(t){return 0!==e[t]}))){for(r in u)n.o(u,r)&&(n.m[r]=u[r]);if(c)var s=c(n)}for(t&&t(o);l<i.length;l++)a=i[l],n.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return n.O(s)},o=self["webpackChunkgene_curator"]=self["webpackChunkgene_curator"]||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))}();var o=n.O(void 0,[998],(function(){return n(1514)}));o=n.O(o)})();
//# sourceMappingURL=app.b5654a06.js.map