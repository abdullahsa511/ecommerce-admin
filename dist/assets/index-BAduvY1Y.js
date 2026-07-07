import{B as F,z as $,R as G,aD as H,k as A,aE as k,K,aF as T,C as N,D as Z,E as q,G as x,Z as C,H as U,I as y,aG as w,O as j,aH as W,L as V,m as u,aI as J,Q as L,M as Q,d as b,o as l,w as v,c as p,e as I,F as E,r as X,a as D,N as Y,P as M,q as S,t as _,T as z,b as P,S as g,aJ as ee,s as te,aK as B}from"./index-DEsGlfRY.js";var ne=({dt:t})=>`
.p-tieredmenu {
    background: ${t("tieredmenu.background")};
    color: ${t("tieredmenu.color")};
    border: 1px solid ${t("tieredmenu.border.color")};
    border-radius: ${t("tieredmenu.border.radius")};
    min-width: 12.5rem;
}

.p-tieredmenu-root-list,
.p-tieredmenu-submenu {
    margin: 0;
    padding: ${t("tieredmenu.list.padding")};
    list-style: none;
    outline: 0 none;
    display: flex;
    flex-direction: column;
    gap: ${t("tieredmenu.list.gap")};
}

.p-tieredmenu-submenu {
    position: absolute;
    min-width: 100%;
    z-index: 1;
    background: ${t("tieredmenu.background")};
    color: ${t("tieredmenu.color")};
    border: 1px solid ${t("tieredmenu.border.color")};
    border-radius: ${t("tieredmenu.border.radius")};
    box-shadow: ${t("tieredmenu.shadow")};
}

.p-tieredmenu-item {
    position: relative;
}

.p-tieredmenu-item-content {
    transition: background ${t("tieredmenu.transition.duration")}, color ${t("tieredmenu.transition.duration")};
    border-radius: ${t("tieredmenu.item.border.radius")};
    color: ${t("tieredmenu.item.color")};
}

.p-tieredmenu-item-link {
    cursor: pointer;
    display: flex;
    align-items: center;
    text-decoration: none;
    overflow: hidden;
    position: relative;
    color: inherit;
    padding: ${t("tieredmenu.item.padding")};
    gap: ${t("tieredmenu.item.gap")};
    user-select: none;
    outline: 0 none;
}

.p-tieredmenu-item-label {
    line-height: 1;
}

.p-tieredmenu-item-icon {
    color: ${t("tieredmenu.item.icon.color")};
}

.p-tieredmenu-submenu-icon {
    color: ${t("tieredmenu.submenu.icon.color")};
    margin-left: auto;
    font-size: ${t("tieredmenu.submenu.icon.size")};
    width: ${t("tieredmenu.submenu.icon.size")};
    height: ${t("tieredmenu.submenu.icon.size")};
}

.p-tieredmenu-submenu-icon:dir(rtl) {
    margin-left: 0;
    margin-right: auto;
}

.p-tieredmenu-item.p-focus > .p-tieredmenu-item-content {
    color: ${t("tieredmenu.item.focus.color")};
    background: ${t("tieredmenu.item.focus.background")};
}

.p-tieredmenu-item.p-focus > .p-tieredmenu-item-content .p-tieredmenu-item-icon {
    color: ${t("tieredmenu.item.icon.focus.color")};
}

.p-tieredmenu-item.p-focus > .p-tieredmenu-item-content .p-tieredmenu-submenu-icon {
    color: ${t("tieredmenu.submenu.icon.focus.color")};
}

.p-tieredmenu-item:not(.p-disabled) > .p-tieredmenu-item-content:hover {
    color: ${t("tieredmenu.item.focus.color")};
    background: ${t("tieredmenu.item.focus.background")};
}

.p-tieredmenu-item:not(.p-disabled) > .p-tieredmenu-item-content:hover .p-tieredmenu-item-icon {
    color: ${t("tieredmenu.item.icon.focus.color")};
}

.p-tieredmenu-item:not(.p-disabled) > .p-tieredmenu-item-content:hover .p-tieredmenu-submenu-icon {
    color: ${t("tieredmenu.submenu.icon.focus.color")};
}

.p-tieredmenu-item-active > .p-tieredmenu-item-content {
    color: ${t("tieredmenu.item.active.color")};
    background: ${t("tieredmenu.item.active.background")};
}

.p-tieredmenu-item-active > .p-tieredmenu-item-content .p-tieredmenu-item-icon {
    color: ${t("tieredmenu.item.icon.active.color")};
}

.p-tieredmenu-item-active > .p-tieredmenu-item-content .p-tieredmenu-submenu-icon {
    color: ${t("tieredmenu.submenu.icon.active.color")};
}

.p-tieredmenu-separator {
    border-block-start: 1px solid ${t("tieredmenu.separator.border.color")};
}

.p-tieredmenu-overlay {
    box-shadow: ${t("tieredmenu.shadow")};
}

.p-tieredmenu-enter-from,
.p-tieredmenu-leave-active {
    opacity: 0;
}

.p-tieredmenu-enter-active {
    transition: opacity 250ms;
}

.p-tieredmenu-mobile .p-tieredmenu-submenu {
    position: static;
    box-shadow: none;
    border: 0 none;
    padding-inline-start: ${t("tieredmenu.submenu.mobile.indent")};
    padding-inline-end: 0;
}

.p-tieredmenu-mobile .p-tieredmenu-submenu:dir(rtl) {
    padding-inline-start: 0;
    padding-inline-end: ${t("tieredmenu.submenu.mobile.indent")};
}

.p-tieredmenu-mobile .p-tieredmenu-submenu-icon {
    transition: transform 0.2s;
    transform: rotate(90deg);
}

.p-tieredmenu-mobile .p-tieredmenu-item-active > .p-tieredmenu-item-content .p-tieredmenu-submenu-icon {
    transform: rotate(-90deg);
}
`,ie={submenu:function(e){var n=e.instance,s=e.processedItem;return{display:n.isItemActive(s)?"flex":"none"}}},se={root:function(e){var n=e.props,s=e.instance;return["p-tieredmenu p-component",{"p-tieredmenu-overlay":n.popup,"p-tieredmenu-mobile":s.queryMatches}]},start:"p-tieredmenu-start",rootList:"p-tieredmenu-root-list",item:function(e){var n=e.instance,s=e.processedItem;return["p-tieredmenu-item",{"p-tieredmenu-item-active":n.isItemActive(s),"p-focus":n.isItemFocused(s),"p-disabled":n.isItemDisabled(s)}]},itemContent:"p-tieredmenu-item-content",itemLink:"p-tieredmenu-item-link",itemIcon:"p-tieredmenu-item-icon",itemLabel:"p-tieredmenu-item-label",submenuIcon:"p-tieredmenu-submenu-icon",submenu:"p-tieredmenu-submenu",separator:"p-tieredmenu-separator",end:"p-tieredmenu-end"},re=F.extend({name:"tieredmenu",style:ne,classes:se,inlineStyles:ie}),oe={name:"BaseTieredMenu",extends:A,props:{popup:{type:Boolean,default:!1},model:{type:Array,default:null},appendTo:{type:[String,Object],default:"body"},breakpoint:{type:String,default:"960px"},autoZIndex:{type:Boolean,default:!0},baseZIndex:{type:Number,default:0},disabled:{type:Boolean,default:!1},tabindex:{type:Number,default:0},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:re,provide:function(){return{$pcTieredMenu:this,$parentInstance:this}}},O={name:"TieredMenuSub",hostName:"TieredMenu",extends:A,emits:["item-click","item-mouseenter","item-mousemove"],container:null,props:{menuId:{type:String,default:null},focusedItemId:{type:String,default:null},items:{type:Array,default:null},visible:{type:Boolean,default:!1},level:{type:Number,default:0},templates:{type:Object,default:null},activeItemPath:{type:Object,default:null},tabindex:{type:Number,default:0}},methods:{getItemId:function(e){return"".concat(this.menuId,"_").concat(e.key)},getItemKey:function(e){return this.getItemId(e)},getItemProp:function(e,n,s){return e&&e.item?V(e.item[n],s):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},getItemLabelId:function(e){return"".concat(this.menuId,"_").concat(e.key,"_label")},getPTOptions:function(e,n,s){return this.ptm(s,{context:{item:e.item,index:n,active:this.isItemActive(e),focused:this.isItemFocused(e),disabled:this.isItemDisabled(e)}})},isItemActive:function(e){return this.activeItemPath.some(function(n){return n.key===e.key})},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemFocused:function(e){return this.focusedItemId===this.getItemId(e)},isItemGroup:function(e){return k(e.items)},onEnter:function(){J(this.container,this.level)},onItemClick:function(e,n){this.getItemProp(n,"command",{originalEvent:e,item:n.item}),this.$emit("item-click",{originalEvent:e,processedItem:n,isFocus:!0})},onItemMouseEnter:function(e,n){this.$emit("item-mouseenter",{originalEvent:e,processedItem:n})},onItemMouseMove:function(e,n){this.$emit("item-mousemove",{originalEvent:e,processedItem:n})},getAriaSetSize:function(){var e=this;return this.items.filter(function(n){return e.isItemVisible(n)&&!e.getItemProp(n,"separator")}).length},getAriaPosInset:function(e){var n=this;return e-this.items.slice(0,e).filter(function(s){return n.isItemVisible(s)&&n.getItemProp(s,"separator")}).length+1},getMenuItemProps:function(e,n){return{action:u({class:this.cx("itemLink"),tabindex:-1},this.getPTOptions(e,n,"itemLink")),icon:u({class:[this.cx("itemIcon"),this.getItemProp(e,"icon")]},this.getPTOptions(e,n,"itemIcon")),label:u({class:this.cx("itemLabel")},this.getPTOptions(e,n,"itemLabel")),submenuicon:u({class:this.cx("submenuIcon")},this.getPTOptions(e,n,"submenuIcon"))}},containerRef:function(e){this.container=e}},components:{AngleRightIcon:H},directives:{ripple:G}},ae=["tabindex"],ue=["id","aria-label","aria-disabled","aria-expanded","aria-haspopup","aria-level","aria-setsize","aria-posinset","data-p-active","data-p-focused","data-p-disabled"],de=["onClick","onMouseenter","onMousemove"],le=["href","target"],me=["id"],ce=["id"];function fe(t,e,n,s,o,i){var d=L("AngleRightIcon"),h=L("TieredMenuSub",!0),a=Q("ripple");return l(),b(z,u({name:"p-tieredmenu",onEnter:i.onEnter},t.ptm("menu.transition")),{default:v(function(){return[n.level===0||n.visible?(l(),p("ul",{key:0,ref:i.containerRef,tabindex:n.tabindex},[(l(!0),p(E,null,X(n.items,function(r,m){return l(),p(E,{key:i.getItemKey(r)},[i.isItemVisible(r)&&!i.getItemProp(r,"separator")?(l(),p("li",u({key:0,id:i.getItemId(r),style:i.getItemProp(r,"style"),class:[t.cx("item",{processedItem:r}),i.getItemProp(r,"class")],role:"menuitem","aria-label":i.getItemLabel(r),"aria-disabled":i.isItemDisabled(r)||void 0,"aria-expanded":i.isItemGroup(r)?i.isItemActive(r):void 0,"aria-haspopup":i.isItemGroup(r)&&!i.getItemProp(r,"to")?"menu":void 0,"aria-level":n.level+1,"aria-setsize":i.getAriaSetSize(),"aria-posinset":i.getAriaPosInset(m),ref_for:!0},i.getPTOptions(r,m,"item"),{"data-p-active":i.isItemActive(r),"data-p-focused":i.isItemFocused(r),"data-p-disabled":i.isItemDisabled(r)}),[D("div",u({class:t.cx("itemContent"),onClick:function(f){return i.onItemClick(f,r)},onMouseenter:function(f){return i.onItemMouseEnter(f,r)},onMousemove:function(f){return i.onItemMouseMove(f,r)},ref_for:!0},i.getPTOptions(r,m,"itemContent")),[n.templates.item?(l(),b(M(n.templates.item),{key:1,item:r.item,hasSubmenu:i.getItemProp(r,"items"),label:i.getItemLabel(r),props:i.getMenuItemProps(r,m)},null,8,["item","hasSubmenu","label","props"])):Y((l(),p("a",u({key:0,href:i.getItemProp(r,"url"),class:t.cx("itemLink"),target:i.getItemProp(r,"target"),tabindex:"-1",ref_for:!0},i.getPTOptions(r,m,"itemLink")),[n.templates.itemicon?(l(),b(M(n.templates.itemicon),{key:0,item:r.item,class:S(t.cx("itemIcon"))},null,8,["item","class"])):i.getItemProp(r,"icon")?(l(),p("span",u({key:1,class:[t.cx("itemIcon"),i.getItemProp(r,"icon")],ref_for:!0},i.getPTOptions(r,m,"itemIcon")),null,16)):I("",!0),D("span",u({id:i.getItemLabelId(r),class:t.cx("itemLabel"),ref_for:!0},i.getPTOptions(r,m,"itemLabel")),_(i.getItemLabel(r)),17,me),i.getItemProp(r,"items")?(l(),p(E,{key:2},[n.templates.submenuicon?(l(),b(M(n.templates.submenuicon),u({key:0,class:t.cx("submenuIcon"),active:i.isItemActive(r),ref_for:!0},i.getPTOptions(r,m,"submenuIcon")),null,16,["class","active"])):(l(),b(d,u({key:1,class:t.cx("submenuIcon"),ref_for:!0},i.getPTOptions(r,m,"submenuIcon")),null,16,["class"]))],64)):I("",!0)],16,le)),[[a]])],16,de),i.isItemVisible(r)&&i.isItemGroup(r)?(l(),b(h,u({key:0,id:i.getItemId(r)+"_list",class:t.cx("submenu"),style:t.sx("submenu",!0,{processedItem:r}),"aria-labelledby":i.getItemLabelId(r),role:"menu",menuId:n.menuId,focusedItemId:n.focusedItemId,items:r.items,templates:n.templates,activeItemPath:n.activeItemPath,level:n.level+1,visible:i.isItemActive(r)&&i.isItemGroup(r),pt:t.pt,unstyled:t.unstyled,onItemClick:e[0]||(e[0]=function(c){return t.$emit("item-click",c)}),onItemMouseenter:e[1]||(e[1]=function(c){return t.$emit("item-mouseenter",c)}),onItemMousemove:e[2]||(e[2]=function(c){return t.$emit("item-mousemove",c)}),ref_for:!0},t.ptm("submenu")),null,16,["id","class","style","aria-labelledby","menuId","focusedItemId","items","templates","activeItemPath","level","visible","pt","unstyled"])):I("",!0)],16,ue)):I("",!0),i.isItemVisible(r)&&i.getItemProp(r,"separator")?(l(),p("li",u({key:1,id:i.getItemId(r),style:i.getItemProp(r,"style"),class:[t.cx("separator"),i.getItemProp(r,"class")],role:"separator",ref_for:!0},t.ptm("separator")),null,16,ce)):I("",!0)],64)}),128))],8,ae)):I("",!0)]}),_:1},16,["onEnter"])}O.render=fe;var R={name:"TieredMenu",extends:oe,inheritAttrs:!1,emits:["focus","blur","before-show","before-hide","hide","show"],outsideClickListener:null,matchMediaListener:null,scrollHandler:null,resizeListener:null,target:null,container:null,menubar:null,searchTimeout:null,searchValue:null,data:function(){return{focused:!1,focusedItemInfo:{index:-1,level:0,parentKey:""},activeItemPath:[],visible:!this.popup,submenuVisible:!1,dirty:!1,query:null,queryMatches:!1}},watch:{activeItemPath:function(e){this.popup||(k(e)?(this.bindOutsideClickListener(),this.bindResizeListener()):(this.unbindOutsideClickListener(),this.unbindResizeListener()))}},mounted:function(){this.bindMatchMediaListener()},beforeUnmount:function(){this.unbindOutsideClickListener(),this.unbindResizeListener(),this.unbindMatchMediaListener(),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.container&&this.autoZIndex&&C.clear(this.container),this.target=null,this.container=null},methods:{getItemProp:function(e,n){return e?V(e[n]):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemGroup:function(e){return k(this.getItemProp(e,"items"))},isItemSeparator:function(e){return this.getItemProp(e,"separator")},getProccessedItemLabel:function(e){return e?this.getItemLabel(e.item):void 0},isProccessedItemGroup:function(e){return e&&k(e.items)},toggle:function(e){this.visible?this.hide(e,!0):this.show(e)},show:function(e,n){this.popup&&(this.$emit("before-show"),this.visible=!0,this.target=this.target||e.currentTarget,this.relatedTarget=e.relatedTarget||null),n&&y(this.menubar)},hide:function(e,n){this.popup&&(this.$emit("before-hide"),this.visible=!1),this.activeItemPath=[],this.focusedItemInfo={index:-1,level:0,parentKey:""},n&&y(this.relatedTarget||this.target||this.menubar),this.dirty=!1},onFocus:function(e){this.focused=!0,this.popup||(this.focusedItemInfo=this.focusedItemInfo.index!==-1?this.focusedItemInfo:{index:this.findFirstFocusedItemIndex(),level:0,parentKey:""}),this.$emit("focus",e)},onBlur:function(e){this.focused=!1,this.focusedItemInfo={index:-1,level:0,parentKey:""},this.searchValue="",this.dirty=!1,this.$emit("blur",e)},onKeyDown:function(e){if(this.disabled){e.preventDefault();return}var n=e.metaKey||e.ctrlKey;switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"ArrowLeft":this.onArrowLeftKey(e);break;case"ArrowRight":this.onArrowRightKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"Space":this.onSpaceKey(e);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"PageDown":case"PageUp":case"Backspace":case"ShiftLeft":case"ShiftRight":break;default:!n&&W(e.key)&&this.searchItems(e,e.key);break}},onItemChange:function(e,n){var s=e.processedItem,o=e.isFocus;if(!w(s)){var i=s.index,d=s.key,h=s.level,a=s.parentKey,r=s.items,m=k(r),c=this.activeItemPath.filter(function(f){return f.parentKey!==a&&f.parentKey!==d});m&&(c.push(s),this.submenuVisible=!0),this.focusedItemInfo={index:i,level:h,parentKey:a},m&&(this.dirty=!0),o&&y(this.menubar),!(n==="hover"&&this.queryMatches)&&(this.activeItemPath=c)}},onOverlayClick:function(e){j.emit("overlay-click",{originalEvent:e,target:this.target})},onItemClick:function(e){var n=e.originalEvent,s=e.processedItem,o=this.isProccessedItemGroup(s),i=w(s.parent),d=this.isSelected(s);if(d){var h=s.index,a=s.key,r=s.level,m=s.parentKey;this.activeItemPath=this.activeItemPath.filter(function(f){return a!==f.key&&a.startsWith(f.key)}),this.focusedItemInfo={index:h,level:r,parentKey:m},this.dirty=!i,y(this.menubar)}else if(o)this.onItemChange(e);else{var c=i?s:this.activeItemPath.find(function(f){return f.parentKey===""});this.hide(n),this.changeFocusedItemIndex(n,c?c.index:-1),y(this.menubar)}},onItemMouseEnter:function(e){this.dirty&&this.onItemChange(e,"hover")},onItemMouseMove:function(e){this.focused&&this.changeFocusedItemIndex(e,e.processedItem.index)},onArrowDownKey:function(e){var n=this.focusedItemInfo.index!==-1?this.findNextItemIndex(this.focusedItemInfo.index):this.findFirstFocusedItemIndex();this.changeFocusedItemIndex(e,n),e.preventDefault()},onArrowUpKey:function(e){if(e.altKey){if(this.focusedItemInfo.index!==-1){var n=this.visibleItems[this.focusedItemInfo.index],s=this.isProccessedItemGroup(n);!s&&this.onItemChange({originalEvent:e,processedItem:n})}this.popup&&this.hide(e,!0),e.preventDefault()}else{var o=this.focusedItemInfo.index!==-1?this.findPrevItemIndex(this.focusedItemInfo.index):this.findLastFocusedItemIndex();this.changeFocusedItemIndex(e,o),e.preventDefault()}},onArrowLeftKey:function(e){var n=this,s=this.visibleItems[this.focusedItemInfo.index],o=this.activeItemPath.find(function(d){return d.key===s.parentKey}),i=w(s.parent);i||(this.focusedItemInfo={index:-1,parentKey:o?o.parentKey:""},this.searchValue="",this.onArrowDownKey(e)),this.activeItemPath=this.activeItemPath.filter(function(d){return d.parentKey!==n.focusedItemInfo.parentKey}),e.preventDefault()},onArrowRightKey:function(e){var n=this.visibleItems[this.focusedItemInfo.index],s=this.isProccessedItemGroup(n);s&&(this.onItemChange({originalEvent:e,processedItem:n}),this.focusedItemInfo={index:-1,parentKey:n.key},this.searchValue="",this.onArrowDownKey(e)),e.preventDefault()},onHomeKey:function(e){this.changeFocusedItemIndex(e,this.findFirstItemIndex()),e.preventDefault()},onEndKey:function(e){this.changeFocusedItemIndex(e,this.findLastItemIndex()),e.preventDefault()},onEnterKey:function(e){if(this.focusedItemInfo.index!==-1){var n=K(this.menubar,'li[id="'.concat("".concat(this.focusedItemId),'"]')),s=n&&K(n,'[data-pc-section="itemlink"]');if(s?s.click():n&&n.click(),!this.popup){var o=this.visibleItems[this.focusedItemInfo.index],i=this.isProccessedItemGroup(o);!i&&(this.focusedItemInfo.index=this.findFirstFocusedItemIndex())}}e.preventDefault()},onSpaceKey:function(e){this.onEnterKey(e)},onEscapeKey:function(e){if(this.popup||this.focusedItemInfo.level!==0){var n=this.focusedItemInfo;this.hide(e,!1),this.focusedItemInfo={index:Number(n.parentKey.split("_")[0]),level:0,parentKey:""},this.popup&&y(this.target)}e.preventDefault()},onTabKey:function(e){if(this.focusedItemInfo.index!==-1){var n=this.visibleItems[this.focusedItemInfo.index],s=this.isProccessedItemGroup(n);!s&&this.onItemChange({originalEvent:e,processedItem:n})}this.hide()},onEnter:function(e){this.autoZIndex&&C.set("menu",e,this.baseZIndex+this.$primevue.config.zIndex.menu),U(e,{position:"absolute",top:"0"}),this.alignOverlay(),y(this.menubar),this.scrollInView()},onAfterEnter:function(){this.bindOutsideClickListener(),this.bindScrollListener(),this.bindResizeListener(),this.$emit("show")},onLeave:function(){this.unbindOutsideClickListener(),this.unbindScrollListener(),this.unbindResizeListener(),this.$emit("hide"),this.container=null,this.dirty=!1},onAfterLeave:function(e){this.autoZIndex&&C.clear(e)},alignOverlay:function(){q(this.container,this.target);var e=x(this.target);e>x(this.container)&&(this.container.style.minWidth=x(this.target)+"px")},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(n){var s=e.container&&!e.container.contains(n.target),o=e.popup?!(e.target&&(e.target===n.target||e.target.contains(n.target))):!0;s&&o&&e.hide()},document.addEventListener("click",this.outsideClickListener,!0))},unbindOutsideClickListener:function(){this.outsideClickListener&&(document.removeEventListener("click",this.outsideClickListener,!0),this.outsideClickListener=null)},bindScrollListener:function(){var e=this;this.scrollHandler||(this.scrollHandler=new Z(this.target,function(n){e.hide(n,!0)})),this.scrollHandler.bindScrollListener()},unbindScrollListener:function(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(n){N()||e.hide(n,!0)},window.addEventListener("resize",this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&(window.removeEventListener("resize",this.resizeListener),this.resizeListener=null)},bindMatchMediaListener:function(){var e=this;if(!this.matchMediaListener){var n=matchMedia("(max-width: ".concat(this.breakpoint,")"));this.query=n,this.queryMatches=n.matches,this.matchMediaListener=function(){e.queryMatches=n.matches},this.query.addEventListener("change",this.matchMediaListener)}},unbindMatchMediaListener:function(){this.matchMediaListener&&(this.query.removeEventListener("change",this.matchMediaListener),this.matchMediaListener=null)},isItemMatched:function(e){var n;return this.isValidItem(e)&&((n=this.getProccessedItemLabel(e))===null||n===void 0?void 0:n.toLocaleLowerCase().startsWith(this.searchValue.toLocaleLowerCase()))},isValidItem:function(e){return!!e&&!this.isItemDisabled(e.item)&&!this.isItemSeparator(e.item)&&this.isItemVisible(e.item)},isValidSelectedItem:function(e){return this.isValidItem(e)&&this.isSelected(e)},isSelected:function(e){return this.activeItemPath.some(function(n){return n.key===e.key})},findFirstItemIndex:function(){var e=this;return this.visibleItems.findIndex(function(n){return e.isValidItem(n)})},findLastItemIndex:function(){var e=this;return T(this.visibleItems,function(n){return e.isValidItem(n)})},findNextItemIndex:function(e){var n=this,s=e<this.visibleItems.length-1?this.visibleItems.slice(e+1).findIndex(function(o){return n.isValidItem(o)}):-1;return s>-1?s+e+1:e},findPrevItemIndex:function(e){var n=this,s=e>0?T(this.visibleItems.slice(0,e),function(o){return n.isValidItem(o)}):-1;return s>-1?s:e},findSelectedItemIndex:function(){var e=this;return this.visibleItems.findIndex(function(n){return e.isValidSelectedItem(n)})},findFirstFocusedItemIndex:function(){var e=this.findSelectedItemIndex();return e<0?this.findFirstItemIndex():e},findLastFocusedItemIndex:function(){var e=this.findSelectedItemIndex();return e<0?this.findLastItemIndex():e},searchItems:function(e,n){var s=this;this.searchValue=(this.searchValue||"")+n;var o=-1,i=!1;return this.focusedItemInfo.index!==-1?(o=this.visibleItems.slice(this.focusedItemInfo.index).findIndex(function(d){return s.isItemMatched(d)}),o=o===-1?this.visibleItems.slice(0,this.focusedItemInfo.index).findIndex(function(d){return s.isItemMatched(d)}):o+this.focusedItemInfo.index):o=this.visibleItems.findIndex(function(d){return s.isItemMatched(d)}),o!==-1&&(i=!0),o===-1&&this.focusedItemInfo.index===-1&&(o=this.findFirstFocusedItemIndex()),o!==-1&&this.changeFocusedItemIndex(e,o),this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(function(){s.searchValue="",s.searchTimeout=null},500),i},changeFocusedItemIndex:function(e,n){this.focusedItemInfo.index!==n&&(this.focusedItemInfo.index=n,this.scrollInView())},scrollInView:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:-1,n=e!==-1?"".concat(this.$id,"_").concat(e):this.focusedItemId,s=K(this.menubar,'li[id="'.concat(n,'"]'));s&&s.scrollIntoView&&s.scrollIntoView({block:"nearest",inline:"start"})},createProcessedItems:function(e){var n=this,s=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,o=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"",d=[];return e&&e.forEach(function(h,a){var r=(i!==""?i+"_":"")+a,m={item:h,index:a,level:s,key:r,parent:o,parentKey:i};m.items=n.createProcessedItems(h.items,s+1,m,r),d.push(m)}),d},containerRef:function(e){this.container=e},menubarRef:function(e){this.menubar=e?e.$el:void 0}},computed:{processedItems:function(){return this.createProcessedItems(this.model||[])},visibleItems:function(){var e=this,n=this.activeItemPath.find(function(s){return s.key===e.focusedItemInfo.parentKey});return n?n.items:this.processedItems},focusedItemId:function(){return this.focusedItemInfo.index!==-1?"".concat(this.$id).concat(k(this.focusedItemInfo.parentKey)?"_"+this.focusedItemInfo.parentKey:"","_").concat(this.focusedItemInfo.index):null}},components:{TieredMenuSub:O,Portal:$}},he=["id"];function pe(t,e,n,s,o,i){var d=L("TieredMenuSub"),h=L("Portal");return l(),b(h,{appendTo:t.appendTo,disabled:!t.popup},{default:v(function(){return[P(z,u({name:"p-connected-overlay",onEnter:i.onEnter,onAfterEnter:i.onAfterEnter,onLeave:i.onLeave,onAfterLeave:i.onAfterLeave},t.ptm("transition")),{default:v(function(){return[o.visible?(l(),p("div",u({key:0,ref:i.containerRef,id:t.$id,class:t.cx("root"),onClick:e[0]||(e[0]=function(){return i.onOverlayClick&&i.onOverlayClick.apply(i,arguments)})},t.ptmi("root")),[t.$slots.start?(l(),p("div",u({key:0,class:t.cx("start")},t.ptm("start")),[g(t.$slots,"start")],16)):I("",!0),P(d,u({ref:i.menubarRef,id:t.$id+"_list",class:t.cx("rootList"),tabindex:t.disabled?-1:t.tabindex,role:"menubar","aria-label":t.ariaLabel,"aria-labelledby":t.ariaLabelledby,"aria-disabled":t.disabled||void 0,"aria-orientation":"vertical","aria-activedescendant":o.focused?i.focusedItemId:void 0,menuId:t.$id,focusedItemId:o.focused?i.focusedItemId:void 0,items:i.processedItems,templates:t.$slots,activeItemPath:o.activeItemPath,level:0,visible:o.submenuVisible,pt:t.pt,unstyled:t.unstyled,onFocus:i.onFocus,onBlur:i.onBlur,onKeydown:i.onKeyDown,onItemClick:i.onItemClick,onItemMouseenter:i.onItemMouseEnter,onItemMousemove:i.onItemMouseMove},t.ptm("rootList")),null,16,["id","class","tabindex","aria-label","aria-labelledby","aria-disabled","aria-activedescendant","menuId","focusedItemId","items","templates","activeItemPath","visible","pt","unstyled","onFocus","onBlur","onKeydown","onItemClick","onItemMouseenter","onItemMousemove"]),t.$slots.end?(l(),p("div",u({key:1,class:t.cx("end")},t.ptm("end")),[g(t.$slots,"end")],16)):I("",!0)],16,he)):I("",!0)]}),_:3},16,["onEnter","onAfterEnter","onLeave","onAfterLeave"])]}),_:3},8,["appendTo","disabled"])}R.render=pe;var Ie=({dt:t})=>`
.p-splitbutton {
    display: inline-flex;
    position: relative;
    border-radius: ${t("splitbutton.border.radius")};
}

.p-splitbutton-button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
    border-inline-end: 0 none;
}

.p-splitbutton-button:focus-visible,
.p-splitbutton-dropdown:focus-visible {
    z-index: 1;
}

.p-splitbutton-button:not(:disabled):hover,
.p-splitbutton-button:not(:disabled):active {
    border-inline-end: 0 none;
}

.p-splitbutton-dropdown {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
}

.p-splitbutton .p-menu {
    min-width: 100%;
}

.p-splitbutton-fluid {
    display: flex;
}

.p-splitbutton-rounded .p-splitbutton-dropdown {
    border-start-end-radius: ${t("splitbutton.rounded.border.radius")};
    border-end-end-radius: ${t("splitbutton.rounded.border.radius")};
}

.p-splitbutton-rounded .p-splitbutton-button {
    border-start-start-radius: ${t("splitbutton.rounded.border.radius")};
    border-end-start-radius: ${t("splitbutton.rounded.border.radius")};
}

.p-splitbutton-raised {
    box-shadow: ${t("splitbutton.raised.shadow")};
}
`,be={root:function(e){var n=e.instance,s=e.props;return["p-splitbutton p-component",{"p-splitbutton-raised":s.raised,"p-splitbutton-rounded":s.rounded,"p-splitbutton-fluid":n.hasFluid}]},pcButton:"p-splitbutton-button",pcDropdown:"p-splitbutton-dropdown"},ve=F.extend({name:"splitbutton",style:Ie,classes:be}),ye={name:"BaseSplitButton",extends:A,props:{label:{type:String,default:null},icon:{type:String,default:null},model:{type:Array,default:null},autoZIndex:{type:Boolean,default:!0},baseZIndex:{type:Number,default:0},appendTo:{type:[String,Object],default:"body"},disabled:{type:Boolean,default:!1},fluid:{type:Boolean,default:null},class:{type:null,default:null},style:{type:null,default:null},buttonProps:{type:null,default:null},menuButtonProps:{type:null,default:null},menuButtonIcon:{type:String,default:void 0},dropdownIcon:{type:String,default:void 0},severity:{type:String,default:null},raised:{type:Boolean,default:!1},rounded:{type:Boolean,default:!1},text:{type:Boolean,default:!1},outlined:{type:Boolean,default:!1},size:{type:String,default:null},plain:{type:Boolean,default:!1}},style:ve,provide:function(){return{$pcSplitButton:this,$parentInstance:this}}},ge={name:"SplitButton",extends:ye,inheritAttrs:!1,emits:["click"],inject:{$pcFluid:{default:null}},data:function(){return{isExpanded:!1}},mounted:function(){var e=this;this.$watch("$refs.menu.visible",function(n){e.isExpanded=n})},methods:{onDropdownButtonClick:function(e){e&&e.preventDefault(),this.$refs.menu.toggle({currentTarget:this.$el,relatedTarget:this.$refs.button.$el}),this.isExpanded=this.$refs.menu.visible},onDropdownKeydown:function(e){(e.code==="ArrowDown"||e.code==="ArrowUp")&&(this.onDropdownButtonClick(),e.preventDefault())},onDefaultButtonClick:function(e){this.isExpanded&&this.$refs.menu.hide(e),this.$emit("click",e)}},computed:{containerClass:function(){return[this.cx("root"),this.class]},hasFluid:function(){return w(this.fluid)?!!this.$pcFluid:this.fluid}},components:{PVSButton:te,PVSMenu:R,ChevronDownIcon:ee}},ke=["data-p-severity"];function Le(t,e,n,s,o,i){var d=L("PVSButton"),h=L("PVSMenu");return l(),p("div",u({class:i.containerClass,style:t.style},t.ptmi("root"),{"data-p-severity":t.severity}),[P(d,u({type:"button",class:t.cx("pcButton"),label:t.label,disabled:t.disabled,severity:t.severity,text:t.text,icon:t.icon,outlined:t.outlined,size:t.size,fluid:t.fluid,"aria-label":t.label,onClick:i.onDefaultButtonClick},t.buttonProps,{pt:t.ptm("pcButton"),unstyled:t.unstyled}),B({default:v(function(){return[g(t.$slots,"default")]}),_:2},[t.$slots.icon?{name:"icon",fn:v(function(a){return[g(t.$slots,"icon",{class:S(a.class)},function(){return[D("span",u({class:[t.icon,a.class]},t.ptm("pcButton").icon,{"data-pc-section":"buttonicon"}),null,16)]})]}),key:"0"}:void 0]),1040,["class","label","disabled","severity","text","icon","outlined","size","fluid","aria-label","onClick","pt","unstyled"]),P(d,u({ref:"button",type:"button",class:t.cx("pcDropdown"),disabled:t.disabled,"aria-haspopup":"true","aria-expanded":o.isExpanded,"aria-controls":t.$id+"_overlay",onClick:i.onDropdownButtonClick,onKeydown:i.onDropdownKeydown,severity:t.severity,text:t.text,outlined:t.outlined,size:t.size,unstyled:t.unstyled},t.menuButtonProps,{pt:t.ptm("pcDropdown")}),{icon:v(function(a){return[g(t.$slots,t.$slots.dropdownicon?"dropdownicon":"menubuttonicon",{class:S(a.class)},function(){return[(l(),b(M(t.menuButtonIcon||t.dropdownIcon?"span":"ChevronDownIcon"),u({class:[t.dropdownIcon||t.menuButtonIcon,a.class]},t.ptm("pcDropdown").icon,{"data-pc-section":"menubuttonicon"}),null,16,["class"]))]})]}),_:3},16,["class","disabled","aria-expanded","aria-controls","onClick","onKeydown","severity","text","outlined","size","unstyled","pt"]),P(h,{ref:"menu",id:t.$id+"_overlay",model:t.model,popup:!0,autoZIndex:t.autoZIndex,baseZIndex:t.baseZIndex,appendTo:t.appendTo,unstyled:t.unstyled,pt:t.ptm("pcMenu")},B({_:2},[t.$slots.menuitemicon?{name:"itemicon",fn:v(function(a){return[g(t.$slots,"menuitemicon",{item:a.item,class:S(a.class)})]}),key:"0"}:void 0,t.$slots.item?{name:"item",fn:v(function(a){return[g(t.$slots,"item",{item:a.item,hasSubmenu:a.hasSubmenu,label:a.label,props:a.props})]}),key:"1"}:void 0]),1032,["id","model","autoZIndex","baseZIndex","appendTo","unstyled","pt"])],16,ke)}ge.render=Le;export{ge as s};
