(self["webpackChunkgene_curator"]=self["webpackChunkgene_curator"]||[]).push([[191],{6026:function(e,t,i){var r,n,a;i(8858),i(1318),i(3228),i(560),function(i,o){n=[],r=o,a="function"===typeof r?r.apply(t,n):r,void 0===a||(e.exports=a)}(0,(function e(){"use strict";var t="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==t?t:{},i=!t.document&&!!t.postMessage,r=t.IS_PAPA_WORKER||!1,n={},a=0,o={parse:function(i,r){var s=(r=r||{}).dynamicTyping||!1;if(v(s)&&(r.dynamicTypingFunction=s,s={}),r.dynamicTyping=s,r.transform=!!v(r.transform)&&r.transform,r.worker&&o.WORKERS_SUPPORTED){var d=function(){if(!o.WORKERS_SUPPORTED)return!1;var i,r,s=(i=t.URL||t.webkitURL||null,r=e.toString(),o.BLOB_URL||(o.BLOB_URL=i.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",r,")();"],{type:"text/javascript"})))),d=new t.Worker(s);return d.onmessage=w,d.id=a++,n[d.id]=d}();return d.userStep=r.step,d.userChunk=r.chunk,d.userComplete=r.complete,d.userError=r.error,r.step=v(r.step),r.chunk=v(r.chunk),r.complete=v(r.complete),r.error=v(r.error),delete r.worker,void d.postMessage({input:i,config:r,workerId:d.id})}var h=null;return o.NODE_STREAM_INPUT,"string"==typeof i?(i=function(e){return 65279===e.charCodeAt(0)?e.slice(1):e}(i),h=r.download?new l(r):new u(r)):!0===i.readable&&v(i.read)&&v(i.on)?h=new f(r):(t.File&&i instanceof File||i instanceof Object)&&(h=new c(r)),h.stream(i)},unparse:function(e,t){var i=!1,r=!0,n=",",a="\r\n",s='"',d=s+s,l=!1,c=null,u=!1;!function(){if("object"==typeof t){if("string"!=typeof t.delimiter||o.BAD_DELIMITERS.filter((function(e){return-1!==t.delimiter.indexOf(e)})).length||(n=t.delimiter),("boolean"==typeof t.quotes||"function"==typeof t.quotes||Array.isArray(t.quotes))&&(i=t.quotes),"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(l=t.skipEmptyLines),"string"==typeof t.newline&&(a=t.newline),"string"==typeof t.quoteChar&&(s=t.quoteChar),"boolean"==typeof t.header&&(r=t.header),Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");c=t.columns}void 0!==t.escapeChar&&(d=t.escapeChar+s),("boolean"==typeof t.escapeFormulae||t.escapeFormulae instanceof RegExp)&&(u=t.escapeFormulae instanceof RegExp?t.escapeFormulae:/^[=+\-@\t\r].*$/)}}();var f=new RegExp(p(s),"g");if("string"==typeof e&&(e=JSON.parse(e)),Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return h(null,e,l);if("object"==typeof e[0])return h(c||Object.keys(e[0]),e,l)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields||c),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:"object"==typeof e.data[0]?Object.keys(e.data[0]):[]),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),h(e.fields||[],e.data||[],l);throw new Error("Unable to serialize unrecognized input");function h(e,t,i){var o="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var s=Array.isArray(e)&&0<e.length,d=!Array.isArray(t[0]);if(s&&r){for(var l=0;l<e.length;l++)0<l&&(o+=n),o+=m(e[l],l);0<t.length&&(o+=a)}for(var c=0;c<t.length;c++){var u=s?e.length:t[c].length,f=!1,h=s?0===Object.keys(t[c]).length:0===t[c].length;if(i&&!s&&(f="greedy"===i?""===t[c].join("").trim():1===t[c].length&&0===t[c][0].length),"greedy"===i&&s){for(var p=[],w=0;w<u;w++){var g=d?e[w]:w;p.push(t[c][g])}f=""===p.join("").trim()}if(!f){for(var b=0;b<u;b++){0<b&&!h&&(o+=n);var y=s&&d?e[b]:b;o+=m(t[c][y],b)}c<t.length-1&&(!i||0<u&&!h)&&(o+=a)}}return o}function m(e,t){if(null==e)return"";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);var r=!1;u&&"string"==typeof e&&u.test(e)&&(e="'"+e,r=!0);var a=e.toString().replace(f,d);return(r=r||!0===i||"function"==typeof i&&i(e,t)||Array.isArray(i)&&i[t]||function(e,t){for(var i=0;i<t.length;i++)if(-1<e.indexOf(t[i]))return!0;return!1}(a,o.BAD_DELIMITERS)||-1<a.indexOf(n)||" "===a.charAt(0)||" "===a.charAt(a.length-1))?s+a+s:a}}};if(o.RECORD_SEP=String.fromCharCode(30),o.UNIT_SEP=String.fromCharCode(31),o.BYTE_ORDER_MARK="\ufeff",o.BAD_DELIMITERS=["\r","\n",'"',o.BYTE_ORDER_MARK],o.WORKERS_SUPPORTED=!i&&!!t.Worker,o.NODE_STREAM_INPUT=1,o.LocalChunkSize=10485760,o.RemoteChunkSize=5242880,o.DefaultDelimiter=",",o.Parser=m,o.ParserHandle=h,o.NetworkStreamer=l,o.FileStreamer=c,o.StringStreamer=u,o.ReadableStreamStreamer=f,t.jQuery){var s=t.jQuery;s.fn.parse=function(e){var i=e.config||{},r=[];return this.each((function(e){if("INPUT"!==s(this).prop("tagName").toUpperCase()||"file"!==s(this).attr("type").toLowerCase()||!t.FileReader||!this.files||0===this.files.length)return!0;for(var n=0;n<this.files.length;n++)r.push({file:this.files[n],inputElem:this,instanceConfig:s.extend({},i)})})),n(),this;function n(){if(0!==r.length){var t,i,n,d,l=r[0];if(v(e.before)){var c=e.before(l.file,l.inputElem);if("object"==typeof c){if("abort"===c.action)return t="AbortError",i=l.file,n=l.inputElem,d=c.reason,void(v(e.error)&&e.error({name:t},i,n,d));if("skip"===c.action)return void a();"object"==typeof c.config&&(l.instanceConfig=s.extend(l.instanceConfig,c.config))}else if("skip"===c)return void a()}var u=l.instanceConfig.complete;l.instanceConfig.complete=function(e){v(u)&&u(e,l.file,l.inputElem),a()},o.parse(l.file,l.instanceConfig)}else v(e.complete)&&e.complete()}function a(){r.splice(0,1),n()}}}function d(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=y(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null),this._handle=new h(t),(this._handle.streamer=this)._config=t}.call(this,e),this.parseChunk=function(e,i){if(this.isFirstChunk&&v(this._config.beforeFirstChunk)){var n=this._config.beforeFirstChunk(e);void 0!==n&&(e=n)}this.isFirstChunk=!1,this._halted=!1;var a=this._partialLine+e;this._partialLine="";var s=this._handle.parse(a,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var d=s.meta.cursor;this._finished||(this._partialLine=a.substring(d-this._baseIndex),this._baseIndex=d),s&&s.data&&(this._rowCount+=s.data.length);var l=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(r)t.postMessage({results:s,workerId:o.WORKER_ID,finished:l});else if(v(this._config.chunk)&&!i){if(this._config.chunk(s,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);s=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(s.data),this._completeResults.errors=this._completeResults.errors.concat(s.errors),this._completeResults.meta=s.meta),this._completed||!l||!v(this._config.complete)||s&&s.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),l||s&&s.meta.paused||this._nextChunk(),s}this._halted=!0},this._sendError=function(e){v(this._config.error)?this._config.error(e):r&&this._config.error&&t.postMessage({workerId:o.WORKER_ID,error:e,finished:!1})}}function l(e){var t;(e=e||{}).chunkSize||(e.chunkSize=o.RemoteChunkSize),d.call(this,e),this._nextChunk=i?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(t=new XMLHttpRequest,this._config.withCredentials&&(t.withCredentials=this._config.withCredentials),i||(t.onload=_(this._chunkLoaded,this),t.onerror=_(this._chunkError,this)),t.open(this._config.downloadRequestBody?"POST":"GET",this._input,!i),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var r in e)t.setRequestHeader(r,e[r])}if(this._config.chunkSize){var n=this._start+this._config.chunkSize-1;t.setRequestHeader("Range","bytes="+this._start+"-"+n)}try{t.send(this._config.downloadRequestBody)}catch(e){this._chunkError(e.message)}i&&0===t.status&&this._chunkError()}},this._chunkLoaded=function(){4===t.readyState&&(t.status<200||400<=t.status?this._chunkError():(this._start+=this._config.chunkSize?this._config.chunkSize:t.responseText.length,this._finished=!this._config.chunkSize||this._start>=function(e){var t=e.getResponseHeader("Content-Range");return null===t?-1:parseInt(t.substring(t.lastIndexOf("/")+1))}(t),this.parseChunk(t.responseText)))},this._chunkError=function(e){var i=t.statusText||e;this._sendError(new Error(i))}}function c(e){var t,i;(e=e||{}).chunkSize||(e.chunkSize=o.LocalChunkSize),d.call(this,e);var r="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,i=e.slice||e.webkitSlice||e.mozSlice,r?((t=new FileReader).onload=_(this._chunkLoaded,this),t.onerror=_(this._chunkError,this)):t=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var n=Math.min(this._start+this._config.chunkSize,this._input.size);e=i.call(e,this._start,n)}var a=t.readAsText(e,this._config.encoding);r||this._chunkLoaded({target:{result:a}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(t.error)}}function u(e){var t;d.call(this,e=e||{}),this.stream=function(e){return t=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e,i=this._config.chunkSize;return i?(e=t.substring(0,i),t=t.substring(i)):(e=t,t=""),this._finished=!t,this.parseChunk(e)}}}function f(e){d.call(this,e=e||{});var t=[],i=!0,r=!1;this.pause=function(){d.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){d.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){r&&1===t.length&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):i=!0},this._streamData=_((function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),i&&(i=!1,this._checkIsFinished(),this.parseChunk(t.shift()))}catch(e){this._streamError(e)}}),this),this._streamError=_((function(e){this._streamCleanUp(),this._sendError(e)}),this),this._streamEnd=_((function(){this._streamCleanUp(),r=!0,this._streamData("")}),this),this._streamCleanUp=_((function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)}),this)}function h(e){var t,i,r,n=Math.pow(2,53),a=-n,s=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,d=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,l=this,c=0,u=0,f=!1,h=!1,w=[],g={data:[],errors:[],meta:{}};if(v(e.step)){var b=e.step;e.step=function(t){if(g=t,k())V();else{if(V(),0===g.data.length)return;c+=t.data.length,e.preview&&c>e.preview?i.abort():(g.data=g.data[0],b(g,l))}}}function _(t){return"greedy"===e.skipEmptyLines?""===t.join("").trim():1===t.length&&0===t[0].length}function V(){return g&&r&&(x("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+o.DefaultDelimiter+"'"),r=!1),e.skipEmptyLines&&(g.data=g.data.filter((function(e){return!_(e)}))),k()&&function(){if(g)if(Array.isArray(g.data[0])){for(var t=0;k()&&t<g.data.length;t++)g.data[t].forEach(i);g.data.splice(0,1)}else g.data.forEach(i);function i(t,i){v(e.transformHeader)&&(t=e.transformHeader(t,i)),w.push(t)}}(),function(){if(!g||!e.header&&!e.dynamicTyping&&!e.transform)return g;function t(t,i){var r,n=e.header?{}:[];for(r=0;r<t.length;r++){var a=r,o=t[r];e.header&&(a=r>=w.length?"__parsed_extra":w[r]),e.transform&&(o=e.transform(o,a)),o=C(a,o),"__parsed_extra"===a?(n[a]=n[a]||[],n[a].push(o)):n[a]=o}return e.header&&(r>w.length?x("FieldMismatch","TooManyFields","Too many fields: expected "+w.length+" fields but parsed "+r,u+i):r<w.length&&x("FieldMismatch","TooFewFields","Too few fields: expected "+w.length+" fields but parsed "+r,u+i)),n}var i=1;return!g.data.length||Array.isArray(g.data[0])?(g.data=g.data.map(t),i=g.data.length):g.data=t(g.data,0),e.header&&g.meta&&(g.meta.fields=w),u+=i,g}()}function k(){return e.header&&0===w.length}function C(t,i){return r=t,e.dynamicTypingFunction&&void 0===e.dynamicTyping[r]&&(e.dynamicTyping[r]=e.dynamicTypingFunction(r)),!0===(e.dynamicTyping[r]||e.dynamicTyping)?"true"===i||"TRUE"===i||"false"!==i&&"FALSE"!==i&&(function(e){if(s.test(e)){var t=parseFloat(e);if(a<t&&t<n)return!0}return!1}(i)?parseFloat(i):d.test(i)?new Date(i):""===i?null:i):i;var r}function x(e,t,i,r){var n={type:e,code:t,message:i};void 0!==r&&(n.row=r),g.errors.push(n)}this.parse=function(n,a,s){var d=e.quoteChar||'"';if(e.newline||(e.newline=function(e,t){e=e.substring(0,1048576);var i=new RegExp(p(t)+"([^]*?)"+p(t),"gm"),r=(e=e.replace(i,"")).split("\r"),n=e.split("\n"),a=1<n.length&&n[0].length<r[0].length;if(1===r.length||a)return"\n";for(var o=0,s=0;s<r.length;s++)"\n"===r[s][0]&&o++;return o>=r.length/2?"\r\n":"\r"}(n,d)),r=!1,e.delimiter)v(e.delimiter)&&(e.delimiter=e.delimiter(n),g.meta.delimiter=e.delimiter);else{var l=function(t,i,r,n,a){var s,d,l,c;a=a||[",","\t","|",";",o.RECORD_SEP,o.UNIT_SEP];for(var u=0;u<a.length;u++){var f=a[u],h=0,p=0,w=0;l=void 0;for(var g=new m({comments:n,delimiter:f,newline:i,preview:10}).parse(t),b=0;b<g.data.length;b++)if(r&&_(g.data[b]))w++;else{var y=g.data[b].length;p+=y,void 0!==l?0<y&&(h+=Math.abs(y-l),l=y):l=y}0<g.data.length&&(p/=g.data.length-w),(void 0===d||h<=d)&&(void 0===c||c<p)&&1.99<p&&(d=h,s=f,c=p)}return{successful:!!(e.delimiter=s),bestDelimiter:s}}(n,e.newline,e.skipEmptyLines,e.comments,e.delimitersToGuess);l.successful?e.delimiter=l.bestDelimiter:(r=!0,e.delimiter=o.DefaultDelimiter),g.meta.delimiter=e.delimiter}var c=y(e);return e.preview&&e.header&&c.preview++,t=n,i=new m(c),g=i.parse(t,a,s),V(),f?{meta:{paused:!0}}:g||{meta:{paused:!1}}},this.paused=function(){return f},this.pause=function(){f=!0,i.abort(),t=v(e.chunk)?"":t.substring(i.getCharIndex())},this.resume=function(){l.streamer._halted?(f=!1,l.streamer.parseChunk(t,!0)):setTimeout(l.resume,3)},this.aborted=function(){return h},this.abort=function(){h=!0,i.abort(),g.meta.aborted=!0,v(e.complete)&&e.complete(g),t=""}}function p(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function m(e){var t,i=(e=e||{}).delimiter,r=e.newline,n=e.comments,a=e.step,s=e.preview,d=e.fastMode,l=t=void 0===e.quoteChar||null===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(l=e.escapeChar),("string"!=typeof i||-1<o.BAD_DELIMITERS.indexOf(i))&&(i=","),n===i)throw new Error("Comment character same as delimiter");!0===n?n="#":("string"!=typeof n||-1<o.BAD_DELIMITERS.indexOf(n))&&(n=!1),"\n"!==r&&"\r"!==r&&"\r\n"!==r&&(r="\n");var c=0,u=!1;this.parse=function(o,f,h){if("string"!=typeof o)throw new Error("Input must be a string");var m=o.length,w=i.length,g=r.length,b=n.length,y=v(a),_=[],V=[],k=[],C=c=0;if(!o)return K();if(e.header&&!f){var x=o.split(r)[0].split(i),E=[],S={},R=!1;for(var I in x){var A=x[I];v(e.transformHeader)&&(A=e.transformHeader(A,I));var D=A,O=S[A]||0;for(0<O&&(R=!0,D=A+"_"+O),S[A]=O+1;E.includes(D);)D=D+"_"+O;E.push(D)}if(R){var T=o.split(r);T[0]=E.join(i),o=T.join(r)}}if(d||!1!==d&&-1===o.indexOf(t)){for(var M=o.split(r),P=0;P<M.length;P++){if(k=M[P],c+=k.length,P!==M.length-1)c+=r.length;else if(h)return K();if(!n||k.substring(0,b)!==n){if(y){if(_=[],z(k.split(i)),W(),u)return K()}else z(k.split(i));if(s&&s<=P)return _=_.slice(0,s),K(!0)}}return K()}for(var L=o.indexOf(i,c),F=o.indexOf(r,c),U=new RegExp(p(l)+p(t),"g"),q=o.indexOf(t,c);;)if(o[c]!==t)if(n&&0===k.length&&o.substring(c,c+b)===n){if(-1===F)return K();c=F+g,F=o.indexOf(r,c),L=o.indexOf(i,c)}else if(-1!==L&&(L<F||-1===F))k.push(o.substring(c,L)),c=L+w,L=o.indexOf(i,c);else{if(-1===F)break;if(k.push(o.substring(c,F)),B(F+g),y&&(W(),u))return K();if(s&&_.length>=s)return K(!0)}else for(q=c,c++;;){if(-1===(q=o.indexOf(t,q+1)))return h||V.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:_.length,index:c}),H();if(q===m-1)return H(o.substring(c,q).replace(U,t));if(t!==l||o[q+1]!==l){if(t===l||0===q||o[q-1]!==l){-1!==L&&L<q+1&&(L=o.indexOf(i,q+1)),-1!==F&&F<q+1&&(F=o.indexOf(r,q+1));var G=N(-1===F?L:Math.min(L,F));if(o.substr(q+1+G,w)===i){k.push(o.substring(c,q).replace(U,t)),o[c=q+1+G+w]!==t&&(q=o.indexOf(t,c)),L=o.indexOf(i,c),F=o.indexOf(r,c);break}var j=N(F);if(o.substring(q+1+j,q+1+j+g)===r){if(k.push(o.substring(c,q).replace(U,t)),B(q+1+j+g),L=o.indexOf(i,c),q=o.indexOf(t,c),y&&(W(),u))return K();if(s&&_.length>=s)return K(!0);break}V.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:_.length,index:c}),q++}}else q++}return H();function z(e){_.push(e),C=c}function N(e){var t=0;if(-1!==e){var i=o.substring(q+1,e);i&&""===i.trim()&&(t=i.length)}return t}function H(e){return h||(void 0===e&&(e=o.substring(c)),k.push(e),c=m,z(k),y&&W()),K()}function B(e){c=e,z(k),k=[],F=o.indexOf(r,c)}function K(e){return{data:_,errors:V,meta:{delimiter:i,linebreak:r,aborted:u,truncated:!!e,cursor:C+(f||0)}}}function W(){a(K()),_=[],V=[]}},this.abort=function(){u=!0},this.getCharIndex=function(){return c}}function w(e){var t=e.data,i=n[t.workerId],r=!1;if(t.error)i.userError(t.error,t.file);else if(t.results&&t.results.data){var a={abort:function(){r=!0,g(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:b,resume:b};if(v(i.userStep)){for(var o=0;o<t.results.data.length&&(i.userStep({data:t.results.data[o],errors:t.results.errors,meta:t.results.meta},a),!r);o++);delete t.results}else v(i.userChunk)&&(i.userChunk(t.results,a,t.file),delete t.results)}t.finished&&!r&&g(t.workerId,t.results)}function g(e,t){var i=n[e];v(i.userComplete)&&i.userComplete(t),i.terminate(),delete n[e]}function b(){throw new Error("Not implemented.")}function y(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var i in e)t[i]=y(e[i]);return t}function _(e,t){return function(){e.apply(t,arguments)}}function v(e){return"function"==typeof e}return r&&(t.onmessage=function(e){var i=e.data;if(void 0===o.WORKER_ID&&i&&(o.WORKER_ID=i.workerId),"string"==typeof i.input)t.postMessage({workerId:o.WORKER_ID,results:o.parse(i.input,i.config),finished:!0});else if(t.File&&i.input instanceof File||i.input instanceof Object){var r=o.parse(i.input,i.config);r&&t.postMessage({workerId:o.WORKER_ID,results:r,finished:!0})}}),(l.prototype=Object.create(d.prototype)).constructor=l,(c.prototype=Object.create(d.prototype)).constructor=c,(u.prototype=Object.create(u.prototype)).constructor=u,(f.prototype=Object.create(d.prototype)).constructor=f,o}))},9546:function(e,t,i){"use strict";i.d(t,{U:function(){return n}});var r=i(862);const n={approved_symbol:{label:"Approved Symbol",format:"text",description:"The official symbol for the gene as provided by HGNC.",visibility:{tableView:!0,standardView:!0,curationView:!0},style:{curationView:"text-field"},group:{name:"Entity Information",order:1},required:!0},hgnc_id:{label:"HGNC ID",format:"text",description:"Unique identifier for the gene provided by the HGNC.",visibility:{tableView:!1,standardView:!1,curationView:!1},style:{curationView:"text-field"},group:{name:"Entity Information",order:1},required:!0},disease:{label:"Disease",format:"text",description:"MONDO identifier for the disease associated with the gene.",visibility:{tableView:!0,standardView:!0,curationView:!0},style:{curationView:"text-field"},group:{name:"Entity Information",order:1},required:!0},inheritance:{label:"Inheritance",format:"text",options:[{value:"HP:0000006",title:"Autosomal dominant"},{value:"HP:0000007",title:"Autosomal recessive"},{value:"HP:0001417",title:"X-linked other"},{value:"HP:0001419",title:"X-linked recessive"},{value:"HP:0001423",title:"X-linked dominant"},{value:"HP:0001427",title:"Mitochondrial"},{value:"HP:0001428",title:"Somatic mutation"}],description:"Type of inheritance pattern observed for the gene-related conditions.",visibility:{tableView:!0,standardView:!0,curationView:!0},style:{curationView:"select"},group:{name:"Entity Information",order:1},required:!0},variants:{label:"Genetic evidence",format:"number",description:"Points for genetic data. Give 0.5 points per LP/P variant in ClinVar.",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"number-field"},min:0,max:12,step:.5,group:{name:"Points",order:2}},models:{label:"Models",format:"number",description:"Points for animal or cellular models studied. Two points if MGI Phenotype and MOI fit, if only phenotype fits, give 1 point.",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"number-field"},min:0,max:2,step:.5,group:{name:"Points",order:2}},functional:{label:"Functional",format:"number",description:"Points for functional categories: Just add interaction_score and expression_score if available.",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"number-field"},min:0,max:2,step:.5,group:{name:"Points",order:2}},rescue:{label:"Rescue",format:"number",description:"Points for rescue experiments performed. Research in literature if necessary.",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"number-field"},min:0,max:2,step:.5,group:{name:"Points",order:2}},replication:{label:"Replication",format:"text",description:"References to replication studies after the initial clinical report.",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"text-field"},group:{name:"Points",order:2}},clinical:{label:"Clinical Group",format:"array",options:["complement_mediated_kidney_diseases","congenital_anomalies_of_the_kidney_and_urinary_tract","glomerulopathy","kidney_cystic_and_ciliopathy_disorders","tubulopathy","tubulointerstitial_disease","hereditary_cancer","nephrocalcinosis_or_nephrolithiasis"],description:"Clinical categorization of the entity.",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"select"},group:{name:"Groups",order:3}},onset:{label:"Onset Group",format:"array",options:["adult","neonatal_or_pediatric","antenatal_or_congenital"],description:"Classifications of the onset group for the entity.",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"select"},group:{name:"Groups",order:3}},syndromic:{label:"Syndromic",format:"text",options:["syndromic","non_syndromic"],description:"Indicates if the entity is part of a syndromic group.",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"select"},group:{name:"Groups",order:3}},kidneyDisease:{label:"Kidney Disease Association",format:"text",options:["yes","no","unclear"],description:"Indicates if this entity is associated with kidney disease.",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"select"},group:{name:"Other",order:4},required:!0},diseaseEquality:{label:"Disease Equality",format:"text",description:"Identifiers for diseases that are equivalent to the curated disease (e.g. from OMIM).",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"text-field"},group:{name:"Other",order:4}},geneReviews:{label:"GeneReviews Article",format:"text",description:"References to GeneReviews articles related to the gene.",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"text-field"},group:{name:"Other",order:4}},comment:{label:"Comment",format:"text",description:"Curator’s comment about this curated entity.",visibility:{tableView:!1,standardView:!1,curationView:!0},style:{curationView:"text-field"},group:{name:"Verdict",order:5}},decision:{label:"Verdict",format:"text",options:["Definitive","Strong","Moderate","Limited","Refuted"],description:'The decision made during curation, such as "Definitive" or "Refuted".',visibility:{tableView:!0,standardView:!0,curationView:!0},style:{curationView:"select"},group:{name:"Verdict",order:5},required:!0},createdAt:{label:"Created At",format:"date",description:"The date and time when the curation record was created.",visibility:{tableView:!1,standardView:!0,curationView:!1},group:{name:"Metadata",order:6}},updatedAt:{label:"Updated At",format:"date",description:"The date and time when the curation record was last updated.",visibility:{tableView:!1,standardView:!0,curationView:!1},group:{name:"Metadata",order:6}},workflowConfigVersionUsed:{label:"Workflow Config Version Used",format:"text",description:"The version of the workflow configuration used to curate this entity.",visibility:{tableView:!1,standardView:!1,curationView:!1},group:{name:"Metadata",order:6}},workflowConfigNameUsed:{label:"Workflow Config Name Used",format:"text",description:"The name of the workflow configuration used to curate this entity.",visibility:{tableView:!1,standardView:!1,curationView:!1},group:{name:"Metadata",order:6}},users:{label:"Users",format:"array",description:"A list of user identifiers who have worked on this curation record.",visibility:{tableView:!1,standardView:!0,curationView:!1},group:{name:"Metadata",order:6}},approvedBy:{label:"Approved By",format:"array",description:"A list of user identifiers who have approved this curation.",visibility:{tableView:!1,standardView:!0,curationView:!1},group:{name:"Metadata",order:6}},approvedAt:{label:"Approved At",format:"date",description:"The date and time when the curation record was approved.",visibility:{tableView:!1,standardView:!0,curationView:!1},group:{name:"Metadata",order:6}},precurationDetails:{label:"Precuration Details",format:"object",description:"The details of the precuration associated with this curation.",visibility:{tableView:!1,standardView:!1,curationView:!1},group:{name:"Precuration Information",order:7},required:!0,nestedConfig:r.m}}},5083:function(e,t,i){"use strict";i.d(t,{e:function(){return r}});const r={cur_id:{label:"CUR ID",format:"text",description:"Unique identifier for the gene within the curation system.",visibility:{tableView:!1,standardView:!1,curationView:!1}},approved_symbol:{label:"Approved Symbol",format:"text",description:"The official symbol provided by HGNC.",visibility:{tableView:!0,standardView:!0,curationView:!1}},hgnc_id:{label:"HGNC ID",format:"text",description:"Unique identifier provided by the HGNC.",visibility:{tableView:!1,standardView:!0,curationView:!1}},clingen_summary:{label:"ClinGen Summary",format:"text",description:"Summary information from the ClinGen database.",visibility:{tableView:!1,standardView:!0,curationView:!0}},gencc_summary:{label:"GenCC Summary",format:"text",description:"Summary from the GenCC database.",visibility:{tableView:!1,standardView:!0,curationView:!0}},omim_summary:{label:"OMIM Summary",format:"array",separator:"|",description:"Summary information from the Online Mendelian Inheritance in Man database.",visibility:{tableView:!1,standardView:!0,curationView:!0}},clinical_groups_p:{label:"Clinical Groups",format:"text",description:"Clinical groupings based on phenotype.",visibility:{tableView:!1,standardView:!0,curationView:!0}},onset_groups_p:{label:"Onset Groups",format:"text",description:"Information on the onset groups for the gene-related conditions.",visibility:{tableView:!1,standardView:!1,curationView:!0}},syndromic_groups_p:{label:"Syndromic Groups",format:"text",description:"Information about the syndromic grouping of the gene.",visibility:{tableView:!1,standardView:!1,curationView:!0}},evidence_count:{label:"Evidence Count",format:"number",description:"Count of evidence items associated with the gene.",visibility:{tableView:!0,standardView:!0,curationView:!0}},source_count_percentile:{label:"Source Count Percentile",format:"number",description:"The percentile rank based on the count of sources mentioning the gene.",visibility:{tableView:!1,standardView:!1,curationView:!0}},clinvar:{label:"ClinVar",format:"map",separator:";",keyValueSeparator:":",description:"Data from ClinVar including pathogenicity classifications.",visibility:{tableView:!1,standardView:!0,curationView:!0}},descartes_kidney_tpm:{label:"Descartes Kidney TPM",format:"number",description:"Transcripts Per Million in kidney tissue from Descartes dataset.",visibility:{tableView:!1,standardView:!1,curationView:!1}},gtex_kidney_cortex:{label:"GTEx Kidney Cortex",format:"number",description:"Expression score from GTEx Kidney Cortex data.",visibility:{tableView:!1,standardView:!1,curationView:!1}},gtex_kidney_medulla:{label:"GTEx Kidney Medulla",format:"number",description:"Expression score from GTEx Kidney Medulla data.",visibility:{tableView:!1,standardView:!1,curationView:!1}},expression_score:{label:"Expression Score",format:"number",description:"Score based on gene expression levels.",visibility:{tableView:!1,standardView:!1,curationView:!0}},interaction_score:{label:"Interaction Score",format:"number",description:"Quantitative score representing gene interactions.",visibility:{tableView:!1,standardView:!1,curationView:!0}},lof_z:{label:"LOF Z",format:"number",description:"Loss of function Z-score.",visibility:{tableView:!1,standardView:!1,curationView:!1}},mis_z:{label:"MIS Z",format:"number",description:"Missense Z-score.",visibility:{tableView:!1,standardView:!1,curationView:!1}},oe_lof:{label:"OE LOF",format:"number",description:"Observed vs. expected loss of function score.",visibility:{tableView:!1,standardView:!1,curationView:!1}},pLI:{label:"pLI Score",format:"number",description:"Probability of being loss-of-function intolerant (pLI) score.",visibility:{tableView:!1,standardView:!0,curationView:!1}},mgi_phenotype:{label:"MGI Phenotype",format:"array",separator:";",description:"Phenotypic information from the Mouse Genome Informatics database.",visibility:{tableView:!1,standardView:!0,curationView:!0}},stringdb_interaction_normalized_score:{label:"StringDB Interaction Normalized Score",format:"number",description:"Normalized score of gene interactions from StringDB.",visibility:{tableView:!1,standardView:!1,curationView:!0}},stringdb_interaction_string:{label:"StringDB Interactions",format:"array",separator:";",description:"List of interactions from StringDB.",visibility:{tableView:!1,standardView:!1,curationView:!1}},stringdb_interaction_sum_score:{label:"StringDB Interaction Sum Score",format:"number",description:"Sum score of gene interactions from StringDB.",visibility:{tableView:!1,standardView:!1,curationView:!1}},createdAt:{label:"Created At",format:"date",description:"Timestamp of when the gene record was created.",visibility:{tableView:!1,standardView:!1,curationView:!1}},updatedAt:{label:"Updated At",format:"date",description:"The date and time when the gene record was last updated.",visibility:{tableView:!1,standardView:!0,curationView:!1}},hasPrecuration:{label:"Has Precuration",format:"boolean",description:"Indicates if the gene has been precurationed.",visibility:{tableView:!1,standardView:!1,curationView:!1}},hasCuration:{label:"Has Curation",format:"boolean",description:"Indicates if the gene has been curated.",visibility:{tableView:!1,standardView:!1,curationView:!1}}}},862:function(e,t,i){"use strict";i.d(t,{m:function(){return n}});var r=i(5083);const n={approved_symbol:{label:"Approved Symbol",format:"text",description:"The official gene symbol approved by the HGNC.",visibility:{tableView:!0,standardView:!0,curationView:!1},group:{name:"Gene Information",order:1},required:!0},hgnc_id:{label:"HGNC ID",format:"text",description:"The unique identifier for the gene provided by the HGNC.",visibility:{tableView:!1,standardView:!0,curationView:!1},group:{name:"Gene Information",order:1},required:!0},entity_assertion:{label:"Multiple Assertions",format:"boolean",description:"A value indicating whether one or more assertions about the gene were made in literature or databases.",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"switch",color:"purple",inactiveColor:"indigo"},group:{name:"Assertion",order:2},required:!0},inheritance_difference:{label:"Inheritance Difference",format:"boolean",description:"Indicates if there is a difference in inheritance patterns noted.",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"switch",color:"green",inactiveColor:"lime"},group:{name:"Assertion",order:2},required:!0},mechanism_difference:{label:"Mechanism Difference",format:"boolean",description:"Indicates if there is a difference in the molecular mechanism of pathogenicity (e.g. LOF vs. missense or haploinsufficiency vs. gain-of-function).",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"switch",color:"red",inactiveColor:"orange"},group:{name:"Assertion",order:2},required:!0},phenotypic_variability:{label:"Phenotypic Variability",format:"boolean",description:"Indicates if there is phenotypic variability associated with the gene (e.g. lump if intra familial variability is larger then inter familial variability and vice versa).",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"switch",color:"blue",inactiveColor:"cyan"},group:{name:"Assertion",order:2},required:!0},comment:{label:"Comment",format:"text",description:"Curator’s comment about the decision made regarding the gene.",visibility:{tableView:!1,standardView:!0,curationView:!0},style:{curationView:"text-field"},group:{name:"Decision",order:3}},decision:{label:"Decision",format:"text",options:["Lump","Split"],description:'The decision made during precuration, such as "lump" or "split".',visibility:{tableView:!0,standardView:!0,curationView:!0},style:{curationView:"select"},group:{name:"Decision",order:3},required:!0},createdAt:{label:"Created At",format:"date",description:"The date and time when the precuration record was created.",visibility:{tableView:!0,standardView:!0,curationView:!1},group:{name:"Metadata",order:4}},updatedAt:{label:"Updated At",format:"date",description:"The date and time when the precuration record was last updated.",visibility:{tableView:!1,standardView:!0,curationView:!1},group:{name:"Metadata",order:4}},workflowConfigVersionUsed:{label:"Workflow Config Version Used",format:"text",description:"The version of the workflow configuration used to curate this entity.",visibility:{tableView:!1,standardView:!1,curationView:!1},group:{name:"Metadata",order:4}},workflowConfigNameUsed:{label:"Workflow Config Name Used",format:"text",description:"The name of the workflow configuration used to curate this entity.",visibility:{tableView:!1,standardView:!1,curationView:!1},group:{name:"Metadata",order:4}},users:{label:"Users",format:"array",description:"A list of user identifiers who have worked on this precuration record.",visibility:{tableView:!1,standardView:!0,curationView:!1},group:{name:"Metadata",order:4}},approvedBy:{label:"Approved By",format:"array",description:"A list of user identifiers who have approved this curation.",visibility:{tableView:!1,standardView:!0,curationView:!1},group:{name:"Metadata",order:4}},approvedAt:{label:"Approved At",format:"date",description:"The date and time when the curation record was approved.",visibility:{tableView:!1,standardView:!0,curationView:!1},group:{name:"Metadata",order:4}},geneDetails:{label:"Gene Details",format:"object",description:"The details of the gene associated with this precuration.",visibility:{tableView:!1,standardView:!1,curationView:!1},group:{name:"Gene Information",order:5},required:!0,nestedConfig:r.e}}},4232:function(e,t,i){"use strict";i.d(t,{$o:function(){return d},U8:function(){return a.U},Wk:function(){return r.e},l9:function(){return s},m_:function(){return n.m},se:function(){return o}});var r=i(5083),n=i(862),a=i(9546);const o="0.2.0",s="Kidney Genetics Gene Curation",d={stages:{gene:{configFile:"geneDetailsConfig.js",version:"0.1.0",checksum:"md5-checksum-of-gene-config",nextStage:"precuration"},precuration:{configFile:"precurationDetailsConfig.js",version:"0.2.0",checksum:"md5-checksum-of-precuration-config",nextStage:"curation",prefillRules:[{source:"geneDetailsConfig",target:"precurationDetailsConfig",fields:[{sourceField:"approved_symbol",targetField:"approved_symbol"},{sourceField:"hgnc_id",targetField:"hgnc_id"}]}],decisionRules:[{conditions:["entity_assertion","inheritance_difference","mechanism_difference","phenotypic_variability"],decision:"Split",threshold:2}]},curation:{configFile:"curationDetailsConfig.js",version:"0.2.0",checksum:"md5-checksum-of-curation-config",nextStage:null,prefillRules:[{source:"geneDetailsConfig",target:"curationDetailsConfig",fields:[{sourceField:"approved_symbol",targetField:"approved_symbol"},{sourceField:"hgnc_id",targetField:"hgnc_id"}]}],multipleCurationRules:[]}},validateConfigIntegrity(){}}},3191:function(e,t,i){"use strict";i.d(t,{LM:function(){return u},TU:function(){return c},VX:function(){return d},Xu:function(){return l}});var r=i(4287),n=i(6056),a=i(6026),o=i.n(a),s=i(4232);const d=async(e=["hgnc_id","cur_id"])=>{const t=await(0,r.PL)((0,r.hJ)(n.db,"genes"));let i={};return t.forEach((t=>{if(!t.exists())throw new Error("Gene document not found");{const r=t.data(),n=e.map((e=>r[e])).join("-");i[n]={...r,docId:t.id}}})),i},l=async e=>{const t=(0,r.hJ)(n.db,"genes"),i=await(0,r.PL)(t);let a=null;if(i.forEach((t=>{const i=t.data();i.hgnc_id!==e&&i.approved_symbol!==e||(a={docId:t.id,...i})})),a)return a;throw new Error("Gene not found!")},c=async(e,t=["hgnc_id","cur_id"],i=!0)=>{try{const a=await d(t),l=o().parse(e,{header:!0}).data;let c={added:0,overwritten:0,skipped:0};for(const e of l){for(const[t,i]of Object.entries(s.Wk))void 0!==e[t]&&(e[t]=g(e[t],i));const o=t.map((t=>e[t])).join("-");if(f(e,t),a[o])if(i){const t=p(e);await(0,r.r7)((0,r.JU)(n.db,"genes",a[o].docId),t),c.overwritten++}else c.skipped++;else{const t=h(e);await(0,r.ET)((0,r.hJ)(n.db,"genes"),t),c.added++}}return`Upload Summary: ${c.added} added, ${c.overwritten} overwritten, ${c.skipped} skipped.`}catch(a){throw new Error(`Failed to process CSV: ${a.message}`)}},u=async()=>{try{if(!m())throw new Error("Unauthorized access to delete all genes.");const e=await(0,r.PL)((0,r.hJ)(n.db,"genes")),t=(0,r.qs)(n.db);e.forEach((e=>{t.delete(e.ref)})),await t.commit(),console.log(`All genes deleted by ${w()} at ${(new Date).toISOString()}`)}catch(e){throw new Error(`Failed to delete all genes: ${e.message}`)}},f=e=>{const t=["hgnc_id","cur_id"],i=t.filter((t=>!e[t]));if(i.length>0)throw new Error(`Missing required fields: ${i.join(", ")}`)},h=e=>({...e,createdAt:r.EK.fromDate(new Date)}),p=e=>({...e,lastUpdated:r.EK.fromDate(new Date)}),m=()=>!0,w=()=>"mockUserID123",g=(e,t)=>{switch(t.format){case"number":return parseFloat(e);case"date":return new Date(e);case"array":return e.split(t.separator);case"map":return e.split(t.separator).reduce(((e,i)=>{const[r,n]=i.split(t.keyValueSeparator);return e[r.trim()]=n.trim(),e}),{});default:return e}}}}]);
//# sourceMappingURL=191.c62b389d.js.map