<script setup lang="ts">
import { onMounted, computed } from 'vue';
import Site from '@/models/Site';
// @ts-ignore
import { useCountryStore } from '@/stores/country';
// @ts-ignore
import { useRegionStore } from '@/stores/region';
// @ts-ignore
import { useLanguageStore } from '@/stores/language';
// @ts-ignore
import { useCurrencyStore } from '@/stores/currency';
// @ts-ignore
import { useLengthTypeStore } from '@/stores/lengthType';
// @ts-ignore
import { useWeightTypeStore } from '@/stores/weightType';
// @ts-ignore
import { useTimezoneStore } from '@/stores/timezone';

import { storeToRefs } from 'pinia';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { useRoute } from 'vue-router';

const emit = defineEmits(['update:site', 'saved']);
const route = useRoute();


const props = defineProps({
  site: {
    type: Site,
    required: true,
    default: () => new Site()
  },
  fb: {
    type: FeedbackHandler,
    required: false,
    default: () => new FeedbackHandler()
  }
});

const siteId = computed(() => {
    const routeId = route.params.id;
    const normalizedRouteId = Array.isArray(routeId) ? routeId[0] : routeId;
    return props.site.site_id ?? normalizedRouteId ?? '';
});


// Initialize stores
const countryStore = useCountryStore();
const regionStore = useRegionStore();
const languageStore = useLanguageStore();
const currencyStore = useCurrencyStore();
const lengthTypeStore = useLengthTypeStore();
const weightTypeStore = useWeightTypeStore();
const timezoneStore = useTimezoneStore();
const { timezones } = storeToRefs(timezoneStore);
// Get reactive lists
const { countries } = storeToRefs(countryStore);
const { regions } = storeToRefs(regionStore);
const { languages } = storeToRefs(languageStore);
const { currencies } = storeToRefs(currencyStore);
const { lengthTypes } = storeToRefs(lengthTypeStore);
const { weightTypes } = storeToRefs(weightTypeStore);

// Add debug logging to check the data
onMounted(() => {
    if (!countries.value.length) countryStore.fetchCountries();
    if (!regions.value.length) regionStore.fetchRegions();
    if (!languages.value.length) languageStore.fetchLanguages();
    if (!currencies.value.length) currencyStore.fetchCurrencies();
    if (!lengthTypes.value.length) lengthTypeStore.fetchLengthTypes();
    if (!weightTypes.value.length) weightTypeStore.fetchWeightTypes();

    if(!timezones.value.length) timezoneStore.fetchTimezones();
});



</script>

<template>
    <!-- Local Tab -->
    <div class="flex flex-col gap-6">

        <div class="loading-overlay" v-if="siteId && props.fb?.loading?.['site.edit.' + siteId] || props.fb?.loading?.['site.create']">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading site data. Please wait.</p>
            </div>
        </div>


        <!-- Address -->
        <div class="grid grid-cols-12 gap-2">
            <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Address</label>
            <div class="col-span-12 md:col-span-10">
                <InputText v-model="site.localSettings.address" class="w-full text-lg" :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.address || fb?.errors?.['site.create']?.address}" 
                />
                    <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.address || props.fb?.errors?.['site.create']?.address" severity="error" size="small" variant="title">
                        <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.address || props.fb?.errors?.['site.create']?.address" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
            </div>
        </div>

        <!-- Geocode -->
        <div class="grid grid-cols-12 gap-2">
            <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Geocode</label>
            <div class="col-span-12 md:col-span-10">
                <InputText v-model="site.localSettings.geocode" class="w-full text-lg" :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.geocode || fb?.errors?.['site.create']?.geocode}" />
                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.geocode || props.fb?.errors?.['site.create']?.geocode" severity="error" size="small" variant="title">
                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.geocode || props.fb?.errors?.['site.create']?.geocode" :key="error" class="flex flex-col">
                        {{ error }}
                    </span>
                </Message>
            </div>
        </div>

        <!-- Country -->
        <div class="grid grid-cols-12 gap-2">
            <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Country</label>
            <div class="col-span-12 md:col-span-10">
                <Select filter
                    v-model="site.localSettings.country_id" 
                    :options="countries" 
                    optionLabel="name" 
                    optionValue="country_id"
                    placeholder="Select a Country" 
                    class="w-full text-lg"
                    :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.country_id || fb?.errors?.['site.create']?.country_id}"
                />
                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.country_id || props.fb?.errors?.['site.create']?.country_id" severity="error" size="small" variant="title">
                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.country_id || props.fb?.errors?.['site.create']?.country_id" :key="error" class="flex flex-col">
                        {{ error }}
                    </span>
                </Message>
            </div>
        </div>

        <!-- Region/State -->
        <div class="grid grid-cols-12 gap-2">
            <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Region / State</label>
            <div class="col-span-12 md:col-span-10">
                <Select 
                    v-model="site.localSettings.region_id" 
                    :options="regions" 
                    optionLabel="name" 
                    optionValue="region_id"
                    placeholder="Select a State" 
                    class="w-full text-lg"
                    :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.region_id || fb?.errors?.['site.create']?.region_id}"
                />
                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.region_id || props.fb?.errors?.['site.create']?.region_id" severity="error" size="small" variant="title">
                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.region_id || props.fb?.errors?.['site.create']?.region_id" :key="error" class="flex flex-col">
                        {{ error }}
                    </span>
                </Message>
            </div>
        </div>

        <!-- Company -->
        <div class="grid grid-cols-12 gap-2">
            <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Company</label>
            <div class="col-span-12 md:col-span-10">
                <InputText v-model="site.localSettings.company" class="w-full text-lg" :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.company || fb?.errors?.['site.create']?.company}" />
                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.company || props.fb?.errors?.['site.create']?.company" severity="error" size="small" variant="title">
                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.company || props.fb?.errors?.['site.create']?.company" :key="error" class="flex flex-col">
                        {{ error }}
                    </span>
                </Message>
            </div>
        </div>

        <!-- VAT Id -->
        <div class="grid grid-cols-12 gap-2">
            <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">VAT Id</label>
            <div class="col-span-12 md:col-span-10">
                <InputText v-model="site.localSettings.vat_id" class="w-full text-lg" :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.vat_id || fb?.errors?.['site.create']?.vat_id}" />
                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.vat_id || props.fb?.errors?.['site.create']?.vat_id" severity="error" size="small" variant="title">
                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.vat_id || props.fb?.errors?.['site.create']?.vat_id" :key="error" class="flex flex-col">
                        {{ error }}
                    </span>
                </Message>
            </div>
        </div>

        <!-- Defaults Section -->
        <div class="mt-8">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-6">Defaults</h3>
            
            <!-- Default Language -->
            <div class="grid grid-cols-12 gap-2 mb-4">
                <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Default Language</label>
                <div class="col-span-12 md:col-span-10">
                    <Select 
                        v-model="site.localSettings.language_id" 
                        :options="languages" 
                        optionLabel="name" 
                        optionValue="language_id"
                        placeholder="Select a Language" 
                        class="w-full text-lg"
                        :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.language_id || fb?.errors?.['site.create']?.language_id}"
                    />
                    <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.language_id || props.fb?.errors?.['site.create']?.language_id" severity="error" size="small" variant="title">
                        <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.language_id || props.fb?.errors?.['site.create']?.language_id" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
            </div>

            <!-- Default Currency -->
            <div class="grid grid-cols-12 gap-2 mb-4">
                <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Default Currency</label>
                <div class="col-span-12 md:col-span-10">
                    <Select 
                        v-model="site.localSettings.currency_id" 
                        :options="currencies" 
                        optionLabel="name" 
                        optionValue="currency_id"
                        placeholder="Select a Currency" 
                        class="w-full text-lg"
                        :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.currency_id || fb?.errors?.['site.create']?.currency_id}"
                    />
                    <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.currency_id || props.fb?.errors?.['site.create']?.currency_id" severity="error" size="small" variant="title">
                        <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.currency_id || props.fb?.errors?.['site.create']?.currency_id" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
            </div>

            <!-- Length Class -->
            <div class="grid grid-cols-12 gap-2 mb-4">
                <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Length Class</label>
                <div class="col-span-12 md:col-span-10">
                    <Select 
                        v-model="site.localSettings.length_type_id" 
                        :options="lengthTypes" 
                        optionLabel="name" 
                        optionValue="length_type_id"
                        placeholder="Select Length Class" 
                        class="w-full text-lg"
                        :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.length_type_id || fb?.errors?.['site.create']?.length_type_id}"
                    />
                    <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.length_type_id || props.fb?.errors?.['site.create']?.length_type_id" severity="error" size="small" variant="title">
                        <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.length_type_id || props.fb?.errors?.['site.create']?.length_type_id" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
            </div>

            <!-- Weight Class -->
            <div class="grid grid-cols-12 gap-2 mb-4">
                <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Weight Class</label>
                <div class="col-span-12 md:col-span-10">
                    <Select 
                        v-model="site.localSettings.weight_type_id" 
                        :options="weightTypes" 
                        optionLabel="name" 
                        optionValue="weight_type_id"
                        placeholder="Select Weight Class" 
                        class="w-full text-lg"
                        :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.weight_type_id || fb?.errors?.['site.create']?.weight_type_id}"
                    />
                    <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.weight_type_id || props.fb?.errors?.['site.create']?.weight_type_id" severity="error" size="small" variant="title">
                        <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.weight_type_id || props.fb?.errors?.['site.create']?.weight_type_id" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
            </div>
        </div>

        <!-- Time Section -->
        <div class="mt-8">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-6">Time</h3>
            
            <!-- Timezone -->
            <div class="grid grid-cols-12 gap-2 mb-6">
                <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Timezone</label>
                <div class="col-span-12 md:col-span-10">
                    <Select filter
                        v-model="site.localSettings.timezone" 
                        :options="timezones" 
                        optionLabel="timezone" 
                        optionValue="timezone_id"
                        placeholder="Select a Timezone" 
                        class="w-full text-lg"
                        :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.timezone || fb?.errors?.['site.create']?.timezone}"
                    />
                    <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.timezone || props.fb?.errors?.['site.create']?.timezone" severity="error" size="small" variant="title">
                        <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.timezone || props.fb?.errors?.['site.create']?.timezone" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
            </div>

            <!-- Date format -->
            <div class="grid grid-cols-12 gap-2 mb-6">
                <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Date format</label>
                <div class="col-span-12 md:col-span-10">
                    <div class="flex flex-row gap-3">
                        <div class="flex items-center gap-2">
                            <RadioButton v-model="site.localSettings.date_format" value="F j, Y" />
                            <label class="text-lg">April 23, 2025 <span class="text-red-500 text-sm bg-gray-100 px-1 rounded">F j, Y</span></label>
                        </div>
                        <div class="flex items-center gap-2">
                            <RadioButton v-model="site.localSettings.date_format" value="Y-m-d" />
                            <label class="text-lg">2025-04-23 <span class="text-red-500 text-sm bg-gray-100 px-1 rounded">Y-m-d</span></label>
                        </div>
                        <div class="flex items-center gap-2">
                            <RadioButton v-model="site.localSettings.date_format" value="m/d/Y" />
                            <label class="text-lg">04/23/2025 <span class="text-red-500 text-sm bg-gray-100 px-1 rounded">m/d/Y</span></label>
                        </div>
                        <div class="flex items-center gap-2">
                            <RadioButton v-model="site.localSettings.date_format" value="d/m/Y" />
                            <label class="text-lg">23/04/2025 <span class="text-red-500 text-sm bg-gray-100 px-1 rounded">d/m/Y</span></label>
                        </div>
                        <div class="flex items-center gap-2">
                            <RadioButton v-model="site.localSettings.date_format" value="custom" />
                            <label class="text-lg">Custom:</label>
                        </div>
                       
                    </div>
                    <div v-if="site.localSettings.date_format === 'custom'" class="mt-2">
                        <InputText  v-model="site.localSettings.custom_date_format" placeholder="F j, Y" class="w-full text-lg" 
                        :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.custom_date_format || fb?.errors?.['site.create']?.custom_date_format}"
                        />
                        <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.custom_date_format || props.fb?.errors?.['site.create']?.custom_date_format" severity="error" size="small" variant="title">
                            <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.custom_date_format || props.fb?.errors?.['site.create']?.custom_date_format" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                        <div class="text-gray-600 mt-1">Preview: <span>November 12, 2023</span></div>
                    </div>
                </div>
            </div>

                <!-- Time format -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Time format</label>
                    <div class="col-span-12 md:col-span-10">
                        <div class="flex flex-row gap-3">
                            <div class="flex items-center gap-2">
                                <RadioButton v-model="site.localSettings.time_format" value="8:53 am" />
                                <label class="text-lg">8:53 am <span class="text-red-500 text-sm bg-gray-100 px-1 rounded">g:i a</span></label>
                            </div>
                            <div class="flex items-center gap-2">
                                <RadioButton v-model="site.localSettings.time_format" value="8:53 AM" />
                                <label class="text-lg">8:53 AM <span class="text-red-500 text-sm bg-gray-100 px-1 rounded">g:i A</span></label>
                            </div>
                            <div class="flex items-center gap-2">
                                <RadioButton v-model="site.localSettings.time_format" value="08:53" />
                                <label class="text-lg">08:53 <span class="text-red-500 text-sm bg-gray-100 px-1 rounded">H:i</span></label>
                            </div>
                            <div class="flex items-center gap-2">
                                <RadioButton v-model="site.localSettings.time_format" value="custom" />
                                <label class="text-lg">Custom:</label>
                            </div>
                           
                        </div>
                        <div v-if="site.localSettings.time_format === 'custom'" class="mt-2">
                                <InputText v-model="site.localSettings.custom_time_format" placeholder="g:i A" class="w-full text-lg" 
                                :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.custom_time_format || fb?.errors?.['site.create']?.custom_time_format}"
                                />
                                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.custom_time_format || props.fb?.errors?.['site.create']?.custom_time_format" severity="error" size="small" variant="title">
                                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.custom_time_format || props.fb?.errors?.['site.create']?.custom_time_format" :key="error" class="flex flex-col">
                                        {{ error }}
                                    </span>
                                </Message>
                                <div class="text-gray-600 mt-1">Preview: <span>9:45 am</span></div>
                            </div>
                    </div>
                </div>
            </div>
        </div> 
</template>