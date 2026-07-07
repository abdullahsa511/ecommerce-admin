<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  count?: number;
  ariaLabel?: string;
}>();

defineEmits<{
  click: [];
}>();

const displayValue = computed(() => {
  const value = Number(props.count) || 0;
  if (value <= 0) return '+';
  return value > 99 ? '99+' : String(value);
});

const hasCount = computed(() => (Number(props.count) || 0) > 0);
</script>

<template>
  <button
    type="button"
    class="comment-bubble-btn border-none bg-transparent p-0 cursor-pointer"
    :aria-label="ariaLabel || 'Open comments'"
    @click="$emit('click')"
  >
    <i class="pi pi-comment comment-bubble-icon" aria-hidden="true" />
    <span
      class="comment-bubble-indicator"
      :class="{ 'comment-bubble-indicator--count': hasCount }"
    >
      {{ displayValue }}
    </span>
  </button>
</template>

<style scoped>
.comment-bubble-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

.comment-bubble-btn:hover {
  opacity: 0.8;
}

.comment-bubble-icon {
  display: block;
  font-size: 28px;
  line-height: 1;
  color: #231f20;
}

.comment-bubble-indicator {
  position: absolute;
  top: 45%;
  left: 53%;
  transform: translate(-50%, -50%);
  font-size: 15px;
  font-weight: 700;
  color: #000;
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

.comment-bubble-indicator--count {
  font-size: 12px;
  font-weight: 700;
}
</style>
