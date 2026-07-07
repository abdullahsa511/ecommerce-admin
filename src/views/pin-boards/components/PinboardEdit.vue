<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useLengthTypeStore } from '@/stores/lengthType';


const emit = defineEmits(['update:lengthType', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const lengthTypeStore = useLengthTypeStore();
const { lengthType } = storeToRefs(lengthTypeStore);

onMounted(async () => {
    emit('editTabMounted');
    if (route.params.id) {
        await lengthTypeStore.fetchLengthTypeById(route.params.id as string);//string data type
    }
    // if (postTagGroup.value.postTag_group_id) {
    //   selectedGroup.value = postTagGroup.value.postTag_group_id;
    // }

});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex gap-6">
            <!-- Left column: Length Type Form -->
            <div class="w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Length Type</h3>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Length Type user -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">
                        Name
                    </label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="lengthType.name" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter tag name"/>
                    </div>
                  
                    <!-- description  -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Unit</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <Textarea v-model="lengthType.unit"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter description" />
                    </div>
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Value</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="lengthType.value"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter value" type="number" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Optional custom styles */
</style>
