<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

//System variables such as props, useStore or stateToRef etc
const props = defineProps({  })

//Declear emits
const emit = defineEmits(['editTabUnmunted']);

//Define local variables here

//Define local methods here
const localMethod = () => {  }

//Lifecycle hook started from here
onMounted(() => {  })

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
  <div class="attribute-edit">
    <h1>Attribute Edit</h1>
  </div>
</template>