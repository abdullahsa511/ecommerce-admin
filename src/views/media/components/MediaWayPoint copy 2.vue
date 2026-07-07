<script setup>
import { ref, onMounted, nextTick } from "vue";

const wayPoint = ref(null);
const bannerWrapper = ref(null);
const bannerImg = ref(null);
const wayPointLink = ref(null);

let dragOffsetX = 0;
let dragOffsetY = 0;
let isDragging = false;

const positionPercent = ref({ left: null, top: null });
const leftPx = ref(200);
const topPx = ref(150);



const imageSrc = "/media/uploads2025/08/hero_home.jpg";

// ----------------------
// Convert % → px
// ----------------------
function updatePositionFromPercent() {
    const parent = bannerWrapper.value;
    if (!parent) return;

    leftPx.value = (positionPercent.value.left / 100) * parent.offsetWidth;
    topPx.value = (positionPercent.value.top / 100) * parent.offsetHeight;
}

// ----------------------
// Convert px → % (initial)
// ----------------------
function initializePosition() {
    const parent = bannerWrapper.value;
    const el = wayPoint.value;
    if (!parent || !el) return;

    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const w = parent.offsetWidth;
    const h = parent.offsetHeight;

    positionPercent.value.left = ((elRect.left - parentRect.left) / w) * 100;
    positionPercent.value.top = ((elRect.top - parentRect.top) / h) * 100;
}

// ----------------------
// Auto Width Calculation
// ----------------------
function updateLineWidth() {
    const linkBox = wayPointLink.value;
    if (!linkBox) return;

    const a = linkBox.querySelector("a");
    const temp = document.createElement("span");

    temp.style.visibility = "hidden";
    temp.style.position = "absolute";
    temp.style.whiteSpace = "nowrap";
    temp.style.fontSize = "20px";
    temp.style.fontWeight = "500";
    temp.textContent = a.textContent;

    document.body.appendChild(temp);
    const textWidth = temp.offsetWidth + 20;
    document.body.removeChild(temp);

    linkBox.style.setProperty("--line-width", `${textWidth}px`);
}

// ----------------------
// Drag Start
// ----------------------
function dragStart(e) {
    isDragging = true;

    const rect = wayPoint.value.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    // hide popup while dragging
    wayPointLink.value.classList.remove("active");

    // invisible drag ghost
    const img = document.createElement("div");
    img.style.opacity = 0;
    img.style.width = img.style.height = "1px";
    document.body.appendChild(img);
    e.dataTransfer.setDragImage(img, 0, 0);
    setTimeout(() => document.body.removeChild(img), 0);
}

// ----------------------
// Dragging Move
// ----------------------
function dragOver(e) {
    e.preventDefault();

    const parent = bannerWrapper.value;
    const el = wayPoint.value;

    const parentRect = parent.getBoundingClientRect();
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;

    let newX = e.clientX - parentRect.left - dragOffsetX;
    let newY = e.clientY - parentRect.top - dragOffsetY;

    newX = Math.max(0, Math.min(newX, w - el.offsetWidth));
    newY = Math.max(0, Math.min(newY, h - el.offsetHeight));

    leftPx.value = newX;
    topPx.value = newY;
}

// ----------------------
// Drop → store % position
// ----------------------
function drop(e) {
    const parent = bannerWrapper.value;
    const el = wayPoint.value;
    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const w = parent.offsetWidth;
    const h = parent.offsetHeight;

    positionPercent.value.left = ((elRect.left - parentRect.left) / w) * 100;
    positionPercent.value.top = ((elRect.top - parentRect.top) / h) * 100;

    updatePositionFromPercent();
}

// ----------------------
// Toggle Link On Click
// ----------------------
let clickStartX = 0;
let clickStartY = 0;
let clickStartTime = 0;

function mouseDown(e) {
    clickStartX = e.clientX;
    clickStartY = e.clientY;
    clickStartTime = Date.now();
}

function clicked(e) {
    const linkBox = wayPointLink.value;
    if (e.target.closest(".way-point-link")) return;

    const dist = Math.sqrt(
        (e.clientX - clickStartX) ** 2 + (e.clientY - clickStartY) ** 2
    );
    const duration = Date.now() - clickStartTime;

    if (!isDragging && dist < 5 && duration < 300) {
        linkBox.classList.toggle("active");
        nextTick(() => updateLineWidth());
    }
}

// ----------------------
// Resize Handler
// ----------------------
function handleResize() {
    wayPoint.value.style.opacity = 0;

    setTimeout(() => {
        updatePositionFromPercent();
        nextTick(() => {
            updateLineWidth();
            wayPoint.value.style.opacity = 1;
        });
    }, 300);
}

// ----------------------
// Lifecycle
// ----------------------
onMounted(() => {
    initializePosition();
    nextTick(updateLineWidth);

    window.addEventListener("resize", handleResize);

    bannerWrapper.value.addEventListener("dragover", dragOver);
});
</script>

<template>
    <div id="banner-wrapper" ref="bannerWrapper" style=" width: 100%; max-width: 100%">
        <img :src="imageSrc" alt="Way Point Layout" id="wey-point-layout" ref="bannerImg"
            style="width: 100%; display: block" />

        <div class="way-point" :style="{ position: 'absolute', left: leftPx + 'px', top: topPx + 'px' }"
            draggable="true" ref="wayPoint">
            <div class="circle-point" style="position: absolute"></div>

            <span class="way-point-link" ref="wayPointLink">
                <a href="/products/executive-suite">Test test test</a>
            </span>
        </div>
    </div>
</template>


<style scoped>
img {
    max-width: 100%;
    height: auto;
    display: block;
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
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 10px;
    left: 10px;
}

.way-point {
    position: absolute;
    transition: opacity 0.3s ease;
    cursor: grab;
}

.way-point-link {
    position: absolute;
    left: -310px;
    top: 50%;
    transform: translateY(-5%);
    width: 250px;
    height: 250px;
    display: none;
}

.way-point-link.active {
    display: block;
}

.way-point-link a {
    position: relative;
    top: -35px;
    left: 55px;
    font-size: 20px;
    font-weight: 500;
    color: white;
    text-decoration: none;
}

.way-point-link::before {
    content: "";
    position: absolute;
    right: -57px;
    top: -5px;
    height: 1px;
    width: var(--line-width, 90px);
    background: rgba(200, 200, 200, 0.6);
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
</style>