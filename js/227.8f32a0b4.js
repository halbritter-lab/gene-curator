"use strict";(self["webpackChunkgene_curator"]=self["webpackChunkgene_curator"]||[]).push([[227],{6160:function(e,a,t){var r=t(6056),s=t(4690),i=t(5573);const l={signInWithGoogle:async()=>{try{const e=new s.hJ,a=await(0,s.rh)(r.I,e);await n(a.user);const t=await(0,i.CX)(a.user.email);return t}catch(e){throw console.error(e),e}},registerWithEmail:async(e,a)=>{try{const t=await(0,s.Xb)(r.I,e,a);await n(t.user);const l=await(0,i.CX)(t.user.email);return l}catch(t){throw console.error(t),t}},loginWithEmail:async(e,a)=>{try{const t=await(0,s.e5)(r.I,e,a),l=await(0,i.CX)(t.user.email);return l}catch(t){throw console.error(t),t}},signOut:async()=>{try{await(0,s.w7)(r.I)}catch(e){throw console.error(e),e}}};async function n(e){const a=await(0,i.CX)(e.email);if(!a){const a=await(0,i.Rf)(),t=0===Object.keys(a).length,r=t?"admin":"viewer";await(0,i.r4)({uid:e.uid,email:e.email,role:r,createdAt:new Date,updatedAt:new Date},e.uid)}}a.Z=l},1086:function(e,a,t){t.d(a,{Z:function(){return c}});var r=t(3396),s=t(7139);const i={style:{"margin-left":"20px","margin-bottom":"0"}};function l(e,a,t,l,n,o){const u=(0,r.up)("v-progress-circular"),c=(0,r.up)("v-card"),d=(0,r.up)("v-dialog");return(0,r.wg)(),(0,r.j4)(d,{width:"200",value:t.value,onInput:a[0]||(a[0]=a=>e.$emit("value",!1)),persistent:""},{default:(0,r.w5)((()=>[(0,r.Wm)(c,{style:{padding:"20px","text-align":"left",display:"flex","flex-direction":"row","align-items":"center"}},{default:(0,r.w5)((()=>[(0,r.Wm)(u,{indeterminate:"",color:"primary"}),(0,r._)("p",i,(0,s.zw)(t.message),1)])),_:1})])),_:1},8,["value"])}var n={name:"LoadingDialog",model:{prop:"value",event:"value"},props:{value:{type:Boolean,default:!1},message:{type:String,default:""}}},o=t(89);const u=(0,o.Z)(n,[["render",l]]);var c=u},4227:function(e,a,t){t.r(a),t.d(a,{default:function(){return d}});var r=t(3396),s=t(9242);function i(e,a,t,i,l,n){const o=(0,r.up)("v-card-title"),u=(0,r.up)("v-text-field"),c=(0,r.up)("v-btn"),d=(0,r.up)("v-form"),m=(0,r.up)("v-card-text"),g=(0,r.up)("v-card"),w=(0,r.up)("loading-dialog"),p=(0,r.up)("v-container"),h=(0,r.up)("MessageSnackbar");return(0,r.wg)(),(0,r.iD)(r.HY,null,[(0,r.Wm)(p,{class:"fill-height d-flex align-center justify-center"},{default:(0,r.w5)((()=>[(0,r.Wm)(g,{class:"pa-5",style:{width:"600px"}},{default:(0,r.w5)((()=>[(0,r.Wm)(o,{class:"text-center text-h5 mb-4"},{default:(0,r.w5)((()=>[(0,r.Uk)("Register")])),_:1}),(0,r.Wm)(m,null,{default:(0,r.w5)((()=>[(0,r.Wm)(d,{onSubmit:(0,s.iM)(n.register,["prevent"]),ref:"registerForm"},{default:(0,r.w5)((()=>[(0,r.Wm)(u,{color:"primary",label:"Email",modelValue:l.email,"onUpdate:modelValue":a[0]||(a[0]=e=>l.email=e),type:"email",rules:[e=>!!e||"Email is required",e=>/.+@.+/.test(e)||"Email must be valid"],variant:"outlined",class:"mb-2"},null,8,["modelValue","rules"]),(0,r.Wm)(u,{color:"primary",label:"Password",modelValue:l.password,"onUpdate:modelValue":a[1]||(a[1]=e=>l.password=e),type:"password",rules:[e=>!!e||"Password is required",e=>!!e&&e.length>=6||"Password must be at least 6 characters"],variant:"outlined"},null,8,["modelValue","rules"]),(0,r.Wm)(c,{type:"submit",color:"primary",class:"mt-4"},{default:(0,r.w5)((()=>[(0,r.Uk)("Register")])),_:1})])),_:1},8,["onSubmit"])])),_:1})])),_:1}),(0,r.Wm)(w,{modelValue:l.loading,"onUpdate:modelValue":a[2]||(a[2]=e=>l.loading=e),message:"Please wait..."},null,8,["modelValue"])])),_:1}),(0,r.Wm)(h,{modelValue:l.snackbarVisible,"onUpdate:modelValue":a[3]||(a[3]=e=>l.snackbarVisible=e),title:l.snackbarTitle,message:l.snackbarMessage,color:l.snackbarColor},null,8,["modelValue","title","message","color"])],64)}t(560);var l=t(6160),n=t(1086),o={name:"RegisterUser",components:{LoadingDialog:n.Z},data(){return{error:!1,errorVal:{},loading:!1,email:"",password:"",snackbarVisible:!1,snackbarMessage:"",snackbarTitle:"",snackbarColor:""}},methods:{showSnackbar(e,a,t){this.snackbarTitle=e,this.snackbarMessage=a,this.snackbarColor=t,this.snackbarVisible=!0},async register(){const{valid:e}=await this.$refs.registerForm.validate();if(e)try{this.loading=!0;const e=await l.Z.registerWithEmail(this.email,this.password);console.log(e),this.loading=!1,this.showSnackbar("Success","Registration successful! Redirecting...","success"),setTimeout((()=>{this.$router.push("/login")}),3e3)}catch(a){this.loading=!1,this.showSnackbar("Error",a.message||"There was an error registering your account","error")}}}},u=t(89);const c=(0,u.Z)(o,[["render",i]]);var d=c}}]);
//# sourceMappingURL=227.8f32a0b4.js.map