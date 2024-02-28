"use strict";(self["webpackChunkgene_curator"]=self["webpackChunkgene_curator"]||[]).push([[361],{4157:function(e,t,a){a.d(t,{FH:function(){return u},VG:function(){return r},lO:function(){return i},pK:function(){return l},rj:function(){return c}});var n=a(4287),o=a(6056);const r=async()=>{const e=await(0,n.PL)((0,n.hJ)(o.db,"curations"));let t={};return e.forEach((e=>{if(!e.exists())throw new Error("Curation document not found");t[e.id]={id:e.id,...e.data()}})),t},l=async e=>{const t=await(0,n.ET)((0,n.hJ)(o.db,"curations"),{...e,createdAt:n.EK.fromDate(new Date),updatedAt:n.EK.fromDate(new Date)});return t.id},i=async(e,t)=>{const a=(0,n.JU)(o.db,"curations",e);await(0,n.r7)(a,{...t,updatedAt:n.EK.fromDate(new Date)})},u=async e=>{const t=(0,n.JU)(o.db,"curations",e);await(0,n.oe)(t)},c=async e=>{const t=(0,n.hJ)(o.db,"curations"),a=(0,n.IO)(t,(0,n.ar)("approved_symbol","==",e)),r=(0,n.IO)(t,(0,n.ar)("hgnc_id","==",e)),l=await(0,n.PL)(a);let i=null;if(l.forEach((e=>{e.exists()&&(i={id:e.id,...e.data()})})),!i){const e=await(0,n.PL)(r);e.forEach((e=>{e.exists()&&(i={id:e.id,...e.data()})}))}return i}},9441:function(e,t,a){a.d(t,{QY:function(){return c},ds:function(){return i},el:function(){return l},wp:function(){return r},x6:function(){return u}});var n=a(4287),o=a(6056);const r=async()=>{const e=await(0,n.PL)((0,n.hJ)(o.db,"precurations"));let t={};return e.forEach((e=>{if(!e.exists())throw new Error("Precuration document not found");t[e.id]={id:e.id,...e.data()}})),t},l=async e=>{const t=await(0,n.ET)((0,n.hJ)(o.db,"precurations"),{...e,createdAt:n.EK.fromDate(new Date),updatedAt:n.EK.fromDate(new Date)});return t.id},i=async e=>{const t=(0,n.hJ)(o.db,"precurations"),a=(0,n.IO)(t,(0,n.ar)("approved_symbol","==",e)),r=(0,n.IO)(t,(0,n.ar)("hgnc_id","==",e)),l=await(0,n.PL)(a),i=await(0,n.PL)(r);let u=null;return l.forEach((e=>{e.exists()&&(u={id:e.id,...e.data()})})),u||i.forEach((e=>{e.exists()&&(u={id:e.id,...e.data()})})),u},u=async(e,t)=>{if(!e)throw new Error("Document ID is undefined or invalid");const a=(0,n.JU)(o.db,"precurations",e);await(0,n.r7)(a,{...t,updatedAt:n.EK.fromDate(new Date)})},c=async e=>{const t=(0,n.JU)(o.db,"precurations",e);await(0,n.oe)(t)}},320:function(e,t,a){a.d(t,{Z:function(){return D}});var n=a(3396),o=a(7139);const r={class:"d-flex justify-space-between align-center"};function l(e,t,a,l,i,u){const c=(0,n.up)("v-card-title"),s=(0,n.up)("v-icon"),d=(0,n.up)("v-btn"),p=(0,n.up)("v-tab"),m=(0,n.up)("v-tabs"),w=(0,n.up)("GeneDetailCard"),g=(0,n.up)("PrecurationForm"),f=(0,n.up)("v-window-item"),v=(0,n.up)("CurationForm"),y=(0,n.up)("v-window"),h=(0,n.up)("v-card-text"),b=(0,n.up)("v-spacer"),k=(0,n.up)("v-card-actions"),_=(0,n.up)("v-card"),V=(0,n.up)("v-dialog"),D=(0,n.up)("v-snackbar");return(0,n.wg)(),(0,n.iD)(n.HY,null,[(0,n.Wm)(V,{modelValue:l.isOpen,"onUpdate:modelValue":t[2]||(t[2]=e=>l.isOpen=e),persistent:"","max-width":"1200px"},{default:(0,n.w5)((()=>[(0,n.Wm)(_,null,{default:(0,n.w5)((()=>[(0,n._)("div",r,[(0,n.Wm)(c,null,{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(l.title)+" - "+(0,o.zw)(l.editedItem.approved_symbol)+" - HGNC:"+(0,o.zw)(l.editedItem.hgnc_id),1)])),_:1}),(0,n.Wm)(d,{icon:"",onClick:l.close},{default:(0,n.w5)((()=>[(0,n.Wm)(s,null,{default:(0,n.w5)((()=>[(0,n.Uk)("mdi-close")])),_:1})])),_:1},8,["onClick"])]),(0,n.Wm)(h,null,{default:(0,n.w5)((()=>[(0,n.Wm)(m,{modelValue:l.tab,"onUpdate:modelValue":t[0]||(t[0]=e=>l.tab=e),grow:""},{default:(0,n.w5)((()=>[l.showPreCurationTab?((0,n.wg)(),(0,n.j4)(p,{key:0},{default:(0,n.w5)((()=>[(0,n.Uk)("Pre-Curation")])),_:1})):(0,n.kq)("",!0),l.showCurationTab?((0,n.wg)(),(0,n.j4)(p,{key:1},{default:(0,n.w5)((()=>[(0,n.Uk)("Curation")])),_:1})):(0,n.kq)("",!0)])),_:1},8,["modelValue"]),(0,n.Wm)(y,{modelValue:l.tab,"onUpdate:modelValue":t[1]||(t[1]=e=>l.tab=e),style:{"min-height":"300px"}},{default:(0,n.w5)((()=>[(0,n.Wm)(f,null,{default:(0,n.w5)((()=>[l.showGeneDetailCard?((0,n.wg)(),(0,n.j4)(w,{key:0,id:l.editedItem.hgnc_id,visibilityScope:"curationView",showTitle:!1},null,8,["id"])):(0,n.kq)("",!0),(0,n.Wm)(g,{approvedSymbol:l.editedItem.approved_symbol,hgncId:l.editedItem.hgnc_id,onPrecurationAccepted:l.handlePrecurationAccepted},null,8,["approvedSymbol","hgncId","onPrecurationAccepted"])])),_:1}),l.showCurationTab?((0,n.wg)(),(0,n.j4)(f,{key:0},{default:(0,n.w5)((()=>[(0,n.Wm)(v,{approvedSymbol:l.editedItem.approved_symbol,hgncId:l.editedItem.hgnc_id},null,8,["approvedSymbol","hgncId"])])),_:1})):(0,n.kq)("",!0)])),_:1},8,["modelValue"])])),_:1}),(0,n.Wm)(k,null,{default:(0,n.w5)((()=>[(0,n.Wm)(b),(0,n.Wm)(d,{color:"blue darken-1",text:"",onClick:l.close},{default:(0,n.w5)((()=>[(0,n.Uk)("Cancel")])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1},8,["modelValue"]),(0,n.Wm)(D,{modelValue:l.snackbarVisible,"onUpdate:modelValue":t[3]||(t[3]=e=>l.snackbarVisible=e),color:l.snackbarColor,timeout:6e3},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(l.snackbarMessage),1)])),_:1},8,["modelValue","color"])],64)}var i=a(4870),u=a(5774);function c(e,t,a,r,l,i){const u=(0,n.up)("v-card-title"),c=(0,n.up)("v-col"),s=(0,n.up)("v-switch"),d=(0,n.up)("v-text-field"),p=(0,n.up)("v-select"),m=(0,n.up)("v-row"),w=(0,n.up)("v-btn"),g=(0,n.up)("v-container"),f=(0,n.up)("v-card-text"),v=(0,n.up)("v-card");return(0,n.wg)(),(0,n.j4)(v,{class:"elevation-2"},{default:(0,n.w5)((()=>[(0,n.Wm)(u,null,{default:(0,n.w5)((()=>[(0,n.Uk)("Precuration")])),_:1}),(0,n.Wm)(f,null,{default:(0,n.w5)((()=>[(0,n.Wm)(g,null,{default:(0,n.w5)((()=>[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(i.groupedFields,((e,t)=>((0,n.wg)(),(0,n.j4)(m,{key:t},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{cols:"12"},{default:(0,n.w5)((()=>[(0,n._)("h2",null,(0,o.zw)(t),1)])),_:2},1024),((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(e,((t,a)=>((0,n.wg)(),(0,n.j4)(c,{key:a,cols:12/e.length},{default:(0,n.w5)((()=>["boolean"===t.format&&t.visibility.curationView?((0,n.wg)(),(0,n.j4)(s,{key:0,modelValue:l.precurationData[t.key],"onUpdate:modelValue":e=>l.precurationData[t.key]=e,label:t.label,"false-value":!1,"true-value":!0,color:"switch"===t.style.curationView?t.style.color:"",class:(0,o.C_)({"inactive-switch":!l.precurationData[t.key]&&"switch"===t.style.curationView})},null,8,["modelValue","onUpdate:modelValue","label","color","class"])):t.style&&"text-field"===t.style.curationView&&t.visibility.curationView?((0,n.wg)(),(0,n.j4)(d,{key:1,modelValue:l.precurationData[t.key],"onUpdate:modelValue":e=>l.precurationData[t.key]=e,label:t.label,class:(0,o.C_)("text-field"===t.style.curationView?"custom-text-field":"")},null,8,["modelValue","onUpdate:modelValue","label","class"])):t.style&&"select"===t.style.curationView&&t.visibility.curationView?((0,n.wg)(),(0,n.j4)(p,{key:2,modelValue:l.precurationData[t.key],"onUpdate:modelValue":e=>l.precurationData[t.key]=e,items:t.options,label:t.label},null,8,["modelValue","onUpdate:modelValue","items","label"])):(0,n.kq)("",!0)])),_:2},1032,["cols"])))),128))])),_:2},1024)))),128)),(0,n.Wm)(m,null,{default:(0,n.w5)((()=>[(0,n.Wm)(c,{cols:"12",class:"text-right"},{default:(0,n.w5)((()=>[(0,n.Wm)(w,{color:"primary",onClick:i.submitPrecuration},{default:(0,n.w5)((()=>[(0,n.Uk)("Accept")])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})}a(560);var s=a(862),d=a(9441),p={name:"PrecurationForm",props:{approvedSymbol:String,hgncId:String},data(){return{precurationData:this.initializePrecurationData(),existingPrecurationId:null}},computed:{groupedFields(){const e=this.precurationFields,t={};return e.forEach((e=>{t[e.group.name]||(t[e.group.name]=[]),t[e.group.name].push(e)})),Object.values(t).forEach((e=>{e.sort(((e,t)=>e.group.order-t.group.order))})),t},precurationFields(){let e=Object.entries(s.m).map((([e,t])=>({...t,key:e})));return e}},methods:{initializePrecurationData(){const e={};return Object.keys(s.m).forEach((t=>{e[t]=""})),e},async submitPrecuration(){const e=(new Date).toISOString();if(this.precurationData.updatedAt=e,this.existingPrecurationId)await(0,d.x6)(this.existingPrecurationId,this.precurationData),console.log("Precuration updated:",this.existingPrecurationId);else{this.precurationData.createdAt=e;const t=await(0,d.el)(this.precurationData);console.log("New precuration created with ID:",t)}this.$emit("precuration-accepted",this.precurationData)},displaySwitchValue(e){return e?"Yes":"No"}},async created(){try{const e=await(0,d.ds)(this.approvedSymbol||this.hgncId);e&&(this.existingPrecurationId=e.id,Object.assign(this.precurationData,e))}catch(e){console.error("Error fetching precuration:",e.message)}}},m=a(89);const w=(0,m.Z)(p,[["render",c],["__scopeId","data-v-5ba1ad33"]]);var g=w;function f(e,t,a,r,l,i){const u=(0,n.up)("v-card-title"),c=(0,n.up)("v-col"),s=(0,n.up)("v-text-field"),d=(0,n.up)("v-checkbox"),p=(0,n.up)("v-select"),m=(0,n.up)("v-row"),w=(0,n.up)("v-container"),g=(0,n.up)("v-card-text"),f=(0,n.up)("v-spacer"),v=(0,n.up)("v-btn"),y=(0,n.up)("v-card-actions"),h=(0,n.up)("v-card");return(0,n.wg)(),(0,n.j4)(h,{class:"elevation-2"},{default:(0,n.w5)((()=>[(0,n.Wm)(u,null,{default:(0,n.w5)((()=>[(0,n.Uk)("Curation")])),_:1}),(0,n.Wm)(g,null,{default:(0,n.w5)((()=>[(0,n.Wm)(w,null,{default:(0,n.w5)((()=>[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(i.groupedFields,((e,t)=>((0,n.wg)(),(0,n.j4)(m,{key:t},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{cols:"12"},{default:(0,n.w5)((()=>[(0,n._)("h2",null,(0,o.zw)(t),1)])),_:2},1024),((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(e,((t,a)=>((0,n.wg)(),(0,n.j4)(c,{key:a,cols:12/e.length},{default:(0,n.w5)((()=>["text"===t.format&&t.style&&"text-field"===t.style.curationView?((0,n.wg)(),(0,n.j4)(s,{key:0,modelValue:l.curationData[t.key],"onUpdate:modelValue":e=>l.curationData[t.key]=e,label:t.label,outlined:"",dense:""},null,8,["modelValue","onUpdate:modelValue","label"])):"boolean"===t.format?((0,n.wg)(),(0,n.j4)(d,{key:1,modelValue:l.curationData[t.key],"onUpdate:modelValue":e=>l.curationData[t.key]=e,label:t.label},null,8,["modelValue","onUpdate:modelValue","label"])):"number"===t.format?((0,n.wg)(),(0,n.j4)(s,{key:2,modelValue:l.curationData[t.key],"onUpdate:modelValue":e=>l.curationData[t.key]=e,label:t.label,min:t.min,max:t.max,type:"number",outlined:"",dense:""},null,8,["modelValue","onUpdate:modelValue","label","min","max"])):"array"===t.format&&t.style&&"select"===t.style.curationView?((0,n.wg)(),(0,n.j4)(p,{key:3,modelValue:l.curationData[t.key],"onUpdate:modelValue":e=>l.curationData[t.key]=e,items:t.options,label:t.label,multiple:"",outlined:"",dense:""},null,8,["modelValue","onUpdate:modelValue","items","label"])):"text"===t.format&&t.style&&"select"===t.style.curationView?((0,n.wg)(),(0,n.j4)(p,{key:4,modelValue:l.curationData[t.key],"onUpdate:modelValue":e=>l.curationData[t.key]=e,items:t.options,label:t.label,outlined:"",dense:""},null,8,["modelValue","onUpdate:modelValue","items","label"])):(0,n.kq)("",!0)])),_:2},1032,["cols"])))),128))])),_:2},1024)))),128))])),_:1})])),_:1}),(0,n.Wm)(y,null,{default:(0,n.w5)((()=>[(0,n.Wm)(f),(0,n.Wm)(v,{color:"primary",onClick:i.saveCuration},{default:(0,n.w5)((()=>[(0,n.Uk)("Save")])),_:1},8,["onClick"])])),_:1})])),_:1})}var v=a(9546),y=a(4157),h={name:"CurationForm",props:{approvedSymbol:String,hgncId:String},data(){return{curationData:this.initializeCurationData(),existingCurationId:null}},async created(){if(this.hgncId||this.approvedSymbol)try{const e=await(0,y.rj)(this.hgncId||this.approvedSymbol);e&&(this.existingCurationId=e.id,Object.assign(this.curationData,e))}catch(e){console.error("Error fetching curation:",e.message)}},computed:{groupedFields(){const e=Object.entries(v.U).map((([e,t])=>({...t,key:e}))),t={};return e.forEach((e=>{t[e.group.name]||(t[e.group.name]=[]),t[e.group.name].push(e)})),Object.values(t).forEach((e=>{e.sort(((e,t)=>e.group.order-t.group.order))})),t}},methods:{initializeCurationData(){const e={};return Object.keys(v.U).forEach((t=>{const a=v.U[t];"boolean"===a.format?e[t]=!1:"number"===a.format?e[t]=a.min||0:"array"===a.format&&a.style&&"select"===a.style.curationView?e[t]=[]:"text"===a.format&&a.style&&"select"===a.style.curationView?e[t]=null:e[t]=""})),e},async saveCuration(){try{if(this.existingCurationId)await(0,y.lO)(this.existingCurationId,this.curationData),console.log("Curation updated:",this.existingCurationId);else{const e=await(0,y.pK)(this.curationData);console.log("New curation created with ID:",e)}}catch(e){console.error("Error saving curation:",e.message)}}}};const b=(0,m.Z)(h,[["render",f],["__scopeId","data-v-59a0fb6a"]]);var k=b,_={components:{GeneDetailCard:u.Z,PrecurationForm:g,CurationForm:k},props:{item:{type:Object,required:!0},open:{type:Boolean,required:!0},context:{type:String,default:"gene"}},emits:["close"],setup(e,{emit:t}){const a=(0,i.iH)(e.open),o=(0,i.iH)({...e.item}),r=(0,i.iH)(!0),l=(0,i.iH)(!0),u=(0,i.iH)(!1),c=(0,i.iH)(0),s=(0,i.iH)(!1),p=(0,i.iH)(""),m=(0,i.iH)("success"),w=(e,t="success")=>{p.value=e,m.value=t,s.value=!0};(0,n.m0)((()=>{a.value=e.open,o.value={...e.item}}));const g=()=>{"precuration"===e.context?f():(u.value=!0,c.value=1)},f=()=>t("close"),v=async()=>{try{const e=await(0,d.ds)(o.value.hgnc_id||o.value.approved_symbol);e?(u.value=!0,c.value=1):(u.value=!1,c.value=0)}catch(e){w("Error checking existing curation: "+e.message,"error")}},y=(0,n.Fl)((()=>"curation"===e.context?"Curation":"precuration"===e.context?"Precuration":"Gene Curation"));(0,n.YP)((()=>e.open),(async e=>{e&&await h()}));const h=async()=>{"precuration"===e.context?(r.value=!1,l.value=!0,u.value=!1,c.value=0):"curation"===e.context?(r.value=!1,l.value=!1,await v(),c.value=u.value?1:0):await v()};return(0,n.YP)((()=>e.open),(e=>{e&&h()})),{initializeModal:h,isOpen:a,editedItem:o,close:f,handlePrecurationAccepted:g,showGeneDetailCard:r,showPreCurationTab:l,showCurationTab:u,tab:c,snackbarVisible:s,snackbarMessage:p,snackbarColor:m,showSnackbar:w,title:y}}};const V=(0,m.Z)(_,[["render",l],["__scopeId","data-v-f05fa8b2"]]);var D=V},7385:function(e,t,a){a.d(t,{Z:function(){return p}});var n=a(3396),o=a(7139);const r={key:0},l={key:1};function i(e,t,a,i,u,c){const s=(0,n.up)("v-tooltip"),d=(0,n.up)("router-link"),p=(0,n.up)("v-data-table"),m=(0,n.up)("v-pagination"),w=(0,n.up)("v-container");return(0,n.wg)(),(0,n.j4)(w,null,{default:(0,n.w5)((()=>[(0,n.Wm)(p,{headers:a.headers,items:a.items,"items-per-page":i.itemsPerPage,"onUpdate:itemsPerPage":t[0]||(t[0]=e=>i.itemsPerPage=e),"server-items-length":a.totalItems,loading:a.loading,class:"elevation-1",density:"compact"},(0,n.Nv)({_:2},[(0,n.Ko)(a.headers,(e=>({name:`header.${e.value}`,fn:(0,n.w5)((({header:t})=>[(0,n._)("span",null,(0,o.zw)(e.title),1),e.description?((0,n.wg)(),(0,n.j4)(s,{key:0,header:t,activator:"parent",location:"top"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(e.description),1)])),_:2},1032,["header"])):(0,n.kq)("",!0)]))}))),(0,n.Ko)(a.config.columns,(t=>({name:`item.${t.name}`,fn:(0,n.w5)((({item:a})=>["text"===t.type?((0,n.wg)(),(0,n.iD)("div",r,(0,o.zw)(a[t.name]),1)):"date"===t.type?((0,n.wg)(),(0,n.iD)("div",l,(0,o.zw)(i.formatTimestamp(a[t.name])),1)):"link"===t.type?((0,n.wg)(),(0,n.j4)(d,{key:2,to:t.to(a)},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(a[t.name]),1)])),_:2},1032,["to"])):"slot"===t.type?(0,n.WI)(e.$slots,t.slotName,{key:3,item:a}):(0,n.kq)("",!0)]))})))]),1032,["headers","items","items-per-page","server-items-length","loading"]),(0,n.WI)(e.$slots,"modal"),(0,n.Wm)(m,{modelValue:i.page,"onUpdate:modelValue":t[1]||(t[1]=e=>i.page=e),length:i.totalPages,"onUpdate:page":t[2]||(t[2]=t=>e.$emit("update-page",i.page))},null,8,["modelValue","length"])])),_:3})}var u=a(4870),c={props:{headers:Array,items:Array,config:Object,totalItems:Number,loading:Boolean},setup(e,{emit:t}){const a=(0,u.iH)(1),o=(0,u.iH)(10),r=(0,n.Fl)((()=>Math.ceil(e.totalItems/o.value))),l=e=>{if(!e)return"";const t=new Date(1e3*e.seconds);return t.toLocaleDateString()};return(0,n.YP)(a,(()=>{t("page-changed",a.value)})),(0,n.YP)(o,(()=>{t("items-per-page-changed",o.value)})),{page:a,itemsPerPage:o,totalPages:r,formatTimestamp:l}}},s=a(89);const d=(0,s.Z)(c,[["render",i]]);var p=d},5774:function(e,t,a){a.d(t,{Z:function(){return w}});var n=a(3396),o=a(7139);const r=["title"],l=["innerHTML"];function i(e,t,a,i,u,c){const s=(0,n.up)("v-card-title"),d=(0,n.up)("v-tooltip"),p=(0,n.up)("v-table"),m=(0,n.up)("v-card-text"),w=(0,n.up)("v-card"),g=(0,n.up)("v-alert"),f=(0,n.up)("v-container");return(0,n.wg)(),(0,n.j4)(f,null,{default:(0,n.w5)((()=>[i.gene?((0,n.wg)(),(0,n.j4)(w,{key:0,class:"mx-auto my-4","max-width":"800"},{default:(0,n.w5)((()=>[a.showTitle?((0,n.wg)(),(0,n.j4)(s,{key:0,class:"headline"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(i.gene.approved_symbol),1)])),_:1})):(0,n.kq)("",!0),(0,n.Wm)(m,null,{default:(0,n.w5)((()=>[(0,n.Wm)(p,{dense:""},{default:(0,n.w5)((()=>[(0,n._)("tbody",null,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(i.filteredGeneDetails,((e,t)=>((0,n.wg)(),(0,n.iD)("tr",{key:t},[(0,n._)("td",null,[(0,n._)("strong",null,[(0,n._)("span",{class:"label-hover",title:e.description},(0,o.zw)(e.label),9,r),(0,n.Wm)(d,{activator:"parent",location:"start"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(e.description),1)])),_:2},1024)])]),(0,n._)("td",{innerHTML:e.formattedValue},null,8,l)])))),128))])])),_:1})])),_:1})])),_:1})):((0,n.wg)(),(0,n.j4)(g,{key:1,type:"error"},{default:(0,n.w5)((()=>[(0,n.Uk)(" Gene not found or failed to load. ")])),_:1}))])),_:1})}var u=a(4870),c=a(3191),s=a(3636),d={props:{id:String,visibilityScope:{type:String,default:"standardView"},showTitle:{type:Boolean,default:!0}},setup(e){const t=(0,u.iH)(null);(0,n.bv)((async()=>{e.id&&(t.value=await(0,c.Xu)(e.id).catch((e=>{console.error(e.message)})))}));const a=(0,n.Fl)((()=>t.value?Object.entries(s.Wk).filter((([,t])=>t.visibility[e.visibilityScope])).map((([e,a])=>{const n=t.value[e];return{label:a.label,description:a.description||"",formattedValue:o(n,a)}})):[]));function o(e,t){if(null==e)return"N/A";switch(t.format){case"date":return new Date(1e3*e.seconds).toLocaleDateString();case"number":return parseFloat(e).toFixed(2);case"array":return e.join(", ");case"map":return Object.entries(e).map((([e,t])=>`${e}: ${t}`)).join(", ");case"text":return e;default:return JSON.stringify(e)}}return{gene:t,filteredGeneDetails:a}}},p=a(89);const m=(0,p.Z)(d,[["render",i],["__scopeId","data-v-ea7ae29e"]]);var w=m}}]);
//# sourceMappingURL=361.5cd01164.js.map