"use strict";(self["webpackChunkgene_curator"]=self["webpackChunkgene_curator"]||[]).push([[600],{4157:function(e,t,a){a.d(t,{FH:function(){return c},TN:function(){return u},VG:function(){return r},lO:function(){return s},pK:function(){return l}});a(560);var i=a(4287),n=a(6056);const r=async()=>{const e=await(0,i.PL)((0,i.hJ)(n.db,"curations"));let t={};return e.forEach((e=>{if(!e.exists())throw new Error("Curation document not found");t[e.id]={id:e.id,...e.data()}})),t},o=(e,t)=>{const a=[];for(const[i,n]of Object.entries(t)){const t=e[i];n.required&&!t&&a.push(`The field "${n.label}" is required.`),"number"===n.format&&(void 0!==n.min&&t<n.min&&a.push(`The value for "${n.label}" should not be less than ${n.min}.`),void 0!==n.max&&t>n.max&&a.push(`The value for "${n.label}" should not exceed ${n.max}.`))}return a},l=async(e,t,a)=>{const r=o(e,a);if(r.length>0)throw new Error(`Validation failed: ${r.join(" ")}`);const l=await p({approvedSymbol:e.approved_symbol,disease:e.disease,inheritance:e.inheritance});if(l)throw new Error("A curation with the same symbol, disease, and inheritance already exists.");const s=await(0,i.ET)((0,i.hJ)(n.db,"curations"),{...e,users:[t],createdAt:i.EK.fromDate(new Date),updatedAt:i.EK.fromDate(new Date)});return s.id},s=async(e,t,a,r)=>{const l=o(t,r);if(l.length>0)throw new Error(`Validation failed: ${l.join(" ")}`);const s=(0,i.JU)(n.db,"curations",e),c=await(0,i.QT)(s);if(!c.exists())throw new Error("Curation document not found");const u=c.data(),p=d(u.users||[],a);await(0,i.r7)(s,{...t,users:p,updatedAt:i.EK.fromDate(new Date)})},c=async e=>{const t=(0,i.JU)(n.db,"curations",e);await(0,i.oe)(t)},u=async e=>{const t=(0,i.hJ)(n.db,"curations"),a=(0,i.IO)(t,(0,i.ar)("approved_symbol","==",e)),r=(0,i.IO)(t,(0,i.ar)("hgnc_id","==",e));let o=[];const l=e=>{e.exists()&&o.push({id:e.id,...e.data()})},s=await(0,i.PL)(a);if(s.forEach(l),0===o.length){const e=await(0,i.PL)(r);e.forEach(l)}return o},d=(e,t)=>{const a=e.filter((e=>e!==t));return a.push(t),a},p=async({approvedSymbol:e,disease:t,inheritance:a})=>{const r=(0,i.hJ)(n.db,"curations"),o=(0,i.IO)(r,(0,i.ar)("approved_symbol","==",e),(0,i.ar)("disease","==",t),(0,i.ar)("inheritance","==",a)),l=await(0,i.PL)(o);return!l.empty}},9441:function(e,t,a){a.d(t,{QY:function(){return u},ds:function(){return s},el:function(){return l},wp:function(){return o},x6:function(){return c}});a(560);var i=a(4287),n=a(6056);const r=(e,t)=>{const a=[];for(const[i,n]of Object.entries(t)){const t=e[i];!n.required||void 0!==t&&""!==t||a.push(`The field "${n.label}" is required.`),"number"===n.format&&(void 0!==n.min&&t<n.min&&a.push(`The value for "${n.label}" should not be less than ${n.min}.`),void 0!==n.max&&t>n.max&&a.push(`The value for "${n.label}" should not exceed ${n.max}.`))}return a},o=async()=>{const e=await(0,i.PL)((0,i.hJ)(n.db,"precurations"));let t={};return e.forEach((e=>{if(!e.exists())throw new Error("Precuration document not found");t[e.id]={id:e.id,...e.data()}})),t},l=async(e,t,a)=>{const o=r(e,a);if(o.length>0)throw new Error(`Validation failed: ${o.join(" ")}`);const l=await(0,i.ET)((0,i.hJ)(n.db,"precurations"),{...e,users:[t],createdAt:i.EK.fromDate(new Date),updatedAt:i.EK.fromDate(new Date)});return l.id},s=async e=>{const t=(0,i.hJ)(n.db,"precurations"),a=(0,i.IO)(t,(0,i.ar)("approved_symbol","==",e)),r=(0,i.IO)(t,(0,i.ar)("hgnc_id","==",e)),o=await(0,i.PL)(a),l=await(0,i.PL)(r);let s=null;return o.forEach((e=>{e.exists()&&(s={id:e.id,...e.data()})})),s||l.forEach((e=>{e.exists()&&(s={id:e.id,...e.data()})})),s},c=async(e,t,a,o)=>{const l=r(t,o);if(l.length>0)throw new Error(`Validation failed: ${l.join(" ")}`);const s=(0,i.JU)(n.db,"precurations",e),c=await(0,i.QT)(s);if(!c.exists())throw new Error("Precuration document not found");const u=c.data(),p=d(u.users||[],a);await(0,i.r7)(s,{...t,users:p,updatedAt:i.EK.fromDate(new Date)})},u=async e=>{const t=(0,i.JU)(n.db,"precurations",e);await(0,i.oe)(t)},d=(e,t)=>{const a=e.filter((e=>e!==t));return a.push(t),a}},3722:function(e,t,a){a.d(t,{Z:function(){return O}});var i=a(3396),n=a(7139);const r={class:"d-flex justify-space-between align-center"};function o(e,t,a,o,l,s){const c=(0,i.up)("GeneLinkChips"),u=(0,i.up)("v-card-title"),d=(0,i.up)("v-icon"),p=(0,i.up)("v-btn"),m=(0,i.up)("v-tab"),h=(0,i.up)("v-tabs"),w=(0,i.up)("GeneDetailCard"),g=(0,i.up)("PrecurationForm"),b=(0,i.up)("v-window-item"),f=(0,i.up)("CurationForm"),v=(0,i.up)("v-window"),y=(0,i.up)("v-card-text"),k=(0,i.up)("v-spacer"),D=(0,i.up)("v-card-actions"),_=(0,i.up)("v-card"),V=(0,i.up)("v-dialog"),C=(0,i.up)("MessageSnackbar");return(0,i.wg)(),(0,i.iD)(i.HY,null,[(0,i.Wm)(V,{modelValue:o.isOpen,"onUpdate:modelValue":t[2]||(t[2]=e=>o.isOpen=e),persistent:"","max-width":"1200px"},{default:(0,i.w5)((()=>[(0,i.Wm)(_,null,{default:(0,i.w5)((()=>[(0,i._)("div",r,[(0,i.Wm)(u,null,{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(o.title)+" - "+(0,n.zw)(o.editedItem.approved_symbol)+" - HGNC:"+(0,n.zw)(o.editedItem.hgnc_id)+" ",1),(0,i.Wm)(c,{"hgnc-id":o.editedItem.hgnc_id,"gene-symbol":o.editedItem.approved_symbol,"links-to-show":["clingen","gencc","search_omim"]},null,8,["hgnc-id","gene-symbol"])])),_:1}),(0,i.Wm)(p,{icon:"",onClick:o.close},{default:(0,i.w5)((()=>[(0,i.Wm)(d,null,{default:(0,i.w5)((()=>[(0,i.Uk)("mdi-close")])),_:1})])),_:1},8,["onClick"])]),(0,i.Wm)(y,null,{default:(0,i.w5)((()=>[(0,i.Wm)(h,{modelValue:o.tab,"onUpdate:modelValue":t[0]||(t[0]=e=>o.tab=e),grow:""},{default:(0,i.w5)((()=>[o.showPreCurationTab?((0,i.wg)(),(0,i.j4)(m,{key:0},{default:(0,i.w5)((()=>[(0,i.Uk)("Pre-Curation")])),_:1})):(0,i.kq)("",!0),o.showCurationTab?((0,i.wg)(),(0,i.j4)(m,{key:1},{default:(0,i.w5)((()=>[(0,i.Uk)("Curation")])),_:1})):(0,i.kq)("",!0)])),_:1},8,["modelValue"]),(0,i.Wm)(v,{modelValue:o.tab,"onUpdate:modelValue":t[1]||(t[1]=e=>o.tab=e),style:{"min-height":"300px"}},{default:(0,i.w5)((()=>[(0,i.Wm)(b,null,{default:(0,i.w5)((()=>[o.showGeneDetailCard?((0,i.wg)(),(0,i.j4)(w,{key:0,id:o.editedItem.hgnc_id,visibilityScope:"curationView",showTitle:!1,onGeneDataLoaded:o.handleGeneDataLoaded},null,8,["id","onGeneDataLoaded"])):(0,i.kq)("",!0),o.geneData?((0,i.wg)(),(0,i.j4)(g,{key:1,"gene-object":o.geneData,onPrecurationAccepted:o.handlePrecurationAccepted},null,8,["gene-object","onPrecurationAccepted"])):(0,i.kq)("",!0)])),_:1}),o.showCurationTab?((0,i.wg)(),(0,i.j4)(b,{key:0},{default:(0,i.w5)((()=>[o.precurationDetails?((0,i.wg)(),(0,i.j4)(f,{key:0,approvedSymbol:o.editedItem.approved_symbol,hgncId:o.editedItem.hgnc_id,precurationDetails:o.precurationDetails},null,8,["approvedSymbol","hgncId","precurationDetails"])):(0,i.kq)("",!0)])),_:1})):(0,i.kq)("",!0)])),_:1},8,["modelValue"])])),_:1}),(0,i.Wm)(D,null,{default:(0,i.w5)((()=>[(0,i.Wm)(k),(0,i.Wm)(p,{color:"blue darken-1",text:"",onClick:o.close},{default:(0,i.w5)((()=>[(0,i.Uk)("Cancel")])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1},8,["modelValue"]),(0,i.Wm)(C,{modelValue:o.snackbarVisible,"onUpdate:modelValue":t[3]||(t[3]=e=>o.snackbarVisible=e),title:o.snackbarTitle,message:o.snackbarMessage,color:o.snackbarColor},null,8,["modelValue","title","message","color"])],64)}var l=a(4870),s=a(4936);function c(e,t,a,r,o,l){const s=(0,i.up)("v-card-title"),c=(0,i.up)("v-col"),u=(0,i.up)("v-switch"),d=(0,i.up)("v-tooltip"),p=(0,i.up)("v-text-field"),m=(0,i.up)("v-select"),h=(0,i.up)("v-row"),w=(0,i.up)("v-btn"),g=(0,i.up)("v-container"),b=(0,i.up)("v-card-text"),f=(0,i.up)("v-card"),v=(0,i.up)("MessageSnackbar");return(0,i.wg)(),(0,i.iD)(i.HY,null,[(0,i.Wm)(f,{class:"elevation-2"},{default:(0,i.w5)((()=>[(0,i.Wm)(s,null,{default:(0,i.w5)((()=>[(0,i.Uk)("Precuration")])),_:1}),(0,i.Wm)(b,null,{default:(0,i.w5)((()=>[(0,i.Wm)(g,null,{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(l.groupedFields,((e,t)=>((0,i.wg)(),(0,i.iD)(i.HY,{key:t},[l.groupHasVisibleFields(e)?((0,i.wg)(),(0,i.j4)(h,{key:0},{default:(0,i.w5)((()=>[(0,i.Wm)(c,{cols:"12"},{default:(0,i.w5)((()=>[(0,i._)("h2",null,(0,n.zw)(t),1)])),_:2},1024),((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(e,((t,a)=>((0,i.wg)(),(0,i.j4)(c,{key:a,cols:12/e.length},{default:(0,i.w5)((()=>["boolean"===t.format&&t.visibility.curationView?((0,i.wg)(),(0,i.iD)(i.HY,{key:0},[(0,i.Wm)(u,{modelValue:o.precurationData[t.key],"onUpdate:modelValue":e=>o.precurationData[t.key]=e,label:t.label,"false-value":!1,"true-value":!0,color:"switch"===t.style.curationView?t.style.color:"",class:(0,n.C_)({"inactive-switch":!o.precurationData[t.key]&&"switch"===t.style.curationView})},null,8,["modelValue","onUpdate:modelValue","label","color","class"]),(0,i.Wm)(d,{activator:"parent",location:"top"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(t.description),1)])),_:2},1024)],64)):t.style&&"text-field"===t.style.curationView&&t.visibility.curationView?((0,i.wg)(),(0,i.iD)(i.HY,{key:1},[(0,i.Wm)(p,{modelValue:o.precurationData[t.key],"onUpdate:modelValue":e=>o.precurationData[t.key]=e,label:t.label,class:(0,n.C_)("text-field"===t.style.curationView?"custom-text-field":"")},null,8,["modelValue","onUpdate:modelValue","label","class"]),(0,i.Wm)(d,{activator:"parent",location:"top"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(t.description),1)])),_:2},1024)],64)):t.style&&"select"===t.style.curationView&&t.visibility.curationView?((0,i.wg)(),(0,i.iD)(i.HY,{key:2},[(0,i.Wm)(m,{modelValue:o.precurationData[t.key],"onUpdate:modelValue":e=>o.precurationData[t.key]=e,items:t.options,label:t.label,class:(0,n.C_)({"prefilled-field":o.decisionPrefilled&&"decision"===t.key,"manually-changed-field":o.decisionManuallyChanged&&"decision"===t.key})},null,8,["modelValue","onUpdate:modelValue","items","label","class"]),(0,i.Wm)(d,{activator:"parent",location:"top"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(t.description),1)])),_:2},1024)],64)):(0,i.kq)("",!0)])),_:2},1032,["cols"])))),128))])),_:2},1024)):(0,i.kq)("",!0)],64)))),128)),(0,i.Wm)(h,null,{default:(0,i.w5)((()=>[(0,i.Wm)(c,{cols:"12",class:"text-right"},{default:(0,i.w5)((()=>[(0,i.Wm)(w,{color:"primary",onClick:l.submitPrecuration},{default:(0,i.w5)((()=>[(0,i.Uk)("Accept")])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1}),(0,i.Wm)(v,{modelValue:o.snackbarVisible,"onUpdate:modelValue":t[0]||(t[0]=e=>o.snackbarVisible=e),title:o.snackbarTitle,message:o.snackbarMessage,color:o.snackbarColor},null,8,["modelValue","title","message","color"])],64)}a(560);var u=a(4232),d=a(9441),p={name:"PrecurationForm",props:{geneObject:Object},emits:["precuration-accepted"],components:{},data(){return{precurationData:this.initializePrecurationData(),existingPrecurationId:null,decisionPrefilled:!1,decisionManuallyChanged:!1,snackbarVisible:!1,snackbarMessage:"",snackbarTitle:"",snackbarColor:"success"}},computed:{groupedFields(){const e=this.precurationFields,t={};return e.forEach((e=>{t[e.group.name]||(t[e.group.name]=[]),t[e.group.name].push(e)})),Object.values(t).forEach((e=>{e.sort(((e,t)=>e.group.order-t.group.order))})),t},precurationFields(){let e=Object.entries(u.m_).map((([e,t])=>({...t,key:e})));return e}},watch:{precurationData:{deep:!0,handler(){this.applyDecisionRules()}},"precurationData.decision":"onDecisionChange"},methods:{showSnackbar(e,t,a="success"){this.snackbarTitle=e,this.snackbarMessage=t,this.snackbarColor=a,this.snackbarVisible=!0},applyDecisionRules(){const e=u.$o.stages.precuration.decisionRules[0];let t=e.conditions.reduce(((e,t)=>this.precurationData[t]?e+1:e),0);t>=e.threshold?this.precurationData.decision!==e.decision&&this.precurationData.decision||(this.precurationData.decision=e.decision,this.decisionPrefilled=!0,this.decisionManuallyChanged=!1):this.decisionPrefilled&&(this.decisionPrefilled=!1)},onDecisionChange(e){const t=u.$o.stages.precuration.decisionRules[0];let a=t.conditions.reduce(((e,t)=>this.precurationData[t]?e+1:e),0);const i=a>=t.threshold?t.decision:"";this.decisionManuallyChanged=e!==i,this.decisionManuallyChanged?this.updateCommentField("Decision manually overridden."):this.removeCommentOverride()},updateCommentField(e){this.precurationData.comment.includes(e)||(this.precurationData.comment+=(this.precurationData.comment?" ":"")+e)},removeCommentOverride(){const e="Decision manually overridden.";this.precurationData.comment.includes(e)&&(this.precurationData.comment=this.precurationData.comment.replace(e,"").trim())},groupHasVisibleFields(e){return e.some((e=>e.visibility.curationView))},initializePrecurationData(){const e={};if(Object.keys(u.m_).forEach((t=>{this.geneObject&&t in this.geneObject?e[t]=this.geneObject[t]:e[t]="boolean"!==u.m_[t].format&&""})),this.geneObject&&this.geneObject.docId){const t=this.geneObject.docId,a={};Object.keys(u.Wk).forEach((e=>{e in this.geneObject&&(a[e]=this.geneObject[e])})),e["geneDetails"]={[t]:a}}return e},validatePrecurationData(e){const t=[];for(const[a,i]of Object.entries(u.m_))!i.required||void 0!==e[a]&&""!==e[a]||t.push(`The field "${i.label}" is required.`);return t},async submitPrecuration(){const e=JSON.parse(localStorage.getItem("user")).uid;try{const t=this.validatePrecurationData(this.precurationData,u.m_);if(t.length>0)throw new Error(`Validation failed: ${t.join(" ")}`);const a=(new Date).toISOString();let i;this.existingPrecurationId?(this.precurationData.updatedAt=a,await(0,d.x6)(this.existingPrecurationId,this.precurationData,e,u.m_),i=this.existingPrecurationId,this.showSnackbar("Success","Precuration updated"+this.existingPrecurationId,"success")):(this.precurationData.createdAt=a,this.precurationData.workflowConfigVersionUsed=u.se,this.precurationData.workflowConfigNameUsed=u.l9,i=await(0,d.el)(this.precurationData,e,u.m_),this.precurationData.docId=i,this.showSnackbar("Success","New precuration created with ID:"+i,"success")),this.$emit("precuration-accepted",{docId:i,...this.precurationData})}catch(t){this.showSnackbar("Error",t.message||"There was an error submitting the precuration","error")}},displaySwitchValue(e){return e?"Yes":"No"}},async created(){if(this.geneObject&&(this.geneObject.approved_symbol||this.geneObject.hgnc_id))try{const e=this.geneObject.approved_symbol||this.geneObject.hgnc_id,t=await(0,d.ds)(e);t&&(this.existingPrecurationId=t.id,Object.assign(this.precurationData,t))}catch(e){this.showSnackbar("Error","Error fetching precuration: "+e.message,"error")}}},m=a(89);const h=(0,m.Z)(p,[["render",c],["__scopeId","data-v-c28a145e"]]);var w=h;function g(e,t,a,r,o,l){const s=(0,i.up)("v-icon"),c=(0,i.up)("v-btn"),u=(0,i.up)("v-card-title"),d=(0,i.up)("v-col"),p=(0,i.up)("v-text-field"),m=(0,i.up)("v-tooltip"),h=(0,i.up)("v-checkbox"),w=(0,i.up)("v-select"),g=(0,i.up)("v-row"),b=(0,i.up)("v-expansion-panel-text"),f=(0,i.up)("v-expansion-panel"),v=(0,i.up)("v-expansion-panels"),y=(0,i.up)("v-spacer"),k=(0,i.up)("v-card-actions"),D=(0,i.up)("v-card"),_=(0,i.up)("MessageSnackbar");return(0,i.wg)(),(0,i.iD)(i.HY,null,[(0,i.Wm)(D,{class:"elevation-2"},{default:(0,i.w5)((()=>[(0,i.Wm)(u,null,{default:(0,i.w5)((()=>[(0,i.Uk)(" Curation "),(0,i.Wm)(c,{icon:"",class:"add-curation-btn",onClick:l.addCurationEntity},{default:(0,i.w5)((()=>[(0,i.Wm)(s,null,{default:(0,i.w5)((()=>[(0,i.Uk)("mdi-plus")])),_:1})])),_:1},8,["onClick"])])),_:1}),(0,i.Wm)(v,{multiple:""},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(o.curationDataArray,((e,t)=>((0,i.wg)(),(0,i.j4)(f,{key:`curation-${t}`,title:`Curation Entity ${t+1}`},{default:(0,i.w5)((()=>[(0,i.Wm)(b,null,{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(l.groupedFields,((a,r)=>((0,i.wg)(),(0,i.iD)(i.HY,{key:r},[l.groupHasVisibleFields(a)?((0,i.wg)(),(0,i.j4)(g,{key:0},{default:(0,i.w5)((()=>[(0,i.Wm)(d,{cols:"12"},{default:(0,i.w5)((()=>[(0,i._)("h2",null,(0,n.zw)(r),1)])),_:2},1024),((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(a,((r,o)=>((0,i.wg)(),(0,i.j4)(d,{key:`field-${t}-${o}`,cols:12/a.length},{default:(0,i.w5)((()=>["text"===r.format&&r.style&&"text-field"===r.style.curationView?((0,i.wg)(),(0,i.iD)(i.HY,{key:0},[(0,i.Wm)(p,{modelValue:e[r.key],"onUpdate:modelValue":t=>e[r.key]=t,rules:l.getFieldRules(r),label:r.label,outlined:"",dense:""},null,8,["modelValue","onUpdate:modelValue","rules","label"]),(0,i.Wm)(m,{activator:"parent",location:"top"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(r.description),1)])),_:2},1024)],64)):"boolean"===r.format?((0,i.wg)(),(0,i.iD)(i.HY,{key:1},[(0,i.Wm)(h,{modelValue:e[r.key],"onUpdate:modelValue":t=>e[r.key]=t,rules:l.getFieldRules(r),label:r.label},null,8,["modelValue","onUpdate:modelValue","rules","label"]),(0,i.Wm)(m,{activator:"parent",location:"top"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(r.description),1)])),_:2},1024)],64)):"number"===r.format?((0,i.wg)(),(0,i.iD)(i.HY,{key:2},[(0,i.Wm)(p,{modelValue:e[r.key],"onUpdate:modelValue":t=>e[r.key]=t,rules:l.getFieldRules(r),label:r.label,min:r.min,max:r.max,step:r.step||1,type:"number",outlined:"",dense:""},null,8,["modelValue","onUpdate:modelValue","rules","label","min","max","step"]),(0,i.Wm)(m,{activator:"parent",location:"top"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(r.description),1)])),_:2},1024)],64)):"array"===r.format&&r.style&&"select"===r.style.curationView?((0,i.wg)(),(0,i.iD)(i.HY,{key:3},[(0,i.Wm)(w,{modelValue:e[r.key],"onUpdate:modelValue":t=>e[r.key]=t,rules:l.getFieldRules(r),items:r.options,label:r.label,multiple:"",outlined:"",dense:""},null,8,["modelValue","onUpdate:modelValue","rules","items","label"]),(0,i.Wm)(m,{activator:"parent",location:"top"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(r.description),1)])),_:2},1024)],64)):"text"===r.format&&r.style&&"select"===r.style.curationView?((0,i.wg)(),(0,i.iD)(i.HY,{key:4},[(0,i.Wm)(w,{modelValue:e[r.key],"onUpdate:modelValue":t=>e[r.key]=t,items:r.options,"item-value":"value","item-text":"title",label:r.label,outlined:"",dense:""},null,8,["modelValue","onUpdate:modelValue","items","label"]),(0,i.Wm)(m,{activator:"parent",location:"top"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(r.description),1)])),_:2},1024)],64)):(0,i.kq)("",!0)])),_:2},1032,["cols"])))),128))])),_:2},1024)):(0,i.kq)("",!0)],64)))),128))])),_:2},1024)])),_:2},1032,["title"])))),128))])),_:1}),(0,i.Wm)(k,null,{default:(0,i.w5)((()=>[(0,i.Wm)(y),(0,i.Wm)(c,{color:"primary",onClick:l.saveCuration},{default:(0,i.w5)((()=>[(0,i.Uk)("Save All")])),_:1},8,["onClick"])])),_:1})])),_:1}),(0,i.Wm)(_,{modelValue:o.snackbarVisible,"onUpdate:modelValue":t[0]||(t[0]=e=>o.snackbarVisible=e),title:o.snackbarTitle,message:o.snackbarMessage,color:o.snackbarColor},null,8,["modelValue","title","message","color"])],64)}var b=a(9546),f=a(4157);const v=e=>!!e||"This field is required";const y=e=>!isNaN(parseFloat(e))&&isFinite(e)||"Must be a number",k=e=>t=>parseFloat(t)>=e||`Minimum value is ${e}`,D=e=>t=>parseFloat(t)<=e||`Maximum value is ${e}`;var _={name:"CurationForm",props:{approvedSymbol:String,hgncId:String,precurationDetails:Object},data(){return{curationDataArray:[this.initializeCurationData()],existingCurationId:null,snackbarVisible:!1,snackbarMessage:"",snackbarTitle:"",snackbarColor:"success"}},async created(){if(this.hgncId||this.approvedSymbol)try{const e=await(0,f.TN)(this.hgncId||this.approvedSymbol);e.length>0?this.curationDataArray=e.map((e=>Object.assign(this.initializeCurationData(),e))):this.curationDataArray=[this.initializeCurationData()]}catch(e){this.showSnackbar("Error",`Error fetching curations: ${e.message}`,"error")}else this.curationDataArray=[this.initializeCurationData()]},computed:{groupedFields(){const e=Object.entries(b.U).map((([e,t])=>({...t,key:e}))),t={};return e.forEach((e=>{t[e.group.name]||(t[e.group.name]=[]),t[e.group.name].push(e)})),Object.values(t).forEach((e=>{e.sort(((e,t)=>e.group.order-t.group.order))})),t}},methods:{getFieldRules(e){const t=[];return e.required&&t.push(v),"number"===e.format&&(t.push(y),void 0!==e.min&&t.push(k(e.min)),void 0!==e.max&&t.push(D(e.max))),t},showSnackbar(e,t,a="success"){this.snackbarTitle=e,this.snackbarMessage=t,this.snackbarColor=a,this.snackbarVisible=!0},groupHasVisibleFields(e){return e.some((e=>e.visibility.curationView))},addCurationEntity(){this.curationDataArray.push(this.initializeCurationData())},initializeCurationData(){const e={};if(Object.keys(b.U).forEach((t=>{const a=b.U[t];"boolean"===a.format?e[t]=!1:"number"===a.format?e[t]=a.min||0:"array"===a.format&&a.style&&"select"===a.style.curationView?e[t]=[]:"text"===a.format&&a.style&&"select"===a.style.curationView?e[t]=null:e[t]="","approved_symbol"===t&&this.approvedSymbol&&(e[t]=this.approvedSymbol),"hgnc_id"===t&&this.hgncId&&(e[t]=this.hgncId)})),this.precurationDetails&&this.precurationDetails.docId){const t=this.precurationDetails.docId;e["precurationDetails"]={[t]:this.precurationDetails}}return e},validateCurationData(e){const t=[];for(const[a,i]of Object.entries(b.U))i.required&&!e[a]&&t.push(`The field "${i.label}" is required.`);return t},async saveCuration(){const e=JSON.parse(localStorage.getItem("user")).uid;try{for(const t of this.curationDataArray)if(t.workflowConfigVersionUsed=u.se,t.workflowConfigNameUsed=u.l9,t.id)await(0,f.lO)(t.id,t,e,b.U),this.showSnackbar("Success",`Curation updated: ${t.id}`,"success");else{const a=await(0,f.pK)(t,e,b.U);this.showSnackbar("Success",`New curation created with ID: ${a}`,"success"),t.id=a}}catch(t){this.showSnackbar("Error",`Error saving curation: ${t.message}`,"error")}}}};const V=(0,m.Z)(_,[["render",g],["__scopeId","data-v-a73116c8"]]);var C=V;const x={class:"gene-links"};function U(e,t,a,r,o,l){const s=(0,i.up)("v-chip");return(0,i.wg)(),(0,i.iD)("div",x,[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(e.activeLinks,(t=>((0,i.wg)(),(0,i.j4)(s,{key:t.name,onClick:a=>e.goToLink(t.url),size:"small"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(t.name),1)])),_:2},1032,["onClick"])))),128))])}var j=(0,i.aZ)({name:"GeneLinkChips",props:{hgncId:{type:String,default:null},geneSymbol:{type:String,default:null},omimId:{type:String,default:null},linksToShow:{type:Array,default:()=>[]}},setup(e){const t=(e,t,a)=>{if(!e)return null;const i="HGNC"===t?"HGNC:":"OMIM"===t?"OMIM:":"";return a&&!e.startsWith(i)?`${i}${e}`:!a&&e.startsWith(i)?e.replace(i,""):e},a={clingen:()=>{const a=t(e.hgncId,"HGNC",!0);return a?`https://search.clinicalgenome.org/kb/genes/${a}`:null},gencc:()=>{const a=t(e.hgncId,"HGNC",!0);return a?`https://search.thegencc.org/genes/${a}`:null},omim:()=>{const a=t(e.omimId,"OMIM",!1);return a?`https://www.omim.org/entry/${a}`:null},search_omim:()=>e.geneSymbol?`https://www.omim.org/search?index=entry&start=1&limit=10&sort=score+desc%2C+prefix_sort+desc&search=${e.geneSymbol}`:null},n=(0,i.Fl)((()=>e.linksToShow.map((e=>{const t=a[e]?a[e]():null;return{name:e,url:t}})).filter((e=>e.url)))),r=e=>{e&&window.open(e,"_blank")};return{activeLinks:n,goToLink:r}}});const W=(0,m.Z)(j,[["render",U],["__scopeId","data-v-7939178d"]]);var I=W,S={components:{GeneDetailCard:s.Z,PrecurationForm:w,CurationForm:C,GeneLinkChips:I},props:{item:{type:Object,required:!0},open:{type:Boolean,required:!0},context:{type:String,default:"gene"}},emits:["close"],setup(e,{emit:t}){const a=(0,l.iH)(e.open),n=(0,l.iH)({...e.item}),r=(0,l.iH)(!0),o=(0,l.iH)(!0),s=(0,l.iH)(!1),c=(0,l.iH)(0),u=(0,l.iH)(!1),p=(0,l.iH)(""),m=(0,l.iH)(""),h=(0,l.iH)("success"),w=(e,t,a="success")=>{m.value=e,p.value=t,h.value=a,u.value=!0};(0,i.m0)((()=>{a.value=e.open,n.value={...e.item}}));const g=(0,l.iH)(null),b=t=>{"precuration"===e.context?f():(g.value=t,s.value=!0,c.value=1)},f=()=>t("close"),v=async()=>{try{const e=await(0,d.ds)(n.value.hgnc_id||n.value.approved_symbol);e?(s.value=!0,c.value=1):(s.value=!1,c.value=0)}catch(e){w("Error checking existing curation: "+e.message,"error")}},y=(0,l.iH)(null),k=e=>{y.value=e},D=(0,i.Fl)((()=>"curation"===e.context?"Curation":"precuration"===e.context?"Precuration":"Gene Curation"));(0,i.YP)((()=>e.open),(async e=>{e&&await _()}));const _=async()=>{"precuration"===e.context?(r.value=!1,o.value=!0,s.value=!1,c.value=0):"curation"===e.context?(r.value=!1,o.value=!1,await v(),c.value=s.value?1:0):await v()};return(0,i.YP)((()=>e.open),(e=>{e&&_()})),{initializeModal:_,isOpen:a,editedItem:n,close:f,handlePrecurationAccepted:b,showGeneDetailCard:r,showPreCurationTab:o,showCurationTab:s,tab:c,showSnackbar:w,snackbarVisible:u,snackbarMessage:p,snackbarTitle:m,snackbarColor:h,title:D,handleGeneDataLoaded:k,geneData:y,precurationDetails:g}}};const P=(0,m.Z)(S,[["render",o],["__scopeId","data-v-6a0fdd7e"]]);var O=P},7385:function(e,t,a){a.d(t,{Z:function(){return p}});var i=a(3396),n=a(7139);const r={key:0},o={key:1};function l(e,t,a,l,s,c){const u=(0,i.up)("v-tooltip"),d=(0,i.up)("router-link"),p=(0,i.up)("v-data-table"),m=(0,i.up)("v-pagination"),h=(0,i.up)("v-container");return(0,i.wg)(),(0,i.j4)(h,null,{default:(0,i.w5)((()=>[(0,i.Wm)(p,{headers:a.headers,items:a.items,"items-per-page":l.itemsPerPage,"onUpdate:itemsPerPage":t[0]||(t[0]=e=>l.itemsPerPage=e),"server-items-length":a.totalItems,loading:a.loading,class:"elevation-1",density:"compact"},(0,i.Nv)({_:2},[(0,i.Ko)(a.headers,(e=>({name:`header.${e.value}`,fn:(0,i.w5)((({header:t})=>[(0,i._)("span",null,(0,n.zw)(e.title),1),e.description?((0,i.wg)(),(0,i.j4)(u,{key:0,header:t,activator:"parent",location:"top"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(e.description),1)])),_:2},1032,["header"])):(0,i.kq)("",!0)]))}))),(0,i.Ko)(a.config.columns,(t=>({name:`item.${t.name}`,fn:(0,i.w5)((({item:a})=>["text"===t.type?((0,i.wg)(),(0,i.iD)("div",r,(0,n.zw)(a[t.name]),1)):"date"===t.type?((0,i.wg)(),(0,i.iD)("div",o,(0,n.zw)(l.formatTimestamp(a[t.name])),1)):"link"===t.type?((0,i.wg)(),(0,i.j4)(d,{key:2,to:t.to(a)},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(a[t.name]),1)])),_:2},1032,["to"])):"slot"===t.type?(0,i.WI)(e.$slots,t.slotName,{key:3,item:a}):(0,i.kq)("",!0)]))})))]),1032,["headers","items","items-per-page","server-items-length","loading"]),(0,i.WI)(e.$slots,"modal"),(0,i.Wm)(m,{modelValue:l.page,"onUpdate:modelValue":t[1]||(t[1]=e=>l.page=e),length:l.totalPages,"onUpdate:page":t[2]||(t[2]=t=>e.$emit("update-page",l.page))},null,8,["modelValue","length"])])),_:3})}var s=a(4870),c={props:{headers:Array,items:Array,config:Object,totalItems:Number,loading:Boolean},setup(e,{emit:t}){const a=(0,s.iH)(1),n=(0,s.iH)(10),r=(0,i.Fl)((()=>Math.ceil(e.totalItems/n.value))),o=e=>{if(!e)return"";const t=new Date(1e3*e.seconds);return t.toLocaleDateString()};return(0,i.YP)(a,(()=>{t("page-changed",a.value)})),(0,i.YP)(n,(()=>{t("items-per-page-changed",n.value)})),{page:a,itemsPerPage:n,totalPages:r,formatTimestamp:o}}},u=a(89);const d=(0,u.Z)(c,[["render",l]]);var p=d},4936:function(e,t,a){a.d(t,{Z:function(){return h}});var i=a(3396),n=a(7139);const r=["title"],o=["innerHTML"];function l(e,t,a,l,s,c){const u=(0,i.up)("v-card-title"),d=(0,i.up)("v-tooltip"),p=(0,i.up)("v-table"),m=(0,i.up)("v-card-text"),h=(0,i.up)("v-card"),w=(0,i.up)("v-alert"),g=(0,i.up)("v-container");return(0,i.wg)(),(0,i.j4)(g,null,{default:(0,i.w5)((()=>[l.gene?((0,i.wg)(),(0,i.j4)(h,{key:0,class:"mx-auto my-4","max-width":"800"},{default:(0,i.w5)((()=>[a.showTitle?((0,i.wg)(),(0,i.j4)(u,{key:0,class:"headline"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(l.gene.approved_symbol),1)])),_:1})):(0,i.kq)("",!0),(0,i.Wm)(m,null,{default:(0,i.w5)((()=>[(0,i.Wm)(p,{dense:""},{default:(0,i.w5)((()=>[(0,i._)("tbody",null,[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(l.filteredGeneDetails,((e,t)=>((0,i.wg)(),(0,i.iD)("tr",{key:t},[(0,i._)("td",null,[(0,i._)("strong",null,[(0,i._)("span",{class:"label-hover",title:e.description},(0,n.zw)(e.label),9,r),(0,i.Wm)(d,{activator:"parent",location:"start"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(e.description),1)])),_:2},1024)])]),(0,i._)("td",{innerHTML:e.formattedValue},null,8,o)])))),128))])])),_:1})])),_:1})])),_:1})):((0,i.wg)(),(0,i.j4)(w,{key:1,type:"error"},{default:(0,i.w5)((()=>[(0,i.Uk)(" Gene not found or failed to load. ")])),_:1}))])),_:1})}var s=a(4870),c=a(3191),u=a(4232),d={props:{id:String,visibilityScope:{type:String,default:"standardView"},showTitle:{type:Boolean,default:!0}},setup(e,{emit:t}){const a=(0,s.iH)(null);(0,i.bv)((async()=>{if(e.id)try{const i=await(0,c.Xu)(e.id);a.value=i,t("gene-data-loaded",i)}catch(i){console.error("Error fetching gene:",i.message)}}));const n=(0,i.Fl)((()=>a.value?Object.entries(u.Wk).filter((([,t])=>t.visibility[e.visibilityScope])).map((([e,t])=>{const i=a.value[e];return{label:t.label,description:t.description||"",formattedValue:r(i,t)}})):[]));function r(e,t){if(null==e)return"N/A";switch(t.format){case"date":return new Date(1e3*e.seconds).toLocaleDateString();case"number":return parseFloat(e).toFixed(2);case"array":return e.join(", ");case"map":return Object.entries(e).map((([e,t])=>`${e}: ${t}`)).join(", ");case"text":return e;default:return JSON.stringify(e)}}return{gene:a,filteredGeneDetails:n}}},p=a(89);const m=(0,p.Z)(d,[["render",l],["__scopeId","data-v-bfca4502"]]);var h=m}}]);
//# sourceMappingURL=600.0cdd01a4.js.map