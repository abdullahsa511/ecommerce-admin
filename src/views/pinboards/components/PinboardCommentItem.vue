<script setup lang="ts">
import { IItemCommentEdit } from '@/models/Pinboard';

const emit = defineEmits(['updatePinboardCommentItem', 'remove']);

const props = defineProps<{
    item: IItemCommentEdit;
}>();

const updateItem = () => {
    emit('updatePinboardCommentItem', props.item);
};
</script>

<template>
    <div class="th-pinboard-item position-relative">
        <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2" aria-label="Remove" @click="$emit('remove', item)">
            <i class="fa fa-times">x</i>
        </button>
        <div class="row">
            <div class="col-md-4">
                <div class="th-pinboard-item-img">
                    <img src="/demo/images/avatar/avatar-f-1.png" class="img-fluid rounded-start" alt="Comment Image">
                </div>
            </div>
            <div class="col-md-8">
                <div class="th-pinboard-item-info">
                    <div class="card-body position-relative">
                        <button type="button" class="btn-close position-absolute top-0 end-0 p-2" aria-label="Close" @click="updateItem"></button>
                        <div class="th-pinboard-info-body">
                            <h4 class="fw-bold font-wight-700">Comment</h4>
                            <h4 class="card-title font-wight-700">
                                {{ item.comment_author }}
                            </h4>
                            <div v-if="item.comment_content" class="mb-2">
                                <strong>Content:</strong> {{ item.comment_content }}
                            </div>
                            <!-- Comment Box -->
                            <input type="text" class="" placeholder="Add A Comment">
                            <!-- Buttons -->
                            <div class="th-doc-actions th-pinbord-item-comment">
                                <a href="#" class="th-btn-gray text-capitalize">
                                    <span class="mr-5">Update Comment</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
