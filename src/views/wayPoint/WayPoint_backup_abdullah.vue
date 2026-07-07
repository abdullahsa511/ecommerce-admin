<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";

const emit = defineEmits(['update:wayPoints']);

const props = defineProps({
    imageSrc: {
        type: String,
        required: true
    },
    wayPoints: {
        type: Array,
        required: true,
        default: () => []
    },
    modelId: {
        type: [Number, String],
        default: null
    },
    fb: {
        type: Object,
        required: true,
        default: () => ({})
    }
});

// console.log('wayPoints', props.wayPoints);

/* ---------- Normalize way points to array ---------- */
function getPointsArray() {
    return props.wayPoints;
}

const initialPoints = getPointsArray();

/* ---------- Refs & State ---------- */
const imgSrc = props.imageSrc;
const bannerWrapper = ref(null);
const bannerImg = ref(null);
const wayPointRefs = ref([]);
const wayPointLinkRefs = ref([]);

// Per-point state: { leftPx, topPx, positionPercent: { left, top }, linkActive, label, href }
const pointsState = ref(
    initialPoints.length > 0
        ? initialPoints.map((p, i) => ({
            id: p.id,
            leftPx: p.leftPx,
            topPx: p.topPx,
            positionPercent: { left: p.positionPercent.left, top: p.positionPercent.top },
            linkActive: false,
            label: p.label ?? `Point ${i + 1}`,
            href: p.href ?? "#"
        }))
        : [
            { leftPx: 0, topPx: 0, positionPercent: { left: null, top: null }, linkActive: false, label: "Point 1nazmul", href: "#" }
        ]
);

let dragOffsetX = 0;
let dragOffsetY = 0;
let isDragging = false;
let activeDragIndex = -1;

/* click detection */
let clickStartTime = 0;
let clickStartX = 0;
let clickStartY = 0;

/* timeouts */
let resizeTimeout = null;

/* ---------- Helpers ---------- */
function updatePositionFromPercent(index) {
    const parent = bannerImg.value;
    const point = pointsState.value[index];
    if (!parent || !point) return;
    if (point.positionPercent.left === null || point.positionPercent.top === null)
        return;

    point.leftPx = (point.positionPercent.left / 100) * parent.offsetWidth;
    point.topPx = (point.positionPercent.top / 100) * parent.offsetHeight;
}

function initializePosition(index) {
    const parent = bannerImg.value;
    const el = wayPointRefs.value[index];
    const point = pointsState.value[index];
    if (!parent || !el || !point) return;

    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const parentWidth = parent.offsetWidth;
    const parentHeight = parent.offsetHeight;

    if (parentWidth === 0 || parentHeight === 0) return;

    point.positionPercent.left =
        ((elRect.left - parentRect.left) / parentWidth) * 100;
    point.positionPercent.top =
        ((elRect.top - parentRect.top) / parentHeight) * 100;

    point.leftPx = (point.positionPercent.left / 100) * parentWidth;
    point.topPx = (point.positionPercent.top / 100) * parentHeight;
}

function updateLineWidth(index) {
    const linkBox = wayPointLinkRefs.value[index];
    if (!linkBox) return;
    const anchor = linkBox.querySelector("a");
    if (!anchor) return;

    const temp = document.createElement("span");
    temp.style.visibility = "hidden";
    temp.style.position = "absolute";
    temp.style.whiteSpace = "nowrap";
    temp.style.fontSize = "20px";
    temp.style.fontWeight = "500";
    temp.style.fontFamily = "Arial, sans-serif";
    temp.textContent = anchor.textContent;
    document.body.appendChild(temp);
    const textWidth = temp.offsetWidth + 20;
    document.body.removeChild(temp);

    if (textWidth > 0) {
        linkBox.style.setProperty("--line-width", `${textWidth}px`);
    }
}

function setWayPointRef(el, index) {
    if (el) wayPointRefs.value[index] = el;
}

function setWayPointLinkRef(el, index) {
    if (el) wayPointLinkRefs.value[index] = el;
}

/* ---------- Drag & Drop ---------- */
function onDragStart(e, index) {
    isDragging = true;
    activeDragIndex = index;

    const el = wayPointRefs.value[index];
    if (!el) return;
    const rect = el.getBoundingClientRect();

    const link = wayPointLinkRefs.value[index];
    if (link) link.classList.remove("active");

    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    const transparentImg = new Image();
    transparentImg.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
    e.dataTransfer.setDragImage(transparentImg, 0, 0);
    e.dataTransfer.effectAllowed = "move";
}

function onDragOver(e) {
    e.preventDefault();
    if (activeDragIndex < 0) return;

    const container = bannerImg.value;
    if (!container) return;
    const parentRect = container.getBoundingClientRect();
    const parentWidth = container.offsetWidth;
    const parentHeight = container.offsetHeight;

    const el = wayPointRefs.value[activeDragIndex];
    if (!el) return;
    const elWidth = el.offsetWidth;
    const elHeight = el.offsetHeight;

    let newX = e.clientX - parentRect.left - dragOffsetX;
    let newY = e.clientY - parentRect.top - dragOffsetY;

    newX = Math.max(0, Math.min(newX, parentWidth - elWidth));
    newY = Math.max(0, Math.min(newY, parentHeight - elHeight));

    const point = pointsState.value[activeDragIndex];
    if (point) {
        point.leftPx = newX;
        point.topPx = newY;
    }
}

function onDrop(e) {
    if (activeDragIndex < 0) return;

    const container = bannerImg.value;
    if (!container) return;
    const parentRect = container.getBoundingClientRect();
    const parentWidth = container.offsetWidth;
    const parentHeight = container.offsetHeight;

    const el = wayPointRefs.value[activeDragIndex];
    const point = pointsState.value[activeDragIndex];
    const pointId = point.id;

    if (!el || !point) return;

    const elRect = el.getBoundingClientRect();
    const elWidth = el.offsetWidth;
    const elHeight = el.offsetHeight;

    const left = ((elRect.left - parentRect.left) / parentWidth) * 100;
    const top = ((elRect.top - parentRect.top) / parentHeight) * 100;
    const right = ((parentRect.right - elRect.right) / parentWidth) * 100;
    const bottom = ((parentRect.bottom - elRect.bottom) / parentHeight) * 100;
    const width = (elWidth / parentWidth) * 100;
    const height = (elHeight / parentHeight) * 100;

    point.positionPercent.left = left;
    point.positionPercent.top = top;


    // state value
    pointsState.value = pointsState.value.map(p => p.id === pointId ? { ...p, positionPercent: { left, top } } : p);

    // console.log('pointsState.value', pointsState.value);

    // emit('update:wayPoints', pointsState.value);


    // console.log(`Way point ${activeDragIndex + 1}:`, {
    //     left: parseFloat(left.toFixed(2)),
    //     top: parseFloat(top.toFixed(2)),
    //     right: parseFloat(right.toFixed(2)),
    //     bottom: parseFloat(bottom.toFixed(2)),
    //     width: parseFloat(width.toFixed(2)),
    //     height: parseFloat(height.toFixed(2)),
    // });
}

function onDragEnd(e, index) {
    setTimeout(() => {
        isDragging = false;
        activeDragIndex = -1;
    }, 100);

    try {
        const dropEffect = e.dataTransfer && e.dataTransfer.dropEffect;
        if (dropEffect === "none") {
            const container = bannerImg.value;
            if (!container) return;
            const parentRect = container.getBoundingClientRect();
            const parentWidth = container.offsetWidth;
            const parentHeight = container.offsetHeight;

            const el = wayPointRefs.value[index];
            const point = pointsState.value[index];
            if (!el || !point) return;

            const elRect = el.getBoundingClientRect();
            const elWidth = el.offsetWidth;
            const elHeight = el.offsetHeight;

            const left = ((elRect.left - parentRect.left) / parentWidth) * 100;
            const top = ((elRect.top - parentRect.top) / parentHeight) * 100;
            const right = ((parentRect.right - elRect.right) / parentWidth) * 100;
            const bottom = ((parentRect.bottom - elRect.bottom) / parentHeight) * 100;
            const width = (elWidth / parentWidth) * 100;
            const height = (elHeight / parentHeight) * 100;

            point.positionPercent.left = left;
            point.positionPercent.top = top;

            updatePositionFromPercent(index);

            console.log(`Way point ${index + 1} (dragend):`, {
                left: parseFloat(left.toFixed(2)),
                top: parseFloat(top.toFixed(2)),
                right: parseFloat(right.toFixed(2)),
                bottom: parseFloat(bottom.toFixed(2)),
                width: parseFloat(width.toFixed(2)),
                height: parseFloat(height.toFixed(2)),
            });
        }
    } catch (err) { }
}

/* ---------- Click / Mouse logic (to distinguish click vs drag) ---------- */
function onMouseDown(e) {
    clickStartTime = Date.now();
    clickStartX = e.clientX;
    clickStartY = e.clientY;
}

function onClick(e, index) {
    if (e.target.closest(".way-point-link")) {
        return;
    }

    const clickDuration = Date.now() - clickStartTime;
    const clickDistance = Math.sqrt(
        Math.pow(e.clientX - clickStartX, 2) + Math.pow(e.clientY - clickStartY, 2)
    );

    if (clickDuration < 300 && clickDistance < 5 && !isDragging) {
        const point = pointsState.value[index];
        if (!point) return;
        point.linkActive = !point.linkActive;

        if (point.linkActive) {
            nextTick(() => {
                updateLineWidth(index);
            });
        }
    }
}

/* ---------- Resize handling (fade out/in & reposition) ---------- */
function onWindowResize() {
    wayPointRefs.value.forEach((el) => {
        if (el) el.style.opacity = "0";
    });

    if (resizeTimeout) clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
        pointsState.value.forEach((_, i) => updatePositionFromPercent(i));
        nextTick(() => {
            pointsState.value.forEach((_, i) => updateLineWidth(i));
            wayPointRefs.value.forEach((el) => {
                if (el) el.style.opacity = "1";
            });
        });
    }, 350);
}

/* ---------- Image load ---------- */
function onImageLoad() {
    pointsState.value.forEach((_, i) => initializePosition(i));
    nextTick(() => {
        pointsState.value.forEach((_, i) => updateLineWidth(i));
    });
}

function addWayPoint() {
    const newWayPoint = {
        id: pointsState.value.length + 1,
        leftPx: 0 + (pointsState.value.length * 60),
        topPx: 0 + (pointsState.value.length * 40),
        positionPercent: { left: null, top: null },
        linkActive: false,
        label: "Point " + (pointsState.value.length + 1),
        href: "#",
    };
    pointsState.value.push(newWayPoint);
    // emit('update:wayPoints', newWayPoint);
    console.log('addWayPoint', pointsState.value);
}

/* ---------- Lifecycle ---------- */
onMounted(() => {
    if (bannerImg.value && bannerImg.value.complete) {
        pointsState.value.forEach((_, i) => initializePosition(i));
        nextTick(() => {
            pointsState.value.forEach((_, i) => updateLineWidth(i));
        });
    }

    window.addEventListener("resize", onWindowResize);

    // console.log('wayPoints on mounted pontsState', pointsState.value);
});

function saveWayPoints() {
    emit('update:wayPoints', pointsState.value);
}

onBeforeUnmount(() => {
    window.removeEventListener("resize", onWindowResize);
});
</script>

<template>
    <div id="banner-wrapper" ref="bannerWrapper" style="position: relative; width: 100%; max-width: 100%">

        <div class="add-way-point-button mb-5">
            <button class="bg-black text-white px-4 py-2 rounded-md" @click="addWayPoint"><i
                    class="pi pi-plus-circle"></i> Add Way Point</button>
        </div>

        <div class="th-header header-layout menu-white">
            <div class="th-topbar flex justify-center items-center">
                <p class="text-white text-xl font-medium m-0">Free shipping on apparel and gear over 75 USD</p>
            </div>

            <div class="sticky-wrapper desktop-menu">
                <div class="menu-area">
                    <div class="container th-container">
                        <div class="row flex justify-between items-center p-5">
                            <div class="flex col-4 items-center justify-start">
                                <div class="main-menu hidden lg:block">
                                    <ul class="desktop-menu-list list-none">
                                        <li
                                            class="menu-item-has-children mega-menu-wrap desktop-menu-item hover:text-white">
                                            <a href="#" class="desktop-menu-link">
                                                <span>Products <i class="pi pi-chevron-down menu-chevron"
                                                        aria-hidden="true"></i></span>
                                            </a>

                                        </li>
                                        <li class="desktop-menu-item hover:text-white">
                                            <a class="desktop-menu-link" href="">
                                                <span>Projects</span>
                                            </a>
                                        </li>
                                        <li class="desktop-menu-item hover:text-white">
                                            <a class="desktop-menu-link" href="">
                                                <span>Blog</span>
                                            </a>
                                        </li>
                                        <li class="desktop-menu-item hover:text-white">
                                            <a class="desktop-menu-link" href="">
                                                <span class="manu-name">About</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <button type="button" class="th-menu-toggle block lg:hidden">
                                    <span class="pi pi-bars text-black" style="font-size: 28px;"></span>
                                </button>
                            </div>
                            <div class="flex col-4 items-center justify-center ">
                                <div class="header-logo">
                                    <a class="icon-masking" href="/">
                                        <img class="w-full h-full object-contain"
                                            :src="`http://localhost:8089/img/logo_black.png`" alt="KROST">
                                    </a>
                                </div>

                            </div>
                            <div class="flex col-4 items-center justify-end gap-10">
                                <div class="desktop-menu-item flex items-center gap-10">
                                    <a class="desktop-menu-link text-medium font-medium text-xl hover:text-black"
                                        href="/account/resources">
                                        <span class="manu-name">Resources</span>
                                    </a>
                                    <a class="desktop-menu-link text-medium font-medium text-xl hover:text-black"
                                        href="/contact-us">
                                        <span class="manu-name ">Contact Us</span>
                                    </a>
                                </div>
                                <div class="header-button">
                                    <a href="tel:+2586232325"
                                        class="h-btn bg-black text-white py-2 px-3 rounded-full">Shop Now</a>
                                </div>

                                <div class="flex items-center gap-3">
                                    <div class="th-header-search">
                                        <a class="flex" href="" title="Search" role="button">
                                            <span class="pi pi-search text-black" style="font-size: 28px;"></span>
                                        </a>
                                    </div>

                                    <a href="" role="button">
                                        <span style="position: relative;">
                                            <img :src="`http://localhost:8089/img/pinboard-icon.png`" alt="Pinboard"
                                                style="width: 26px; height: 27px;">
                                            <span class="th-pinboard-count-badge">
                                                <i d="pinboard-item-count"></i>
                                            </span>
                                        </span>
                                    </a>
                                    <a href="" class="flex items-center" id="user-logout-button">
                                        <span class="pi pi-user text-black" style="font-size: 28px;"></span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="th-hero-wrapper th-hero gr-bg4 background-image" ref="bannerImg" id="wey-point-layout"
            @load="onImageLoad" :style="{ backgroundImage: 'url(' + imgSrc + ')' }" @dragover.prevent="onDragOver"
            @drop.prevent="onDrop">

            <div v-for="(point, index) in pointsState" :key="index" class="way-point"
                :ref="(el) => setWayPointRef(el, index)" draggable="true"
                :style="{ left: point.leftPx + 'px', top: point.topPx + 'px' }" @mousedown="onMouseDown"
                @click="onClick($event, index)" @dragstart="onDragStart($event, index)"
                @dragend="onDragEnd($event, index)">
                <div class="circle-point" style="position: absolute"></div>
                <div class="circle-point" style="position: absolute"></div>

                <span class="way-point-link" :class="{ active: point.linkActive }"
                    :ref="(el) => setWayPointLinkRef(el, index)">
                    <form class="waypoint-form">
                        <div class="input-group">
                            <input type="text" class="form-input" v-model="point.label" placeholder="Label name" />
                            <span class="input-line"></span>
                        </div>

                        <div class="input-group">
                            <input type="text" class="form-input" v-model="point.href" placeholder="Link URL" />
                            <span class="input-line"></span>
                        </div>
                    </form>


                    <!-- <a :href="point.href">{{ point.label }} abdullah</a>
                    <a :href="point.href">{{ point.label }} abdullah</a> -->
                </span>
            </div>
        </div>

        <div class="flex justify-end gap-2 mt-5">
            <Button type="button" label="Save Way Points"
                :icon="fb.loading['way-points.' + props.modelId] ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
                class="p-button-md" :loading="fb.loading['way-points.' + props.modelId]"
                @click="saveWayPoints"></Button>
        </div>


        <!-- <img ref="bannerImg" id="wey-point-layout" :src="imgSrc" alt="Way Point Layout" style="width: 100%; display: block" @load="onImageLoad" /> -->

    </div>
</template>

<style scoped>
/* Form wrapper */
.waypoint-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* Input group */
.input-group {
    position: relative;
}

/* Input field */
.form-input {
    width: 100%;
    padding: 10px 12px;
    font-size: 14px;
    color: #fff;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 8px;
    outline: none;
    transition: all 0.3s ease;
}

/* Placeholder */
.form-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

/* Hover */
.form-input:hover {
    border-color: rgba(255, 255, 255, 0.6);
}

/* Focus */
.form-input:focus {
    background: rgba(0, 0, 0, 0.45);
    border-color: #00e5ff;
    box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.25);
}

/* Bottom animated line */
.input-line {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0;
    background: linear-gradient(90deg, #00e5ff, #7c4dff);
    transition: width 0.3s ease;
    border-radius: 2px;
}

/* Line animation on focus */
.form-input:focus+.input-line {
    width: 100%;
}

/* ================ hero section style ================= */
/* ----------------- navbar section style start --------------- */
.th-topbar {
    height: 50px;
    background-color: #33322f;
}

.th-header {
    position: relative;
    z-index: 41;
}

.main-menu {
    background-color: transparent;

    a {
        display: block;
        position: relative;
        font-weight: 500;
        font-size: 16px;
        color: #ffffff;
        font-family: "Open Sans", sans-serif;
        background-color: transparent;
        transition: color 0.4s ease, text-shadow 0.3s ease;

        &:hover {
            color: #ffffff;
            text-shadow: 0px 0px 1px rgba(255, 255, 255, 0.8);
        }
    }


    >ul {
        >li {
            margin: 0 14px;

            >a {
                padding: 30px 0;
                transition: color 0.4s ease, text-shadow 0.3s ease;

                &:hover {
                    color: #ffffff;
                    text-shadow: 0px 0px 1px rgba(255, 255, 255, 0.8);
                }
            }
        }
    }

    ul {
        margin: 0;
        padding: 0;

        li {
            list-style-type: none;
            display: inline-block;
            position: relative;

            &.menu-item-has-children {
                >a {
                    color: #231f20;
                }
            }

            &:last-child {
                margin-right: 0 !important;
            }

            &:first-child {
                margin-left: 0 !important;
            }

            &:hover {
                >ul.sub-menu {
                    visibility: visible;
                    opacity: 1;
                    transform: scaleY(1);
                    z-index: 9;
                }

                ul.mega-menu {
                    visibility: visible;
                    opacity: 1;
                    z-index: 9;
                    transform: scaleY(1) translateX(-50%);
                }
            }
        }
    }

    ul.sub-menu,
    ul.mega-menu {
        position: absolute;
        text-align: left;
        top: 100%;
        background-color: #ffffff;
        visibility: hidden;
        min-width: 190px;
        width: max-content;
        padding: 7px;
        left: -14px;
        opacity: 0;
        z-index: -1;
        border: 0;
        box-shadow: 0 4px 15px rgba(1, 15, 28, 0.06);
        border-radius: 0;
        transform: scaleY(0);
        transform-origin: top center;
        transition: all 0.4s ease 0s;
        clip-path: polygon(0 2%,
                5.5% 1.85%,
                6% 0.1%,
                7% 1.85%,
                100% 2%,
                100% 25%,
                100% 24.85%,
                100% 14.02%,
                100% 25%,
                100% 100%,
                0 100%);

        a {
            font-size: 16px;
            line-height: 30px;
            font-weight: 400;
            color: #33322f;
            transition: color 0.4s ease, text-shadow 0.3s ease;
        }

        &:hover {
            color: #231f20;
            text-shadow: 0px 0px 1px rgba(255, 255, 255, 0.8);
        }
    }

    ul.sub-menu {
        padding: 18px 20px 18px 18px;
        left: -27px;

        li {
            display: block;
            margin: 0 0;
            padding: 0px 9px;

            &.menu-item-has-children {
                color: #231f20;

                >a:after {
                    content: '\\f105';
                    font-family: "Font Awesome 6 Pro";
                    float: right;
                    top: 1px;
                }
            }

            a {
                position: relative;
                padding-left: 23px;
                text-transform: capitalize;

                &:before {
                    content: "\f649";
                    position: absolute;
                    top: 8px;
                    left: 0;
                    font-family: "Font Awesome 6 Pro";
                    width: 11px;
                    height: 11px;
                    text-align: center;
                    border-radius: 50%;
                    display: inline-block;
                    font-size: 0.9em;
                    line-height: 1;
                    color: #231f20;
                    font-weight: 500;
                }
            }

            ul.sub-menu {
                left: 100%;
                right: auto;
                top: 0;
                margin: 0 0;
                margin-left: 20px;

                li {
                    ul {
                        left: 100%;
                        right: auto;
                    }
                }
            }
        }
    }

    .mega-menu-wrap {
        position: static;
    }

    ul.mega-menu {
        display: flex;
        justify-content: space-between;
        text-align: left;
        width: 100%;
        max-width: 1780px;
        padding: 20px 15px 23px 15px;
        left: 50%;
        transform: scaleY(0) translateX(-50%);

        li {
            display: block;
            width: 100%;
            padding: 0 15px;

            li {
                padding: 2px 0;
            }

            a {
                display: inline-block;
                text-transform: capitalize;

                &:hover {
                    color: #231f20;
                    text-shadow: 0px 0px 1px rgba(255, 255, 255, 0.8);
                }
            }
        }

        >li {
            >a {
                display: block;
                padding: 0;
                padding-bottom: 15px;
                margin-bottom: 10px;
                text-transform: capitalize;
                letter-spacing: 1px;
                font-weight: 700;
                color: #231f20;
                border-color: #231f20;

                &::after,
                &::before {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 15px;
                    height: 1px;
                    background-color: #231f20;
                }

                &::after {
                    width: calc(100% - 20px);
                    left: 20px;
                }

                &:hover {
                    padding-left: 0;
                    color: #231f20;
                    text-shadow: 0px 0px 6px rgba(255, 255, 255, 0.99);
                }
            }
        }
    }
}

.header-button {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 10px;

    .icon-btn {
        position: relative;

        &:hover {
            color: #ffffff;
            background-color: #231f20;
            border-color: #231f20;

            .badge {
                background-color: #ffffff;
                color: #231f20;
            }
        }
    }
}

.header-logo {
    padding-top: 15px;
    padding-bottom: 15px;
    width: 200px;
}

/* Header ---------------------------------- */
.header-layout {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;

    .menu-area {
        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background-color: rgba(#231F20, 0.5);
        }
    }

    &.menu-white {
        position: relative;

        .menu-area {
            &::before {
                background-color: #ffffff;
            }

            .main-menu {

                /* Hover effect for non-dropdown items only */
                .desktop-menu-item:not(.mega-menu-wrap) {
                    a {
                        color: #231f20;
                        position: relative;

                        span {

                            &:hover,
                            &.active {
                                box-shadow: none;
                                text-shadow: 0 0 1px rgba(0, 0, 0, 0.8);

                                &::before,
                                &:after {
                                    border-radius: 0;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

/* --------------- navbar section style end --------------- */

.th-hero {
    min-height: 688px;
    position: relative;
}

.background-image {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
}

/* ================= end hero section style ===================== */


/* img {
    max-width: 100%;
    height: auto;
    display: block;
} */

.pin {
    width: 30px;
    height: 30px;
    background: red;
    border-radius: 50%;
    cursor: grab;
}

.circle-point {
    width: 40px;
    height: 40px;
    border: 0.5px solid rgba(255, 255, 255, 1);
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    cursor: grab;
    position: absolute;
}

.circle-point::after {
    content: "";
    width: 18px;
    height: 18px;
    background: rgba(255, 255, 255, 1);
    border-radius: 50%;
    position: absolute;
    top: 10px;
    left: 10px;
}

.dot {
    width: 30px;
    height: 30px;
    background: rgb(10, 9, 9);
    border-radius: 50%;
    top: 7px;
    left: 7px;
    cursor: grab;
}

.label {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-weight: bold;
    white-space: nowrap;
}

.popup {
    display: none;
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    white-space: nowrap;
    z-index: 10;
}

.way-point {
    transition: opacity 0.3s ease-in-out;
    position: absolute;
    cursor: grab;
}

.way-point-link {
    position: absolute;
    left: -310px;
    top: 50%;
    transform: translateY(-5%);
    display: none;
    z-index: 10;
    width: 250px;
    height: 250px;
}

.way-point-link::before {
    content: "";
    position: absolute;
    right: -57px;
    top: -5px;
    width: var(--line-width, 90px);
    height: 1px;
    background: rgba(200, 200, 200, 0.6);
    transform: translateY(-50%);
}

.way-point-link::after {
    content: "";
    position: absolute;
    right: -70px;
    top: -10px;
    width: 1px;
    height: 40px;
    transform: rotate(-40deg);
    background: rgba(200, 200, 200, 0.6);
}

.way-point-link.active {
    display: block;
}

.way-point-link a {
    color: white;
    text-decoration: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, sans-serif;
    font-size: 20px;
    font-weight: 500;
    white-space: nowrap;
    display: block;
    padding: 4px 0;
    transition: opacity 0.2s ease;
    left: 55px;
    position: relative;
    top: -35px;
    text-align: right;
}

.way-point-link a:hover {
    opacity: 0.8;
}
</style>