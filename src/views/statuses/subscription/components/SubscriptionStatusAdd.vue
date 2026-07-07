<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useSubscriptionStatusStore } from '@/stores/subscriptionStatus';
import { storeToRefs } from 'pinia';
import { useLanguageStore } from '@/stores/language';

const subscriptionStatusStore = useSubscriptionStatusStore();
const languageStore = useLanguageStore();
const {languages} = storeToRefs(languageStore);
const {fb, subscriptionStatus} = storeToRefs(subscriptionStatusStore);

const emit = defineEmits(['update:subscriptionStatus', 'saved', 'editTabUnmunted', 'editTabMounted']);

onMounted(() => {
    emit('editTabMounted');
    languageStore.fetchLanguages();
});

onUnmounted(() => {
    emit('editTabUnmunted');
});

</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-3/5 mt-3">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Subscription Status Details
                </h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="name" type="text" placeholder="Name" v-model="subscriptionStatus.name" 
                        :class="{'p-invalid': fb.errors['subscriptionStatus.create']?.name}" />
                        <Message v-if="fb.errors['subscriptionStatus.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['subscriptionStatus.create']?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Language</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select v-model="subscriptionStatus.language_id" :options="languages" optionLabel="name" optionValue="language_id" placeholder="Select a Language" class="w-full md:w-56 text-lg" 
                        :class="{'p-invalid': fb.errors['subscriptionStatus.create']?.language_id}" />
                        <Message v-if="fb.errors['subscriptionStatus.create']?.language_id" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['subscriptionStatus.create']?.language_id" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

            </div>
        </div>
    </Fluid>
</template>

<style scoped>
label {
    font-size: 1.2rem;
}
:deep(input::placeholder),
:deep(textarea::placeholder) {
    color: #767779 !important; /* gray-600 equivalent */
    opacity: 1;
    font-size: 1.2rem;
}

</style>
