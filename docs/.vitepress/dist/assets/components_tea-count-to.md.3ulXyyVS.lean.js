import{_ as p,l as m,o as s,c as o,F as f,G as h,p as g,m as v,J as y}from"./chunks/framework.C3jm_6gq.js";const I={class:"count-to"},V={class:"count-to-item"},N=["id"],b={__name:"TeaCountTo",props:{endVal:{type:Number,default:894151},duration:{type:Number,default:100}},setup(c){const a=c;let r=a.endVal.toString(),l=r.split("");const i=t=>"span-"+t;return m(()=>{for(let t=1;t<=l.length+1;t++){let n=document.getElementById("span-"+t);if(n){let _=function(){e++,e>d+1?(n.style.transition="none",e=0,clearInterval(u)):n.style.transition=`transform ${a.duration}ms ease-in-out`,n.style.transform=`translate(-50%,-${e/10*100-12}%)`},e=0,d=parseInt(l[t-1]),u=setInterval(_,a.duration)}}}),(t,n)=>(s(),o("div",I,[(s(!0),o(f,null,h(g(r).length,e=>(s(),o("div",V,[v("span",{id:i(e)},"0123456789",8,N)]))),256))]))}},x=p(b,[["__scopeId","data-v-b01ca623"]]),S=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"components/tea-count-to.md","filePath":"components/tea-count-to.md"}'),B={name:"components/tea-count-to.md"},$=Object.assign(B,{setup(c){return(a,r)=>(s(),o("div",null,[y(x)]))}});export{S as __pageData,$ as default};
