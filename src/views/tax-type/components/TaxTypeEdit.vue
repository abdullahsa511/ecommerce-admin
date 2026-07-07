<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useTaxTypeStore } from '@/stores/taxType';
import { storeToRefs } from 'pinia';
import TaxType from '@/models/TaxType';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const taxTypeStore = useTaxTypeStore();
const { taxTypes, newTaxType, fb } = storeToRefs(taxTypeStore);

const taxTypeId = route.params.id;
const emit = defineEmits(['update:taxType', 'saved', 'editTabUnmunted', 'editTabMounted']);

onMounted(async () => {
    emit('editTabMounted');
    await taxTypeStore.fetchTaxTypeById(taxTypeId);
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex gap-6">
            <div class="w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Tax Type Details
                </h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newTaxType.name" :disabled="fb.loading['taxType.update']" class="w-full text-lg border border-gray-200 rounded-md" id="name" type="text" placeholder="Name" :class="{ 'p-invalid': fb.errors['taxType.update.' + route.params.id]?.name }" />
                        <Message v-if="fb.errors['taxType.update.' + route.params.id]?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['taxType.update.' + route.params.id]?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Content</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newTaxType.content" :disabled="fb.loading['taxType.update']" class="w-full text-lg border border-gray-200 rounded-md" id="content" type="text" placeholder="Content" :class="{ 'p-invalid': fb.errors['taxType.update.' + route.params.id]?.content }" />
                        <Message v-if="fb.errors['taxType.update.' + route.params.id]?.content" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['taxType.update.' + route.params.id]?.content" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
            </div>
            <div class="w-2/5 space-y-4" v-if="fb.errors['taxType.update']">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Errors
                </h3>
                <div v-html="fb.renderErrors('taxType.update')" class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
label {
    font-size: 1.2rem;
}

:deep(input::placeholder),
:deep(textarea::placeholder) {
    color: #767779 !important;
    /* gray-600 equivalent */
    opacity: 1;
    font-size: 1.2rem;
}
</style>
