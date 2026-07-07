<script setup lang="ts">
import { ref, watch } from 'vue';
import PinboardCommentPanel from './PinboardCommentPanel.vue';
import { usePinboardCommentStore } from '../store/pinboardCommentStore';
import type { PinboardCommentContext } from '../models/PinboardComment';
import '../comment-panel.scss';

const props = defineProps<{
  visible: boolean;
  context: PinboardCommentContext | null;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const commentStore = usePinboardCommentStore();
const panelLoading = ref(false);

async function loadCommentsForContext(context: PinboardCommentContext) {
  panelLoading.value = true;
  try {
    await commentStore.loadComments({
      model_id: context.modelId,
      model_uuid: context.modelUuid,
      model_ref: context.modelRef,
      model_type: context.modelType,
    });
  } catch (error) {
    console.error('Failed to load pinboard item comments:', error);
  } finally {
    panelLoading.value = false;
  }
}

watch(
  () => [props.visible, props.context] as const,
  ([visible, context]) => {
    if (visible && context) {
      loadCommentsForContext(context);
    }
    if (!visible) {
      commentStore.reset();
    }
  },
  { immediate: true }
);

function onHide() {
  emit('update:visible', false);
}
</script>

<template>
  <Drawer
    :visible="visible"
    position="right"
    class="pinboard-comment-drawer offcanvas offcanvas-end"
    :style="{ width: 'min(100%, 40rem)' }"
    :pt="{
      content: { class: 'offcanvas-body p-0' },
      header: { class: 'offcanvas-header border-bottom' },
      title: { class: 'offcanvas-title' },
    }"
    :header="context?.title ? `Comments — ${context.title}` : 'Comment Feed'"
    @update:visible="onHide"
  >
    <div class="comment-panel-container">
      <div class="side-panel-content comment-sidebar">
        <div v-if="panelLoading && !commentStore.commentData.length" class="panel-loader flex justify-content-center py-8">
          <ProgressSpinner style="width: 48px; height: 48px" />
        </div>
        <PinboardCommentPanel v-else-if="context" :context="context" />
      </div>
    </div>
  </Drawer>
</template>
