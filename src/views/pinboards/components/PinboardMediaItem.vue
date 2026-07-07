<script setup lang="ts">
import { IItemEdit } from '@/models/Pinboard';

const emit = defineEmits(['updatePinboardMediaItem', 'remove']);

const props = defineProps<{
    item: IItemEdit;
}>();

const updateItem = () => {
    emit('updatePinboardMediaItem', props.item);
};
</script>

<template>
    <div class="th-pinboard-item position-relative">
        <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2" aria-label="Remove" @click="$emit('remove', item)">
            <i class="fa fa-times">x</i>
        </button>
          <div class="row">
            <div class="col-md-4">
              <div class="th-pinboard-item-img border">
                <img src="/demo/images/product/product-placeholder.svg" class="img-fluid rounded-start" alt="...">
              </div>
            </div>
            <div class="col-md-8">
              <div class="th-pinboard-item-info">
                <div class="card-body position-relative">
                  <button type="button" class="btn-close position-absolute top-0 end-0 p-2" aria-label="Close" @click="updateItem"></button>
                  <div class="th-pinboard-info-body">
                    <h4 class="fw-bold font-wight-700">Media</h4>
                    <h4 class="card-title font-wight-700">
                      {{ 'name' in item ? item.name : 'content' in item ? (item.content as string).substring(0, 50) + ((item.content as string).length > 50 ? '...' : '') : 'Media Item' }}
                    </h4>

                    <div class="th-pinboard-item-circle">
                      <div class="th-circle-items">
                        <img src="/demo/images/product/blue-t-shirt.jpg" class="rounded-circle border border-light" alt="Option 1">
                        <img src="/demo/images/product/green-t-shirt.jpg" class="rounded-circle border border-light" alt="Option 2">

                        <img src="/demo/images/product/purple-t-shirt.jpg" class="rounded-circle border border-light" alt="Option 3">
                        <img src="/demo/images/product/light-green-t-shirt.jpg" class="rounded-circle border border-light" alt="Option 4">
                      </div>
                    </div>

                    <!-- Quote -->
                    <div class="th-pinboard-item-edit">
                      <div class="th-pinboard-item-blockquote border d-flex justify-content-between align-items-start">
                        <blockquote class="th-blockquote-txt">
                          <p class="fst-italic">
                            "{{ 'description' in item ? item.description : 'content' in item ? item.content : 'Media description' }}"
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
                      <a href="contact.html" class="th-btn-gray text-capitalize">
                        <span class="mr-5">Accept Quote</span>
                      </a>
                      <a href="contact.html" class="th-btn-primary text-capitalize">
                        <span class="mr-5">Accept Quote</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
</template>