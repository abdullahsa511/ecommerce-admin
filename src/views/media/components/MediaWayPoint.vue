
  
  <script setup>
  import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
  import { mediaUrl } from "@/utils/mediaUrl";
  
  /* ---------- Refs & State ---------- */
  const imgSrc = mediaUrl("/media/uploads2025/08/hero_home.jpg");
  const bannerWrapper = ref(null);
  const bannerImg = ref(null);
  const wayPoint = ref(null);
  const wayPointLink = ref(null);
  
  const positionPercent = ref({ left: null, top: null });
  const leftPx = ref(200); // initial px (will convert to percent on init)
  const topPx = ref(150);
  
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let isDragging = false;
  
  /* click detection */
  let clickStartTime = 0;
  let clickStartX = 0;
  let clickStartY = 0;
  
  /* timeouts */
  let resizeTimeout = null;
  
  /* ---------- Helpers ---------- */
  function updatePositionFromPercent() {
    const parent = bannerWrapper.value;
    if (!parent) return;
    if (positionPercent.value.left === null || positionPercent.value.top === null)
      return;
  
    leftPx.value = (positionPercent.value.left / 100) * parent.offsetWidth;
    topPx.value = (positionPercent.value.top / 100) * parent.offsetHeight;
  }
  
  function initializePosition() {
    const parent = bannerWrapper.value;
    const el = wayPoint.value;
    if (!parent || !el) return;
  
    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
  
    const parentWidth = parent.offsetWidth;
    const parentHeight = parent.offsetHeight;
  
    // guard
    if (parentWidth === 0 || parentHeight === 0) return;
  
    positionPercent.value.left =
      ((elRect.left - parentRect.left) / parentWidth) * 100;
    positionPercent.value.top =
      ((elRect.top - parentRect.top) / parentHeight) * 100;
  
    // set px values too (so element shows immediately)
    leftPx.value = (positionPercent.value.left / 100) * parentWidth;
    topPx.value = (positionPercent.value.top / 100) * parentHeight;
  }
  
  function updateLineWidth() {
    const linkBox = wayPointLink.value;
    if (!linkBox) return;
    const anchor = linkBox.querySelector("a");
    if (!anchor) return;
  
    // measure text width using temporary hidden span (same as your original)
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
  
  /* ---------- Drag & Drop ---------- */
  function onDragStart(e) {
    isDragging = true;
  
    const rect = wayPoint.value.getBoundingClientRect();
  
    // Hide link while dragging
    const link = wayPointLink.value;
    if (link) link.classList.remove("active");
  
    // store offsets
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
  
    // Prevent default ghost image:
    // use a tiny transparent image data URI as drag image (robust cross-browser)
    const transparentImg = new Image();
    transparentImg.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
    // NOTE: setDragImage must be called after image has a src (it is)
    e.dataTransfer.setDragImage(transparentImg, 0, 0);
  
    // allow move
    e.dataTransfer.effectAllowed = "move";
  }
  
  function onDragOver(e) {
    // handled via @dragover.prevent in template which calls this function
    // but we still need to update position visually while dragging
    e.preventDefault();
  
    const parentRect = bannerWrapper.value.getBoundingClientRect();
    const parentWidth = bannerWrapper.value.offsetWidth;
    const parentHeight = bannerWrapper.value.offsetHeight;
  
    let newX = e.clientX - parentRect.left - dragOffsetX;
    let newY = e.clientY - parentRect.top - dragOffsetY;
  
    const elWidth = wayPoint.value.offsetWidth;
    const elHeight = wayPoint.value.offsetHeight;
  
    newX = Math.max(0, Math.min(newX, parentWidth - elWidth));
    newY = Math.max(0, Math.min(newY, parentHeight - elHeight));
  
    leftPx.value = newX;
    topPx.value = newY;
  }
  
  function onDrop(e) {
    // compute percentages and store
    const parentRect = bannerWrapper.value.getBoundingClientRect();
    const parentWidth = bannerWrapper.value.offsetWidth;
    const parentHeight = bannerWrapper.value.offsetHeight;
  
    const elRect = wayPoint.value.getBoundingClientRect();
    const elWidth = wayPoint.value.offsetWidth;
    const elHeight = wayPoint.value.offsetHeight;
  
    const left = ((elRect.left - parentRect.left) / parentWidth) * 100;
    const top = ((elRect.top - parentRect.top) / parentHeight) * 100;
    const right = ((parentRect.right - elRect.right) / parentWidth) * 100;
    const bottom = ((parentRect.bottom - elRect.bottom) / parentHeight) * 100;
    const width = (elWidth / parentWidth) * 100;
    const height = (elHeight / parentHeight) * 100;
  
    positionPercent.value.left = left;
    positionPercent.value.top = top;
  
    // ensure px coords match percentages (handles resizing & consistent layout)
    updatePositionFromPercent();
  
    // log JSON (exact same structure as your original)
    console.log({
      left: parseFloat(left.toFixed(2)),
      top: parseFloat(top.toFixed(2)),
      right: parseFloat(right.toFixed(2)),
      bottom: parseFloat(bottom.toFixed(2)),
      width: parseFloat(width.toFixed(2)),
      height: parseFloat(height.toFixed(2)),
    });
  }
  
  /* dragend fallback (dropped outside) */
  function onDragEnd(e) {
    // reset dragging flag shortly after dragend to ensure click detection still works
    setTimeout(() => {
      isDragging = false;
    }, 100);
  
    // If drop didn't fire (dropEffect === "none"), calculate here too
    // Some browsers set dataTransfer.dropEffect to "none" when dropping outside
    try {
      const dropEffect = e.dataTransfer && e.dataTransfer.dropEffect;
      if (dropEffect === "none") {
        const parentRect = bannerWrapper.value.getBoundingClientRect();
        const parentWidth = bannerWrapper.value.offsetWidth;
        const parentHeight = bannerWrapper.value.offsetHeight;
  
        const elRect = wayPoint.value.getBoundingClientRect();
        const elWidth = wayPoint.value.offsetWidth;
        const elHeight = wayPoint.value.offsetHeight;
  
        const left = ((elRect.left - parentRect.left) / parentWidth) * 100;
        const top = ((elRect.top - parentRect.top) / parentHeight) * 100;
        const right = ((parentRect.right - elRect.right) / parentWidth) * 100;
        const bottom = ((parentRect.bottom - elRect.bottom) / parentHeight) * 100;
        const width = (elWidth / parentWidth) * 100;
        const height = (elHeight / parentHeight) * 100;
  
        positionPercent.value.left = left;
        positionPercent.value.top = top;
  
        updatePositionFromPercent();
  
        console.log({
          left: parseFloat(left.toFixed(2)),
          top: parseFloat(top.toFixed(2)),
          right: parseFloat(right.toFixed(2)),
          bottom: parseFloat(bottom.toFixed(2)),
          width: parseFloat(width.toFixed(2)),
          height: parseFloat(height.toFixed(2)),
        });
      }
    } catch (err) {
      // ignore if e.dataTransfer isn't available for some reason
    }
  }
  
  /* ---------- Click / Mouse logic (to distinguish click vs drag) ---------- */
  function onMouseDown(e) {
    clickStartTime = Date.now();
    clickStartX = e.clientX;
    clickStartY = e.clientY;
  }
  
  function onClick(e) {
    // If clicking the anchor, allow navigation
    if (e.target.closest(".way-point-link")) {
      return;
    }
  
    const clickDuration = Date.now() - clickStartTime;
    const clickDistance = Math.sqrt(
      Math.pow(e.clientX - clickStartX, 2) + Math.pow(e.clientY - clickStartY, 2)
    );
  
    if (clickDuration < 300 && clickDistance < 5 && !isDragging) {
      const link = wayPointLink.value;
      if (!link) return;
      link.classList.toggle("active");
  
      if (link.classList.contains("active")) {
        // ensure width calculation runs after it becomes visible
        nextTick(() => {
          updateLineWidth();
        });
      }
    }
  }
  
  /* ---------- Resize handling (fade out/in & reposition) ---------- */
  function onWindowResize() {
    // fade out & debounce reposition (like your original)
    const el = wayPoint.value;
    if (!el) return;
    el.style.opacity = "0";
  
    // clear any previous
    if (resizeTimeout) clearTimeout(resizeTimeout);
  
    resizeTimeout = setTimeout(() => {
      updatePositionFromPercent();
      nextTick(() => {
        updateLineWidth();
        el.style.opacity = "1";
      });
    }, 350); // 300ms transition + buffer
  }
  
  /* ---------- Image load ---------- */
  function onImageLoad() {
    // The image loaded — initialize and compute line width
    initializePosition();
    nextTick(() => {
      updateLineWidth();
    });
  }
  
  /* ---------- Lifecycle ---------- */
  onMounted(() => {
    // attempt initialization (in case image is cached)
    if (bannerImg.value && bannerImg.value.complete) {
      initializePosition();
      nextTick(updateLineWidth);
    }
  
    window.addEventListener("resize", onWindowResize);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener("resize", onWindowResize);
  });
  </script>

<template>
    <div
      id="banner-wrapper"
      ref="bannerWrapper"
      style="position: relative; width: 100%; max-width: 100%"
      @dragover.prevent="onDragOver"
      @drop.prevent="onDrop"
    >
      <img
        ref="bannerImg"
        id="wey-point-layout"
        :src="imgSrc"
        alt="Way Point Layout"
        style="width: 100%; display: block"
        @load="onImageLoad"
      />
  
      <div
        class="way-point"
        ref="wayPoint"
        :style="{ left: leftPx + 'px', top: topPx + 'px' }"
        draggable="true"
        @mousedown="onMouseDown"
        @click="onClick"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
      >
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
    width: 20px;
    height: 20px;
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
  