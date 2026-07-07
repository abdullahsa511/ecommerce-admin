<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import { WayPoint } from "@/models/WayPoint";
import { debounce } from 'lodash';

const emit = defineEmits(['update:wayPoints', 'remove:way-point', 'search:way-points-suggestions']);

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
    wayPointSuggestions: {
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
    // Safely handle cases where `props.wayPoints` is not an array (e.g. null, object, or undefined)
    if (Array.isArray(props.wayPoints)) {
        return [...props.wayPoints];
    }

    // If it's an object (e.g. keyed by id), try to convert to an array of values
    if (props.wayPoints && typeof props.wayPoints === 'object') {
        try {
            return Object.values(props.wayPoints);
        } catch (e) {
            return [];
        }
    }

    // Fallback to empty array
    return [];
}

// console.log('getPointsArray', getPointsArray());

const loadedWayPoints = ref([]);

/* ---------- Refs & State ---------- */
const imgSrc = props.imageSrc;
const bannerWrapper = ref(null);
const bannerImg = ref(null);
const wayPointLinkRefs = ref([]);

const img = document.getElementById("office-layout");


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

/** --------- Helpers --------- */
// Get accurate image dimensions that work across all browser zoom levels
const getImageDimensions = () => {
    if (!bannerImg?.value) return { width: 0, height: 0 };

    // Use offsetWidth/offsetHeight which are more reliable across zoom levels
    // These return the actual layout dimensions in CSS pixels
    const width = bannerImg.value.offsetWidth;
    const height = bannerImg.value.offsetHeight;

    return { width, height };
}

const prepareAndUpdateWayPoint = (data, index) => {
    const wayPoint = new WayPoint(data);
    loadedWayPoints.value[index] = wayPoint;
}

const updateWayPointPosition = (e, index) => {
    if (!bannerImg?.value) return;

    const rect = bannerImg.value.getBoundingClientRect();
    const { width: imgWidth, height: imgHeight } = getImageDimensions();

    if (!rect || imgWidth === 0 || imgHeight === 0) return;

    // Mouse position relative to the image
    // Account for browser zoom by using clientX/Y with getBoundingClientRect
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Ensure position is within bounds
    const clampedX = Math.max(0, Math.min(x, imgWidth));
    const clampedY = Math.max(0, Math.min(y, imgHeight));

    // Calculate position as percentage based on image size
    const xPercent = ((clampedX / imgWidth) * 100).toFixed(7);
    const yPercent = ((clampedY / imgHeight) * 100).toFixed(7);

    const point = loadedWayPoints.value[index];
    if (!point) return;

    prepareAndUpdateWayPoint({
        id: point.id,
        imageWidth: imgWidth,
        imageHeight: imgHeight,
        leftPx: clampedX,
        topPx: clampedY,
        leftPercent: xPercent,
        topPercent: yPercent,
        linkActive: point.linkActive,
        label: point.label || "Point " + (index + 1),
        href: point.href || "#",
    }, index);
    // console.log('loadedWayPoints', loadedWayPoints.value);
}

const updateWayPointsPositionOnWindowResized = (wayPointObject, index) => {
    if (!bannerImg?.value || !wayPointObject) return;

    // Get accurate dimensions that work across all browser zoom levels
    const { width: newImgWidth, height: newImgHeight } = getImageDimensions();

    if (newImgWidth === 0 || newImgHeight === 0) return;

    // Use percentages as the source of truth (zoom-independent)
    // Get existing percentages and convert to numbers if they're strings
    const existingLeftPercent = typeof wayPointObject.leftPercent === 'string'
        ? parseFloat(wayPointObject.leftPercent)
        : (wayPointObject.leftPercent || 0);
    const existingTopPercent = typeof wayPointObject.topPercent === 'string'
        ? parseFloat(wayPointObject.topPercent)
        : (wayPointObject.topPercent || 0);

    // Calculate new pixel positions from percentages
    // This ensures the position stays at the same percentage regardless of zoom level
    const newLeftPx = (existingLeftPercent / 100) * newImgWidth;
    const newTopPx = (existingTopPercent / 100) * newImgHeight;

    // Ensure positions are within bounds
    const clampedX = Math.max(0, Math.min(newLeftPx, newImgWidth));
    const clampedY = Math.max(0, Math.min(newTopPx, newImgHeight));

    // Recalculate percentages with 7 decimal places for accuracy (should match existing)
    const xPercent = newImgWidth > 0 ? ((clampedX / newImgWidth) * 100).toFixed(7) : "0.0000000";
    const yPercent = newImgHeight > 0 ? ((clampedY / newImgHeight) * 100).toFixed(7) : "0.0000000";

    prepareAndUpdateWayPoint({
        id: wayPointObject.id,
        imageWidth: newImgWidth,
        imageHeight: newImgHeight,
        leftPx: clampedX,
        topPx: clampedY,
        leftPercent: xPercent,
        topPercent: yPercent,
        linkActive: wayPointObject.linkActive,
        label: wayPointObject.label || "Point " + (index + 1),
        href: wayPointObject.href || "#",
    }, index);
    console.log('loadedWayPoints', loadedWayPoints.value);
}

const updateAllWayPointsPostionOnWindowResized = () => {
    loadedWayPoints.value.forEach((pointObject, index) => {
        updateWayPointsPositionOnWindowResized(pointObject, index);
    });
}


const searchWayPointLabel = (event) => {
    const query = event.data?.toLowerCase();
    emit('search:way-points-suggestions', query);
    // console.log('query', query);
    // // static data for suggestions with filter by query
    // wayPointLabelSuggestions.value = dummyData.value.filter(item => item.label.toLowerCase().includes(query));
    // console.log('wayPointLabelSuggestions', wayPointLabelSuggestions.value);
}


function addWayPointLabel(event, pointId) {
    const selected = event.value; // the suggestion object selected
    //   console.log('selected', selected);
    //   console.log('pointId', pointId);
    const point = loadedWayPoints.value.find(p => p.id === pointId);
    if (point) {
        point.label = selected.label;
        point.href = selected.href;
    }
    // console.log('loadedWayPoints', loadedWayPoints.value);
}

/* ---------- Drag & Drop ---------- */
function onDragStart(e, index) {
    isDragging = true;
    activeDragIndex = index;

    // Hide the drag image by creating a transparent image
    const dragImage = document.createElement('img');
    dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    dragImage.style.opacity = '0';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);

    // Clean up the temporary image after a short delay
    setTimeout(() => {
        if (document.body.contains(dragImage)) {
            document.body.removeChild(dragImage);
        }
    }, 0);

    // Set drag effect
    e.dataTransfer.effectAllowed = 'move';
}

function onDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
}

function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();

    if (activeDragIndex >= 0 && isDragging) {
        updateWayPointPosition(e, activeDragIndex);
    }
}

function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    if (activeDragIndex >= 0 && isDragging) {
        updateWayPointPosition(e, activeDragIndex);
    }

    // Reset drag state
    isDragging = false;
    activeDragIndex = -1;
}

function onDragEnd(e, index) {
    // Final position update
    if (activeDragIndex >= 0) {
        updateWayPointPosition(e, activeDragIndex);
    }

    // Reset drag state
    isDragging = false;
    activeDragIndex = -1;
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
        const point = loadedWayPoints.value[index];
        if (!point) return;
        point.linkActive = !point.linkActive;
    }
}

function addWayPoint() {
    const newWayPoint = new WayPoint({
        id: loadedWayPoints.value.length + 1,
        leftPx: 0 + (loadedWayPoints.value.length * 60),
        topPx: 0 + (loadedWayPoints.value.length * 40),
        leftPercent: 0,
        topPercent: 0,
        linkActive: false,
        label: "Point " + (loadedWayPoints.value.length + 1),
        href: "#",
    });
    // console.log('newWayPoint', newWayPoint);
    loadedWayPoints.value.push(newWayPoint);
}

/* ---------- Lifecycle ---------- */
const onWayPointLabelInput = debounce(searchWayPointLabel, 300);
function saveWayPoints() {
    // console.log('loadedWayPoints', loadedWayPoints.value);
    emit('update:wayPoints', loadedWayPoints.value);
}

function removeWayPoint(pointId) {
    loadedWayPoints.value = loadedWayPoints.value.filter(point => point.id !== pointId);
    // emit('remove:way-point', pointId);
}

onMounted(() => {
    loadedWayPoints.value = getPointsArray();
    window.addEventListener('resize', updateAllWayPointsPostionOnWindowResized);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateAllWayPointsPostionOnWindowResized);
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
                    <div class="container th-container layout-content-wrapper-inside">
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
            @load="onImageLoad" :style="{ backgroundImage: 'url(' + imgSrc + ')' }" @dragenter="onDragEnter"
            @dragover="onDragOver" @drop="onDrop">

            <div v-for="(point, index) in loadedWayPoints" :key="point.id" :id="point.id" class="way-point"
                draggable="true" :style="{ left: point.leftPercent + '%', top: point.topPercent + '%' }"
                @mousedown="onMouseDown" @click="onClick($event, index)" @dragstart="onDragStart($event, index)"
                @dragend="onDragEnd($event, index)">
                <div class="circle-point" style="position: absolute"></div>
                <div class="circle-point" style="position: absolute"></div>

                <span class="way-point-link" :class="{ active: point.linkActive }">
                    <form class="waypoint-form">
                        <div class="input-group">
                            <!-- <input type="text" class="form-input" v-model="point.label" placeholder="Label name" /> -->
                            <AutoComplete class="form-input w-full" type="text" v-model="point.label"
                                @input="onWayPointLabelInput" optionLabel="label" :suggestions="wayPointSuggestions"
                                @item-select="addWayPointLabel($event, point.id)" />
                                <div class="flex items-center justify-center top-0 right-[-10px]" style="position: absolute;">
                                    <Button 
                                       class="text-white p-1 text-xs w-5 h-5" 
                                       type="button" 
                                       severity="danger" 
                                       icon="pi pi-times" 
                                       @click="removeWayPoint(point.id)" 
                                       style="border-radius: 50%;"
                                    />
                                </div>
                        </div>

                        <div class="input-group">
                            <input type="text" class="form-input" v-model="point.href" placeholder="Link URL" />
                            <span class="input-line"></span>
                        </div>
                    </form>
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

    .input-group {
        .p-autocomplete {
            padding: 2px 0px;
            &:hover,
            &:focus {
                background: rgba(0, 0, 0, 0.45);
                border-color: #00e5ff;
                box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.25);
            }
        }
     
    }
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
    user-select: none;
    -webkit-user-drag: element;
}

.way-point:active {
    cursor: grabbing;
}

.way-point.dragging {
    opacity: 0.8;
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