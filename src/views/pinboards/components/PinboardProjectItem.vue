<script setup lang="ts">
import { IItemProjectEdit } from '@/models/Pinboard';
import { PhotoService } from './PhotoService.js';
import { ref, onMounted } from 'vue';

const emit = defineEmits(['updatePinboardProjectItem', 'remove']);

const props = defineProps<{
    item: IItemProjectEdit;
}>();

const updateItem = () => {
    emit('updatePinboardProjectItem', props.item);
};

const images = ref();
const selectedImage = ref('');
const showModal = ref(false);
const modalIndex = ref(0);
const touchStartX = ref(0);

onMounted(() => {
    PhotoService.getImages().then((data: any) => {
        images.value = data;
        selectedImage.value = data[0]?.itemImageSrc || '';
    });
});

function openModal(idx: number) {
  modalIndex.value = idx;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}
function nextImage() {
  if (images.value && images.value.length) {
    modalIndex.value = (modalIndex.value + 1) % images.value.length;
  }
}
function prevImage() {
  if (images.value && images.value.length) {
    modalIndex.value = (modalIndex.value - 1 + images.value.length) % images.value.length;
  }
}
function handleSwipe(e: TouchEvent) {
  const deltaX = e.changedTouches[0].clientX - touchStartX.value;
  if (deltaX > 50) prevImage();
  else if (deltaX < -50) nextImage();
}
</script>

<template>
    <div class="th-pinboard-item position-relative">
        <button type="button" class="btn btn-danger btn-sm position-absolute top-0 start-0 m-2" aria-label="Remove" @click="$emit('remove', item)">
            <i class="fa fa-times">x</i>
        </button>
        <div class="row">
            <div class="col-md-4">
                <div class="th-pinboard-item-img">
                    <img :src="selectedImage" class="img-fluid rounded-start" alt="Product Image" style="cursor:pointer;" @click="openModal(images.findIndex((img: any) => img.itemImageSrc === selectedImage))">
                </div>
            </div>
            <div class="col-md-8">
                <div class="th-pinboard-item-info">
                    <div class="card-body ">
                        
                        <div class="th-pinboard-info-body">
                            <h4 class="fw-bold font-wight-700">Project</h4>
                            <h4 class="card-title font-wight-700">
                                {{ item.project_name }}
                            </h4>

                            <div class="th-pinboard-item-circle">
                                <div class="th-circle-items">
                                    <img
                                        v-for="(img, idx) in images"
                                        :key="idx"
                                        :src="img.thumbnailImageSrc"
                                        :alt="img.alt"
                                        style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid #eee;"
                                        @click="selectedImage = img.itemImageSrc"
                                    />
                                </div>
                            </div>

                            <!-- Quote -->
                            <div class="th-pinboard-item-edit">
                                <div class="th-pinboard-item-blockquote border d-flex justify-content-between align-items-start">
                                    <blockquote class="th-blockquote-txt">
                                        <p class="fst-italic">
                                            "{{ item.project_description }}"
                                        </p>
                                    </blockquote>
                                    <div class="th-blockquote-edit-icon text-end">
                                        <button class="btn">
                                            <i class="fa-solid fa-pencil"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Comment Box -->
                            <input type="text" class="" placeholder="Add A Comment">

                            <!-- Buttons -->
                            <div class="th-doc-actions th-pinbord-item-comment">
                                <a href="#" class="th-btn-gray text-capitalize">
                                    <span class="mr-5">Update Item</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <template v-if="showModal">
      <div
        style="position: fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:9999; display:flex; align-items:center; justify-content:center;"
        @click.self="closeModal"
        @touchstart="touchStartX = $event.touches[0].clientX"
        @touchend="handleSwipe($event)"
      >
        <div style="position:relative; max-width:90vw; max-height:90vh; display:flex; align-items:center;">
          <button @click.stop="prevImage" style="position:absolute; left:-40px; top:50%; transform:translateY(-50%); font-size:2rem; background:none; border:none; color:white; cursor:pointer;">&#8592;</button>
          <img
            :src="images[modalIndex]?.itemImageSrc"
            :alt="images[modalIndex]?.alt"
            style="max-width:80vw; max-height:80vh; border-radius:8px; background:white;"
          />
          <button @click.stop="nextImage" style="position:absolute; right:-40px; top:50%; transform:translateY(-50%); font-size:2rem; background:none; border:none; color:white; cursor:pointer;">&#8594;</button>
        </div>
      </div>
    </template>
</template>
