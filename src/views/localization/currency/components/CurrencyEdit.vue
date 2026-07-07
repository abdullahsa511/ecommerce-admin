<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCurrencyStore } from '@/stores/currency';
import { storeToRefs } from 'pinia';
const emit = defineEmits(['update:newCurrency', 'saved', 'editTabUnmunted', 'editTabMounted']);
const route = useRoute();
const currencyStore = useCurrencyStore();
const { newCurrency, fb } = storeToRefs(currencyStore);

const currencyId = route.params.id;

const statusOptions = ref([
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
]);


onMounted(async () => {
    emit('editTabMounted');
    await currencyStore.fetchCurrencyById(currencyId);
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full mt-3">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Currency</h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="name" type="text" v-model="newCurrency.name" placeholder="Name" :class="{'p-invalid': fb.errors['currency.update.' + currencyId]?.name}" />
                        <Message v-if="fb.errors['currency.update.' + currencyId]?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['currency.update.' + currencyId]?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="code" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Code</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="code" type="text" v-model="newCurrency.code" placeholder="Code" :class="{'p-invalid': fb.errors['currency.update.' + currencyId]?.code}" />
                        <Message v-if="fb.errors['currency.update.' + currencyId]?.code" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['currency.update.' + currencyId]?.code" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="sign_start" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Sign start</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="sign_start" type="text" v-model="newCurrency.sign_start" placeholder="Sign left" :class="{'p-invalid': fb.errors['currency.update.' + currencyId]?.sign_start}" />
                        <Message v-if="fb.errors['currency.update.' + currencyId]?.sign_start" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['currency.update.' + currencyId]?.sign_start" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="sign_end" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Sign end</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="sign_end" type="text" v-model="newCurrency.sign_end" placeholder="Sign right" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="decimal_place" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Decimal place</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber 
                            class="text-lg w-full" 
                            id="decimal_place" 
                            v-model="newCurrency.decimal_place" 
                            placeholder="Decimal place"
                            :min="0"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="value" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Value</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber 
                            class="text-lg w-full" 
                            id="value" 
                            v-model="newCurrency.value" 
                            placeholder="Value"
                            :min="0"
                            :minFractionDigits="4"
                            :maxFractionDigits="4"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            class="text-lg w-full" 
                            v-model="newCurrency.status" 
                            :options="statusOptions" 
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Status"
                        />
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
    color: #767779 !important;
    opacity: 1;
    font-size: 1.2rem;
}
</style> 