<script setup>
//Import
import { ref, onMounted } from 'vue'

//System variables
const userStore = useUserStore()

//Props
const props = defineProps({  })

//Emit
const emit = defineEmits({  })

//Local variables
const x = ref()

//Computed variables
const y = () => {  }

//Life cycle hooks
onMounted(() => {  })

//Local Methods
const onClick = () => {
  console.log('clicked')
}

//Watch variables
watch(x, (newVal) => {
  console.log('x changed', newVal)
})

</script>

<template>
  <div class="component-name"></div>
</template>