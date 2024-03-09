"use strict";(self["webpackChunkgene_curator"]=self["webpackChunkgene_curator"]||[]).push([[489],{6160:function(e,a,t){var r=t(6056),i=t(4690),s=t(5573);const o={signInWithGoogle:async()=>{try{const e=new i.hJ,a=await(0,i.rh)(r.I,e);await l(a.user);const t=await(0,s.CX)(a.user.email);return t}catch(e){throw console.error(e),e}},registerWithEmail:async(e,a)=>{try{const t=await(0,i.Xb)(r.I,e,a);await l(t.user);const o=await(0,s.CX)(t.user.email);return o}catch(t){throw console.error(t),t}},loginWithEmail:async(e,a)=>{try{const t=await(0,i.e5)(r.I,e,a),o=await(0,s.CX)(t.user.email);return o}catch(t){throw console.error(t),t}},signOut:async()=>{try{await(0,i.w7)(r.I)}catch(e){throw console.error(e),e}}};async function l(e){const a=await(0,s.CX)(e.email);if(!a){const a=await(0,s.Rf)(),t=0===Object.keys(a).length,r=t?"admin":"viewer";await(0,s.r4)({uid:e.uid,email:e.email,role:r,createdAt:new Date,updatedAt:new Date},e.uid)}}a.Z=o},1086:function(e,a,t){t.d(a,{Z:function(){return u}});var r=t(3396),i=t(7139);const s={style:{"margin-left":"20px","margin-bottom":"0"}};function o(e,a,t,o,l,n){const c=(0,r.up)("v-progress-circular"),u=(0,r.up)("v-card"),d=(0,r.up)("v-dialog");return(0,r.wg)(),(0,r.j4)(d,{width:"200",value:t.value,onInput:a[0]||(a[0]=a=>e.$emit("value",!1)),persistent:""},{default:(0,r.w5)((()=>[(0,r.Wm)(u,{style:{padding:"20px","text-align":"left",display:"flex","flex-direction":"row","align-items":"center"}},{default:(0,r.w5)((()=>[(0,r.Wm)(c,{indeterminate:"",color:"primary"}),(0,r._)("p",s,(0,i.zw)(t.message),1)])),_:1})])),_:1},8,["value"])}var l={name:"LoadingDialog",model:{prop:"value",event:"value"},props:{value:{type:Boolean,default:!1},message:{type:String,default:""}}},n=t(89);const c=(0,n.Z)(l,[["render",o]]);var u=c},6489:function(e,a,t){t.r(a),t.d(a,{default:function(){return h}});var r=t(3396),i=t(9242);const s={class:"d-flex justify-space-between align-center mt-2"},o=(0,r._)("div",{class:"login-divider"},"OR",-1);function l(e,a,t,l,n,c){const u=(0,r.up)("v-card-title"),d=(0,r.up)("v-text-field"),g=(0,r.up)("v-btn"),m=(0,r.up)("v-form"),h=(0,r.up)("v-card-text"),w=(0,r.up)("v-card"),p=(0,r.up)("loading-dialog"),v=(0,r.up)("MessageSnackbar"),f=(0,r.up)("v-container");return(0,r.wg)(),(0,r.j4)(f,{class:"fill-height d-flex align-center justify-center"},{default:(0,r.w5)((()=>[(0,r.Wm)(w,{class:"pa-5",style:{width:"600px"}},{default:(0,r.w5)((()=>[(0,r.Wm)(u,{class:"text-center text-h5 mb-4"},{default:(0,r.w5)((()=>[(0,r.Uk)("Login")])),_:1}),(0,r.Wm)(h,null,{default:(0,r.w5)((()=>[(0,r.Wm)(m,{ref:"loginForm",onSubmit:(0,i.iM)(c.loginWithEmail,["prevent"])},{default:(0,r.w5)((()=>[(0,r.Wm)(d,{color:"primary",label:"Email",modelValue:n.email,"onUpdate:modelValue":a[0]||(a[0]=e=>n.email=e),type:"email",rules:[e=>!!e||"Email is required",e=>/.+@.+/.test(e)||"Email must be valid"],variant:"outlined",class:"mb-2"},null,8,["modelValue","rules"]),(0,r.Wm)(d,{color:"primary",label:"Password",modelValue:n.password,"onUpdate:modelValue":a[1]||(a[1]=e=>n.password=e),type:"password",rules:[e=>!!e&&e.length>=6||"Password must be at least 6 characters"],variant:"outlined"},null,8,["modelValue","rules"]),(0,r._)("div",s,[(0,r.Wm)(g,{type:"submit",color:"primary"},{default:(0,r.w5)((()=>[(0,r.Uk)("Login")])),_:1}),(0,r.Wm)(g,{onClick:c.navigateToRegister,variant:"text",class:"text-decoration-underlined"},{default:(0,r.w5)((()=>[(0,r.Uk)(" Don't have an account? Register ")])),_:1},8,["onClick"])]),o,(0,r.Wm)(g,{onClick:c.signInWithGoogle,color:"primary"},{default:(0,r.w5)((()=>[(0,r.Uk)(" Login with Google")])),_:1},8,["onClick"])])),_:1},8,["onSubmit"])])),_:1})])),_:1}),(0,r.Wm)(p,{modelValue:n.loading,"onUpdate:modelValue":a[2]||(a[2]=e=>n.loading=e),message:"Please wait..."},null,8,["modelValue"]),(0,r.Wm)(v,{modelValue:n.snackbarVisible,"onUpdate:modelValue":a[3]||(a[3]=e=>n.snackbarVisible=e),title:n.snackbarTitle,message:n.snackbarMessage,color:n.snackbarColor},null,8,["modelValue","title","message","color"])])),_:1})}t(560);var n=t(6160),c=t(2483),u=t(1086),d={name:"LoginUser",components:{LoadingDialog:u.Z},data(){return{loading:!1,email:"",password:"",snackbarVisible:!1,snackbarMessage:"",snackbarTitle:"",snackbarColor:""}},setup(){const e=(0,c.tv)();return{router:e}},methods:{showSnackbar(e,a,t){this.snackbarTitle=e,this.snackbarMessage=a,this.snackbarColor=t,this.snackbarVisible=!0},async loginWithEmail(){const{valid:e}=await this.$refs.loginForm.validate();if(e)try{this.loading=!0;const e=await n.Z.loginWithEmail(this.email,this.password);this.saveUserToLocalStorage(e),this.router.push("/"),this.showSnackbar("Success","Logged in successfully","success"),this.loading=!1}catch(a){this.loading=!1,this.showSnackbar("Error","There was an error logging you in. Please try again.","error")}},async signInWithGoogle(){try{const e=await n.Z.signInWithGoogle();this.saveUserToLocalStorage(e),this.router.push("/"),this.showSnackbar("Success","Logged in with Google successfully","success")}catch(e){this.showSnackbar("Error","There was an error logging you in with Google. Please try again.","error")}},navigateToRegister(){this.router.push("/register")},saveUserToLocalStorage(e){e&&(localStorage.setItem("user",JSON.stringify({email:e.email,displayName:e.displayName||e.email,uid:e.uid,role:e.role||"viewer",permissions:e.permissions})),localStorage.setItem("isLoggedIn","true"))}}},g=t(89);const m=(0,g.Z)(d,[["render",l]]);var h=m}}]);
//# sourceMappingURL=489.b7f37317.js.map