const t=(r,n="USD")=>{if(r==null||r==="")return"";const e=typeof r=="string"?parseFloat(r):r;return isNaN(e)?"":new Intl.NumberFormat("en-US",{style:"currency",currency:n}).format(e)};export{t as f};
