import{u as b}from"./product-Czh_eXPh.js";import{y as v,Y as C,a3 as D,h as i,$ as k,c as w,a as l,b as E,u as M,o as j}from"./index-DEsGlfRY.js";import{_ as z}from"./UploadFileGrid-CV1i-Ig8.js";import{u as A}from"./designResourceModel-Dk404TaA.js";const B={class:"flex flex-col gap-8"},I={class:"flex gap-6"},N={class:"w-full space-y-6"},$=v({__name:"ModelAttach",props:{id:{type:Number},design_resource_documents:{type:Array,required:!0},imageStyle:{type:String,default:""}},emits:["update:design_resource_documents","onFormatChange","update:images","add:images","delete:design_resource_documents","delete-files"],setup(r,{emit:p}){const m=b(),c=A(),{fb:u,product:U}=C(m),g=D(),f=i(`
image/*,
video/mp4,
.mp4,
.pdf,
.dwg,
.skp,
.rfa,
.max,
.zip,
.doc,
.docx,
.xls,
.xlsx,
.ppt,
.pptx,
.lcf
`),a=p,t=r;i([{url:"https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg"},{url:"https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg"},{url:"https://images.pexels.com/photos/532222/pexels-photo-532222.jpeg"}]);const _=o=>{a("update:design_resource_documents",o)},x=async o=>{console.log("uploadImages props",t.id);try{let e=o.files;if(e=e.map(s=>{let d=t.design_resource_documents.find(S=>{var n;return S.name===((n=s.file)==null?void 0:n.name)});return d&&(s.file.format=d.format),s}),t.id){const s=await c.uploadFiles(e,"models",t.id);console.log("uploadImages response",s)}}catch(e){console.error("Error uploading images:",e)}},y=o=>{console.log("deleteFiles attach model",o),a("delete-files",o)},F=async o=>{console.log("Deleting image:",o);try{a("delete:design_resource_documents",o)}catch(e){console.error("Error deleting image:",e),g.add({severity:"error",summary:"Error",detail:"Failed to delete image. Please try again.",life:3e3})}},h=o=>{a("onFormatChange",o)};return k(()=>{console.log("design_resource_documents ",t.design_resource_documents)}),(o,e)=>(j(),w("div",B,[l("div",I,[l("div",N,[e[3]||(e[3]=l("h3",{class:"text-lg font-medium border-b border-gray-200 pb-2"},"Model Attachments",-1)),E(z,{url:"/api/upload",maxFileSize:1e7,multiple:!0,imageStyle:r.imageStyle,accept:f.value,auto:!0,fb:M(u),uploadedFilesData:r.design_resource_documents,onUpload:x,"onUpdate:uploadedFilesData":_,onOnFormatChange:e[0]||(e[0]=s=>h(s)),onRemoveUploadedFile:e[1]||(e[1]=s=>F(s)),onDeleteFiles:e[2]||(e[2]=s=>y(s)),permissions:{delete:!0,copyLink:!1,show:!1,size:!1}},null,8,["imageStyle","accept","fb","uploadedFilesData"])])])]))}});export{$ as _};
