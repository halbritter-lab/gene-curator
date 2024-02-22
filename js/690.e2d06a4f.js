"use strict";(self["webpackChunkgene_curator"]=self["webpackChunkgene_curator"]||[]).push([[690],{4157:function(e,t,a){a.d(t,{FH:function(){return u},VG:function(){return l},lO:function(){return r},pK:function(){return i},rj:function(){return c}});var n=a(4287),o=a(6056);const l=async()=>{const e=await(0,n.PL)((0,n.hJ)(o.db,"curations"));let t={};return e.forEach((e=>{if(!e.exists())throw new Error("Curation document not found");t[e.id]={id:e.id,...e.data()}})),t},i=async e=>{const t=await(0,n.ET)((0,n.hJ)(o.db,"curations"),{...e,createdAt:n.EK.fromDate(new Date),updatedAt:n.EK.fromDate(new Date)});return t.id},r=async(e,t)=>{const a=(0,n.JU)(o.db,"curations",e);await(0,n.r7)(a,{...t,updatedAt:n.EK.fromDate(new Date)})},u=async e=>{const t=(0,n.JU)(o.db,"curations",e);await(0,n.oe)(t)},c=async e=>{const t=(0,n.hJ)(o.db,"curations"),a=(0,n.IO)(t,(0,n.ar)("approved_symbol","==",e)),l=(0,n.IO)(t,(0,n.ar)("hgnc_id","==",e)),i=await(0,n.PL)(a);let r=null;if(i.forEach((e=>{e.exists()&&(r={id:e.id,...e.data()})})),!r){const e=await(0,n.PL)(l);e.forEach((e=>{e.exists()&&(r={id:e.id,...e.data()})}))}return r}},9441:function(e,t,a){a.d(t,{QY:function(){return c},ds:function(){return r},el:function(){return i},wp:function(){return l},x6:function(){return u}});var n=a(4287),o=a(6056);const l=async()=>{const e=await(0,n.PL)((0,n.hJ)(o.db,"precurations"));let t={};return e.forEach((e=>{if(!e.exists())throw new Error("Precuration document not found");t[e.id]={id:e.id,...e.data()}})),t},i=async e=>{const t=await(0,n.ET)((0,n.hJ)(o.db,"precurations"),{...e,createdAt:n.EK.fromDate(new Date),updatedAt:n.EK.fromDate(new Date)});return t.id},r=async e=>{const t=(0,n.hJ)(o.db,"precurations"),a=(0,n.IO)(t,(0,n.ar)("approved_symbol","==",e)),l=(0,n.IO)(t,(0,n.ar)("hgnc_id","==",e)),i=await(0,n.PL)(a),r=await(0,n.PL)(l);let u=null;return i.forEach((e=>{e.exists()&&(u={id:e.id,...e.data()})})),u||r.forEach((e=>{e.exists()&&(u={id:e.id,...e.data()})})),u},u=async(e,t)=>{if(!e)throw new Error("Document ID is undefined or invalid");const a=(0,n.JU)(o.db,"precurations",e);await(0,n.r7)(a,{...t,updatedAt:n.EK.fromDate(new Date)})},c=async e=>{const t=(0,n.JU)(o.db,"precurations",e);await(0,n.oe)(t)}},3467:function(e,t,a){a.d(t,{Z:function(){return C}});var n=a(3396),o=a(7139);const l={class:"d-flex justify-space-between align-center"};function i(e,t,a,i,r,u){const c=(0,n.up)("v-card-title"),d=(0,n.up)("v-icon"),s=(0,n.up)("v-btn"),m=(0,n.up)("v-tab"),p=(0,n.up)("v-tabs"),w=(0,n.up)("GeneDetailCard"),f=(0,n.up)("PrecurationForm"),v=(0,n.up)("v-window-item"),h=(0,n.up)("CurationForm"),g=(0,n.up)("v-window"),y=(0,n.up)("v-card-text"),b=(0,n.up)("v-spacer"),_=(0,n.up)("v-card-actions"),D=(0,n.up)("v-card"),W=(0,n.up)("v-dialog"),V=(0,n.up)("v-snackbar");return(0,n.wg)(),(0,n.iD)(n.HY,null,[(0,n.Wm)(W,{modelValue:i.isOpen,"onUpdate:modelValue":t[2]||(t[2]=e=>i.isOpen=e),persistent:"","max-width":"1200px"},{default:(0,n.w5)((()=>[(0,n.Wm)(D,null,{default:(0,n.w5)((()=>[(0,n._)("div",l,[(0,n.Wm)(c,null,{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(i.title)+" - "+(0,o.zw)(i.editedItem.approved_symbol)+" - HGNC:"+(0,o.zw)(i.editedItem.hgnc_id),1)])),_:1}),(0,n.Wm)(s,{icon:"",onClick:i.close},{default:(0,n.w5)((()=>[(0,n.Wm)(d,null,{default:(0,n.w5)((()=>[(0,n.Uk)("mdi-close")])),_:1})])),_:1},8,["onClick"])]),(0,n.Wm)(y,null,{default:(0,n.w5)((()=>[(0,n.Wm)(p,{modelValue:i.tab,"onUpdate:modelValue":t[0]||(t[0]=e=>i.tab=e),grow:""},{default:(0,n.w5)((()=>[i.showPreCurationTab?((0,n.wg)(),(0,n.j4)(m,{key:0},{default:(0,n.w5)((()=>[(0,n.Uk)("Pre-Curation")])),_:1})):(0,n.kq)("",!0),i.showCurationTab?((0,n.wg)(),(0,n.j4)(m,{key:1},{default:(0,n.w5)((()=>[(0,n.Uk)("Curation")])),_:1})):(0,n.kq)("",!0)])),_:1},8,["modelValue"]),(0,n.Wm)(g,{modelValue:i.tab,"onUpdate:modelValue":t[1]||(t[1]=e=>i.tab=e),style:{"min-height":"300px"}},{default:(0,n.w5)((()=>[(0,n.Wm)(v,null,{default:(0,n.w5)((()=>[i.showGeneDetailCard?((0,n.wg)(),(0,n.j4)(w,{key:0,id:i.editedItem.hgnc_id,visibilityScope:"curationView",showTitle:!1},null,8,["id"])):(0,n.kq)("",!0),(0,n.Wm)(f,{approvedSymbol:i.editedItem.approved_symbol,hgncId:i.editedItem.hgnc_id,onPrecurationAccepted:i.handlePrecurationAccepted},null,8,["approvedSymbol","hgncId","onPrecurationAccepted"])])),_:1}),i.showCurationTab?((0,n.wg)(),(0,n.j4)(v,{key:0},{default:(0,n.w5)((()=>[(0,n.Wm)(h,{approvedSymbol:i.editedItem.approved_symbol,hgncId:i.editedItem.hgnc_id},null,8,["approvedSymbol","hgncId"])])),_:1})):(0,n.kq)("",!0)])),_:1},8,["modelValue"])])),_:1}),(0,n.Wm)(_,null,{default:(0,n.w5)((()=>[(0,n.Wm)(b),(0,n.Wm)(s,{color:"blue darken-1",text:"",onClick:i.close},{default:(0,n.w5)((()=>[(0,n.Uk)("Cancel")])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1},8,["modelValue"]),(0,n.Wm)(V,{modelValue:i.snackbarVisible,"onUpdate:modelValue":t[3]||(t[3]=e=>i.snackbarVisible=e),color:i.snackbarColor,timeout:6e3},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(i.snackbarMessage),1)])),_:1},8,["modelValue","color"])],64)}var r=a(4870),u=a(5774);function c(e,t,a,l,i,r){const u=(0,n.up)("v-card-title"),c=(0,n.up)("v-switch"),d=(0,n.up)("v-col"),s=(0,n.up)("v-divider"),m=(0,n.up)("v-select"),p=(0,n.up)("v-row"),w=(0,n.up)("v-textarea"),f=(0,n.up)("v-icon"),v=(0,n.up)("v-btn"),h=(0,n.up)("v-container"),g=(0,n.up)("v-card-text"),y=(0,n.up)("v-card");return(0,n.wg)(),(0,n.j4)(y,{class:"elevation-2"},{default:(0,n.w5)((()=>[(0,n.Wm)(u,null,{default:(0,n.w5)((()=>[(0,n.Uk)("Precuration")])),_:1}),(0,n.Wm)(g,null,{default:(0,n.w5)((()=>[(0,n.Wm)(h,null,{default:(0,n.w5)((()=>[(0,n.Wm)(p,null,{default:(0,n.w5)((()=>[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(i.precurationOptions,((e,t)=>((0,n.wg)(),(0,n.j4)(d,{key:t,cols:"2",class:"text-center"},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{modelValue:i.precurationData[e.key],"onUpdate:modelValue":t=>i.precurationData[e.key]=t,"false-value":!1,"true-value":!0,"hide-details":"",class:"mt-0",color:i.precurationData[e.key]?e.activeColor:"grey"},null,8,["modelValue","onUpdate:modelValue","color"]),(0,n._)("div",{style:(0,o.j5)({color:e.color})},(0,o.zw)(e.label)+": "+(0,o.zw)(r.displaySwitchValue(i.precurationData[e.key])),5)])),_:2},1024)))),128)),(0,n.Wm)(d,{cols:"1",class:"d-flex align-center justify-center"},{default:(0,n.w5)((()=>[(0,n.Wm)(s,{vertical:"",class:"mx-2"})])),_:1}),(0,n.Wm)(d,{cols:"3"},{default:(0,n.w5)((()=>[(0,n.Wm)(m,{modelValue:i.precurationData.decision,"onUpdate:modelValue":t[0]||(t[0]=e=>i.precurationData.decision=e),items:["Split","Lump"],label:"Decision","hide-details":""},null,8,["modelValue"])])),_:1})])),_:1}),(0,n.Wm)(p,null,{default:(0,n.w5)((()=>[(0,n.Wm)(d,{cols:"8"},{default:(0,n.w5)((()=>[(0,n.Wm)(w,{modelValue:i.precurationData.comment,"onUpdate:modelValue":t[1]||(t[1]=e=>i.precurationData.comment=e),label:"Comment","auto-grow":"",rows:"1","no-resize":""},null,8,["modelValue"])])),_:1}),(0,n.Wm)(d,{cols:"1",class:"d-flex align-center justify-center"},{default:(0,n.w5)((()=>[(0,n.Wm)(s,{vertical:"",class:"mx-2"})])),_:1}),(0,n.Wm)(d,{cols:"3",class:"pt-2 d-flex align-center"},{default:(0,n.w5)((()=>[(0,n.Wm)(v,{color:"primary",onClick:r.submitPrecuration},{default:(0,n.w5)((()=>[(0,n.Uk)(" Accept "),(0,n.Wm)(f,null,{default:(0,n.w5)((()=>[(0,n.Uk)("mdi-arrow-right")])),_:1})])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})}var d=a(9441),s={name:"PrecurationForm",props:{approvedSymbol:String,hgncId:String},data(){return{precurationData:{approved_symbol:this.approvedSymbol,hgnc_id:this.hgncId,entity_assertion:!1,inheritance_difference:!1,mechanism_difference:!1,phenotypic_variability:!1,decision:"",comment:"",createdAt:null,updatedAt:null,users:["user1"]},precurationOptions:[{key:"entity_assertion",label:"Assertion",color:"purple",activeColor:"indigo"},{key:"inheritance_difference",label:"Inheritance",color:"green",activeColor:"lime"},{key:"mechanism_difference",label:"Mechanism",color:"red",activeColor:"orange"},{key:"phenotypic_variability",label:"Variability",color:"blue",activeColor:"cyan"}],existingPrecurationId:null}},methods:{async submitPrecuration(){const e=(new Date).toISOString();if(this.precurationData.updatedAt=e,this.existingPrecurationId)await(0,d.x6)(this.existingPrecurationId,this.precurationData),console.log("Precuration updated:",this.existingPrecurationId);else{this.precurationData.createdAt=e;const t=await(0,d.el)(this.precurationData);console.log("New precuration created with ID:",t)}this.$emit("precuration-accepted",this.precurationData)},displaySwitchValue(e){return e?"Yes":"No"}},async created(){try{const e=await(0,d.ds)(this.approvedSymbol||this.hgncId);e&&(this.existingPrecurationId=e.id,Object.assign(this.precurationData,e))}catch(e){console.error("Error fetching precuration:",e.message)}}},m=a(89);const p=(0,m.Z)(s,[["render",c],["__scopeId","data-v-3d323da2"]]);var w=p;const f=e=>((0,n.dD)("data-v-2e52fb92"),e=e(),(0,n.Cn)(),e),v=f((()=>(0,n._)("h2",null,"Entity",-1))),h=f((()=>(0,n._)("h2",null,"Groups",-1))),g=f((()=>(0,n._)("h2",null,"Points",-1))),y=f((()=>(0,n._)("h2",null,"Verdict",-1)));function b(e,t,a,o,l,i){const r=(0,n.up)("v-card-title"),u=(0,n.up)("v-col"),c=(0,n.up)("v-text-field"),d=(0,n.up)("v-row"),s=(0,n.up)("v-select"),m=(0,n.up)("v-checkbox"),p=(0,n.up)("v-textarea"),w=(0,n.up)("v-container"),f=(0,n.up)("v-card-text"),b=(0,n.up)("v-spacer"),_=(0,n.up)("v-btn"),D=(0,n.up)("v-card-actions"),W=(0,n.up)("v-card");return(0,n.wg)(),(0,n.j4)(W,{class:"elevation-2"},{default:(0,n.w5)((()=>[(0,n.Wm)(r,null,{default:(0,n.w5)((()=>[(0,n.Uk)("Curation")])),_:1}),(0,n.Wm)(f,null,{default:(0,n.w5)((()=>[(0,n.Wm)(w,null,{default:(0,n.w5)((()=>[(0,n.Wm)(d,{class:"my-2"},{default:(0,n.w5)((()=>[(0,n.Wm)(u,{cols:"12"},{default:(0,n.w5)((()=>[v])),_:1}),(0,n.Wm)(u,{cols:"4"},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{modelValue:l.curationData.approved_symbol,"onUpdate:modelValue":t[0]||(t[0]=e=>l.curationData.approved_symbol=e),label:"Approved Symbol",outlined:"",dense:""},null,8,["modelValue"])])),_:1}),(0,n.Wm)(u,{cols:"4"},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{modelValue:l.curationData.disease,"onUpdate:modelValue":t[1]||(t[1]=e=>l.curationData.disease=e),label:"Disease",outlined:"",dense:""},null,8,["modelValue"])])),_:1}),(0,n.Wm)(u,{cols:"4"},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{modelValue:l.curationData.inheritance,"onUpdate:modelValue":t[2]||(t[2]=e=>l.curationData.inheritance=e),label:"Inheritance",outlined:"",dense:""},null,8,["modelValue"])])),_:1})])),_:1}),(0,n.Wm)(d,{class:"my-2"},{default:(0,n.w5)((()=>[(0,n.Wm)(u,{cols:"12"},{default:(0,n.w5)((()=>[h])),_:1}),(0,n.Wm)(u,{cols:"4"},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{modelValue:l.curationData.groups.clinical,"onUpdate:modelValue":t[3]||(t[3]=e=>l.curationData.groups.clinical=e),label:"Clinical Group",outlined:"",dense:""},null,8,["modelValue"])])),_:1}),(0,n.Wm)(u,{cols:"4"},{default:(0,n.w5)((()=>[(0,n.Wm)(s,{modelValue:l.curationData.groups.onset,"onUpdate:modelValue":t[4]||(t[4]=e=>l.curationData.groups.onset=e),label:"Onset Group",items:[],outlined:"",dense:"",multiple:""},null,8,["modelValue"])])),_:1}),(0,n.Wm)(u,{cols:"4"},{default:(0,n.w5)((()=>[(0,n.Wm)(m,{modelValue:l.curationData.groups.syndromic,"onUpdate:modelValue":t[5]||(t[5]=e=>l.curationData.groups.syndromic=e),label:"Syndromic"},null,8,["modelValue"])])),_:1})])),_:1}),(0,n.Wm)(d,{class:"my-2"},{default:(0,n.w5)((()=>[(0,n.Wm)(u,{cols:"12"},{default:(0,n.w5)((()=>[g])),_:1}),(0,n.Wm)(u,{cols:"4"},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{modelValue:l.curationData.points.variants,"onUpdate:modelValue":t[6]||(t[6]=e=>l.curationData.points.variants=e),label:"Variants",type:"number",outlined:"",dense:""},null,8,["modelValue"])])),_:1}),(0,n.Wm)(u,{cols:"4"},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{modelValue:l.curationData.points.models,"onUpdate:modelValue":t[7]||(t[7]=e=>l.curationData.points.models=e),label:"Models",type:"number",outlined:"",dense:""},null,8,["modelValue"])])),_:1}),(0,n.Wm)(u,{cols:"4"},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{modelValue:l.curationData.points.functional,"onUpdate:modelValue":t[8]||(t[8]=e=>l.curationData.points.functional=e),label:"Functional",type:"number",outlined:"",dense:""},null,8,["modelValue"])])),_:1}),(0,n.Wm)(u,{cols:"4"},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{modelValue:l.curationData.points.rescue,"onUpdate:modelValue":t[9]||(t[9]=e=>l.curationData.points.rescue=e),label:"Rescue",type:"number",outlined:"",dense:""},null,8,["modelValue"])])),_:1}),(0,n.Wm)(u,{cols:"4"},{default:(0,n.w5)((()=>[(0,n.Wm)(s,{modelValue:l.curationData.points.replication,"onUpdate:modelValue":t[10]||(t[10]=e=>l.curationData.points.replication=e),label:"Replication",items:[],outlined:"",dense:"",multiple:""},null,8,["modelValue"])])),_:1})])),_:1}),(0,n.Wm)(d,{class:"my-2"},{default:(0,n.w5)((()=>[(0,n.Wm)(u,{cols:"12"},{default:(0,n.w5)((()=>[y])),_:1}),(0,n.Wm)(u,{cols:"4"},{default:(0,n.w5)((()=>[(0,n.Wm)(s,{modelValue:l.curationData.verdict,"onUpdate:modelValue":t[11]||(t[11]=e=>l.curationData.verdict=e),items:["Definitive","Moderate","Limited","Refuted"],label:"Verdict",outlined:"",dense:""},null,8,["modelValue"])])),_:1}),(0,n.Wm)(u,{cols:"8"},{default:(0,n.w5)((()=>[(0,n.Wm)(p,{modelValue:l.curationData.comment,"onUpdate:modelValue":t[12]||(t[12]=e=>l.curationData.comment=e),label:"Comment","auto-grow":"",rows:"1","no-resize":""},null,8,["modelValue"])])),_:1})])),_:1})])),_:1})])),_:1}),(0,n.Wm)(D,null,{default:(0,n.w5)((()=>[(0,n.Wm)(b),(0,n.Wm)(_,{color:"primary",onClick:i.saveCuration},{default:(0,n.w5)((()=>[(0,n.Uk)("Save")])),_:1},8,["onClick"])])),_:1})])),_:1})}var _=a(4157),D={name:"CurationForm",props:{approvedSymbol:String,hgncId:String},data(){return{curationData:{approved_symbol:this.approvedSymbol,hgnc_id:this.hgncId,disease:"",inheritance:"",groups:{clinical:"",onset:[],syndromic:!1},points:{variants:0,models:0,functional:0,rescue:0,replication:[]},verdict:"",comment:""},existingCurationId:null}},async created(){if(this.hgncId||this.approvedSymbol)try{const e=await(0,_.rj)(this.hgncId||this.approvedSymbol);e&&(this.existingCurationId=e.id,Object.assign(this.curationData,e))}catch(e){console.error("Error fetching curation:",e.message)}},methods:{async saveCuration(){try{if(this.existingCurationId)await(0,_.lO)(this.existingCurationId,this.curationData),console.log("Curation updated:",this.existingCurationId);else{const e=await(0,_.pK)(this.curationData);console.log("New curation created with ID:",e)}}catch(e){console.error("Error saving curation:",e.message)}}}};const W=(0,m.Z)(D,[["render",b],["__scopeId","data-v-2e52fb92"]]);var V=W,k={components:{GeneDetailCard:u.Z,PrecurationForm:w,CurationForm:V},props:{item:{type:Object,required:!0},open:{type:Boolean,required:!0},context:{type:String,default:"gene"}},emits:["close"],setup(e,{emit:t}){const a=(0,r.iH)(e.open),o=(0,r.iH)({...e.item}),l=(0,r.iH)(!0),i=(0,r.iH)(!0),u=(0,r.iH)(!1),c=(0,r.iH)(0),s=(0,r.iH)(!1),m=(0,r.iH)(""),p=(0,r.iH)("success"),w=(e,t="success")=>{m.value=e,p.value=t,s.value=!0};(0,n.m0)((()=>{a.value=e.open,o.value={...e.item}}));const f=()=>{"precuration"===e.context?v():(u.value=!0,c.value=1)},v=()=>t("close"),h=async()=>{try{const e=await(0,d.ds)(o.value.hgnc_id||o.value.approved_symbol);e?(u.value=!0,c.value=1):(u.value=!1,c.value=0)}catch(e){w("Error checking existing curation: "+e.message,"error")}},g=(0,n.Fl)((()=>"curation"===e.context?"Curation":"precuration"===e.context?"Precuration":"Gene Curation"));(0,n.YP)((()=>e.open),(async e=>{e&&await y()}));const y=async()=>{"precuration"===e.context?(l.value=!1,i.value=!0,u.value=!1,c.value=0):"curation"===e.context?(l.value=!1,i.value=!1,await h(),c.value=u.value?1:0):await h()};return(0,n.YP)((()=>e.open),(e=>{e&&y()})),{initializeModal:y,isOpen:a,editedItem:o,close:v,handlePrecurationAccepted:f,showGeneDetailCard:l,showPreCurationTab:i,showCurationTab:u,tab:c,snackbarVisible:s,snackbarMessage:m,snackbarColor:p,showSnackbar:w,title:g}}};const x=(0,m.Z)(k,[["render",i],["__scopeId","data-v-f05fa8b2"]]);var C=x},7385:function(e,t,a){a.d(t,{Z:function(){return m}});var n=a(3396),o=a(7139);const l={key:0},i={key:1};function r(e,t,a,r,u,c){const d=(0,n.up)("v-tooltip"),s=(0,n.up)("router-link"),m=(0,n.up)("v-data-table"),p=(0,n.up)("v-pagination"),w=(0,n.up)("v-container");return(0,n.wg)(),(0,n.j4)(w,null,{default:(0,n.w5)((()=>[(0,n.Wm)(m,{headers:a.headers,items:a.items,"items-per-page":r.itemsPerPage,"onUpdate:itemsPerPage":t[0]||(t[0]=e=>r.itemsPerPage=e),"server-items-length":a.totalItems,loading:a.loading,class:"elevation-1",density:"compact"},(0,n.Nv)({_:2},[(0,n.Ko)(a.headers,(e=>({name:`header.${e.value}`,fn:(0,n.w5)((({header:t})=>[(0,n._)("span",null,(0,o.zw)(e.title),1),e.description?((0,n.wg)(),(0,n.j4)(d,{key:0,header:t,activator:"parent",location:"top"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(e.description),1)])),_:2},1032,["header"])):(0,n.kq)("",!0)]))}))),(0,n.Ko)(a.config.columns,(t=>({name:`item.${t.name}`,fn:(0,n.w5)((({item:a})=>["text"===t.type?((0,n.wg)(),(0,n.iD)("div",l,(0,o.zw)(a[t.name]),1)):"date"===t.type?((0,n.wg)(),(0,n.iD)("div",i,(0,o.zw)(r.formatTimestamp(a[t.name])),1)):"link"===t.type?((0,n.wg)(),(0,n.j4)(s,{key:2,to:t.to(a)},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(a[t.name]),1)])),_:2},1032,["to"])):"slot"===t.type?(0,n.WI)(e.$slots,t.slotName,{key:3,item:a}):(0,n.kq)("",!0)]))})))]),1032,["headers","items","items-per-page","server-items-length","loading"]),(0,n.WI)(e.$slots,"modal"),(0,n.Wm)(p,{modelValue:r.page,"onUpdate:modelValue":t[1]||(t[1]=e=>r.page=e),length:r.totalPages,"onUpdate:page":t[2]||(t[2]=t=>e.$emit("update-page",r.page))},null,8,["modelValue","length"])])),_:3})}var u=a(4870),c={props:{headers:Array,items:Array,config:Object,totalItems:Number,loading:Boolean},setup(e,{emit:t}){const a=(0,u.iH)(1),o=(0,u.iH)(10),l=(0,n.Fl)((()=>Math.ceil(e.totalItems/o.value))),i=e=>{if(!e)return"";const t=new Date(1e3*e.seconds);return t.toLocaleDateString()};return(0,n.YP)(a,(()=>{t("page-changed",a.value)})),(0,n.YP)(o,(()=>{t("items-per-page-changed",o.value)})),{page:a,itemsPerPage:o,totalPages:l,formatTimestamp:i}}},d=a(89);const s=(0,d.Z)(c,[["render",r]]);var m=s},5774:function(e,t,a){a.d(t,{Z:function(){return w}});var n=a(3396),o=a(7139);const l=["title"],i=["innerHTML"];function r(e,t,a,r,u,c){const d=(0,n.up)("v-card-title"),s=(0,n.up)("v-tooltip"),m=(0,n.up)("v-table"),p=(0,n.up)("v-card-text"),w=(0,n.up)("v-card"),f=(0,n.up)("v-alert"),v=(0,n.up)("v-container");return(0,n.wg)(),(0,n.j4)(v,null,{default:(0,n.w5)((()=>[r.gene?((0,n.wg)(),(0,n.j4)(w,{key:0,class:"mx-auto my-4","max-width":"800"},{default:(0,n.w5)((()=>[a.showTitle?((0,n.wg)(),(0,n.j4)(d,{key:0,class:"headline"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(r.gene.approved_symbol),1)])),_:1})):(0,n.kq)("",!0),(0,n.Wm)(p,null,{default:(0,n.w5)((()=>[(0,n.Wm)(m,{dense:""},{default:(0,n.w5)((()=>[(0,n._)("tbody",null,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(r.filteredGeneDetails,((e,t)=>((0,n.wg)(),(0,n.iD)("tr",{key:t},[(0,n._)("td",null,[(0,n._)("strong",null,[(0,n._)("span",{class:"label-hover",title:e.description},(0,o.zw)(e.label),9,l),(0,n.Wm)(s,{activator:"parent",location:"start"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(e.description),1)])),_:2},1024)])]),(0,n._)("td",{innerHTML:e.formattedValue},null,8,i)])))),128))])])),_:1})])),_:1})])),_:1})):((0,n.wg)(),(0,n.j4)(f,{key:1,type:"error"},{default:(0,n.w5)((()=>[(0,n.Uk)(" Gene not found or failed to load. ")])),_:1}))])),_:1})}var u=a(4870),c=a(3191),d=a(1827),s={props:{id:String,visibilityScope:{type:String,default:"standardView"},showTitle:{type:Boolean,default:!0}},setup(e){const t=(0,u.iH)(null);(0,n.bv)((async()=>{e.id&&(t.value=await(0,c.Xu)(e.id).catch((e=>{console.error(e.message)})))}));const a=(0,n.Fl)((()=>t.value?Object.entries(d.Wk).filter((([,t])=>t.visibility[e.visibilityScope])).map((([e,a])=>{const n=t.value[e];return{label:a.label,description:a.description||"",formattedValue:o(n,a)}})):[]));function o(e,t){if(null==e)return"N/A";switch(t.format){case"date":return new Date(1e3*e.seconds).toLocaleDateString();case"number":return parseFloat(e).toFixed(2);case"array":return e.join(", ");case"map":return Object.entries(e).map((([e,t])=>`${e}: ${t}`)).join(", ");case"text":return e;default:return JSON.stringify(e)}}return{gene:t,filteredGeneDetails:a}}},m=a(89);const p=(0,m.Z)(s,[["render",r],["__scopeId","data-v-ea7ae29e"]]);var w=p}}]);
//# sourceMappingURL=690.e2d06a4f.js.map