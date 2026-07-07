<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useProductStore } from '@/stores/product';
import { useMediaStore } from '@/stores/media';
import { SidebarMedia } from '@/models/Product.ts';
import Product from '@/models/Product.ts';
import { event } from '@primeuix/themes/aura/timeline';

const toast = useToast();
const productStore = useProductStore();
const mediaStore = useMediaStore();
const mediaFb = mediaStore.fb;

const featuredMediaExpanded = ref(true);
const bannerMediaExpanded = ref(true);

const postOptionsExpanded = ref(true);
const sitesExpanded = ref(true);
const templateExpanded = ref(true);
const showHideValue = ref(true);

const emit = defineEmits(['update:product']);

const props = defineProps({
    product: {
        type: Product,
        required: true,
        default: () => new Product()
    }
});

const formData = ref({
    status: 'enabled',
    site: 'default',
    template: '-- Default template --',
    is_featured: false
});

const statusOptions = [
    { label: 'Enabled', value: 'enabled' },
    { label: 'Disabled', value: 'disabled' }
];

const toggleFeaturedMedia = () => {
    emit('update:product', { is_featured: formData.value.is_featured });
};

const togglePostOptions = () => {
    postOptionsExpanded.value = !postOptionsExpanded.value;
};

const toggleSites = () => {
    sitesExpanded.value = !sitesExpanded.value;
};

const toggleTemplate = () => {
    templateExpanded.value = !templateExpanded.value;
};

const toggleFeatured = (event: any) => {
    console.log('toggleFeatured', event);
    emit('update:product', { is_featured: formData.value.is_featured });
}

const uploadSidebarMediaImage = async (event: any, property: SidebarMedia) => {
    // console.log('Deleting file:', event.files);
    // console.log('Deleting file:', property);
    try {
        // const response: any = await mediaStore.uploadFiles(event.files, property);
        let productId = props.product.product_id ? props.product.product_id : 0; // 0 is for new products
        const response: any = await productStore.uploadProductImages(event.files, property, productId);
        props.product[property] = response.files;
    } catch (error) {
        console.error('Error uploading site logo:', error);
    }
}

const deleteSidebarMediaImage = async (file: any, property: SidebarMedia) => {
    try {
        await mediaStore.deleteImageByFilePath(file.objectURL, property);
        props.product[property] = [];
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Image deleted successfully',
            life: 3000
        });
    } catch (error) {
        console.error('Error deleting site logo:', error);
    }
    // Something changed
};

const selectedOptions = ref<Record<string, string>>({
    heightRange: 'Standard-Height Range',
    arms: 'Fully Adjustable Arms',
    baseFinish: 'Graphite',
    frameFinish: 'White',
    fabric: 'Fabric',
    casterGlides: 'Caster and Glides',
});

const selectedItems = (e: any, text: string, category: string) => {
    selectedOptions.value[category] = text;
    console.log(`Selected ${category}:`, text);
};

const showHideFilter = () => {
    showHideValue.value = !showHideValue.value
}

const fimilys = [
    {
        label: 'Medley',
        command: () => {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
        }
    },
    {
        label: 'Rhythm',
        command: () => {
            toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
        }
    },
    {
        label: 'Sync',
        command: () => {
            toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
        }
    },
    
];
const tags = [
    {
        label: '10-Day',
        command: () => {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
        }
    },
    {
        label: '12 Years Warranty',
        command: () => {
            toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
        }
    },
    {
        label: '20-Day',
        command: () => {
            window.location.href = 'https://vuejs.org/';
        }
    },
    {
        label: 'PVC Free',
        command: () => {
            window.location.href = 'https://vuejs.org/';
        }
    }
];
const save = () => {
   console.log();
};


</script>

<template>
    <div class="sm:w-full md:w-full lg:w-full xl:w-3/5 space-y-4">
        <div class="bg-white rounded-lg shadow-sm flex items-center gap-2 sm:px-6 py-4 ">
            <label class="block text-left text-lg text-primary">Is Default</label>
            <ToggleSwitch v-model="product.is_featured" />
        </div>
        <!-- Banner Image Section -->
        <div class="bg-white rounded-lg shadow-sm mt-4">
            <button @click="bannerMediaExpanded = !bannerMediaExpanded"
                class="w-full sm:px-6 py-4 text-left text-lg flex justify-between items-center text-primary">
                Quote Image
                <i :class="['pi', bannerMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>

            <div v-if="bannerMediaExpanded" class="sm:p-6 border-t">
                <!-- Image Preview & Upload -->
                <UploadFileFeature v-model:uploadedFilesData="product.banner_image" :fb="mediaFb"
                    :property="'banner_image'" @upload="uploadSidebarMediaImage($event, 'banner_image')"
                    @removeUploadedFile="deleteSidebarMediaImage($event, 'banner_image')" />
            </div>
        </div>

        <!-- Featured Media Section -->
        <div class="bg-white rounded-lg shadow-sm">
           

            <div v-if="featuredMediaExpanded" class="sm:p-6">

                <!-- Post Options Section -->
                <div class="space-y-6">
                    <button @click="togglePostOptions"
                        class="w-full text-left text-primary text-lg flex justify-between items-center">
                        Product options
                        <i :class="['pi', postOptionsExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
                    </button>

                    <div v-if="postOptionsExpanded" class="space-y-6">
                        <!-- Status -->
                        <div class="form-group">
                            <label class="block text-gray-700 mb-2">Status</label>
                            <Select v-model="formData.status" :options="statusOptions" optionLabel="label"
                                optionValue="value" class="w-full" />
                        </div>

                        <div class=" w-full bg-white shadow flex flex-col gap-4">
                            <Accordion value="0">
                                <AccordionPanel value="1" class="product-option-panel border">
                                    <AccordionHeader
                                        class="product-option-header flex justify-between items-center text-lg font-bold border position-relative">
                                        <span class="flex items-center">
                                            <span class="pr-2">1</span>
                                            <span>Height Range</span>
                                        </span>
                                        <span class="heading-heilight text-sm font-semibold text-gray-700" style="position:absolute; 
                                        right:100px;">{{ selectedOptions.heightRange }}</span>
                                    </AccordionHeader>

                                    <AccordionContent class=" ">
                                        <div class="flex justify-between space-x-4 w-full">
                                            <div class="flex flex-col items-start relative pb-5 flex-1">
                                                <a :class="['p-3', 'border', 'border-gray-300', 'text-sm', 'hover:border-gray-500', 'cursor-pointer', 'rounded-none', 'w-full', 'block', 'text-center',
                                                    selectedOptions.heightRange === 'Low-Height Range' ? 'bg-gray-800 text-white border-gray-800 font-semibold' : 'bg-white text-gray-800']"
                                                    @click="selectedItems($event, 'Low-Height Range', 'heightRange')">Low-Height
                                                    Range
                                                </a>
                                                <Badge
                                                    :class="selectedOptions.heightRange === 'Low-Height Range' ? 'absolute bottom-0 left-1 px-2 py-0.5 text-xs bg-gray-800 text-white uppercase font-bold' : 'text-xs text-gray-500 mt-1 ml-1'"
                                                    :severity="selectedOptions.heightRange === 'Low-Height Range' ? 'contrast' : 'secondary'">
                                                    {{ selectedOptions.heightRange === 'Low-Height Range' ? 'Selected' :
                                                        '$0' }}</Badge>
                                            </div>

                                            <div class="flex flex-col items-center relative flex-1">
                                                <a :class="['p-3', 'border', 'text-sm', 'font-semibold', 'cursor-pointer', 'rounded-none', 'w-full', 'block', 'text-center',
                                                    selectedOptions.heightRange === 'Standard-Height Range' ? 'bg-gray-800 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-800 hover:border-gray-500']"
                                                    @click="selectedItems($event, 'Standard-Height Range', 'heightRange')">Standard-Height
                                                    Range</a>
                                                <Badge
                                                    :class="selectedOptions.heightRange === 'Standard-Height Range' ? 'absolute bottom-0 left-1 px-2 py-0.5 text-xs bg-gray-800 text-white uppercase font-bold' : 'text-xs text-gray-500 mt-1 ml-1'"
                                                    :severity="selectedOptions.heightRange === 'Standard-Height Range' ? 'contrast' : 'secondary'">
                                                    {{ selectedOptions.heightRange === 'Standard-Height Range' ?
                                                        'Selected' :
                                                    '$0' }}</Badge>
                                            </div>

                                            <div class="flex flex-col items-start relative pb-5 flex-1">
                                                <a :class="['p-3', 'border', 'border-gray-300', 'text-sm', 'hover:border-gray-500', 'cursor-pointer', 'rounded-none', 'w-full', 'block', 'text-center',
                                                    selectedOptions.heightRange === 'High-Height Range' ? 'bg-gray-800 text-white border-gray-800 font-semibold' : 'bg-white text-gray-800']"
                                                    @click="selectedItems($event, 'High-Height Range', 'heightRange')">High-Height
                                                    Range</a>
                                                <Badge
                                                    :class="selectedOptions.heightRange === 'High-Height Range' ? 'absolute bottom-0 left-1 px-2 py-0.5 text-xs bg-gray-800 text-white uppercase font-bold' : 'text-xs text-gray-500 mt-1 ml-1'"
                                                    :severity="selectedOptions.heightRange === 'High-Height Range' ? 'contrast' : 'secondary'">
                                                    {{
                                                        selectedOptions.heightRange === 'High-Height Range' ? 'Selected' :
                                                            '+$65' }}</Badge>
                                            </div>
                                        </div>

                                    </AccordionContent>
                                </AccordionPanel>

                                <AccordionPanel value="2">
                                    <AccordionHeader
                                        class="product-option-header flex justify-between items-center text-lg font-bold ">
                                        <span class="flex items-center">
                                            <span class="pr-2">2</span>
                                            <span>Arms</span>
                                        </span>
                                        <span class="heading-heilight text-sm font-semibold text-gray-700"
                                            style="position:absolute; right:100px;">{{ selectedOptions.arms }}</span>
                                    </AccordionHeader>

                                    <AccordionContent class="">
                                        <div class="flex flex-wrap gap-4 pb-8">

                                            <!-- Arms Item -->
                                            <div class="arms-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.arms = 'Fully Adjustable Arms'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="Fully Adjustable Arms"
                                                    :class="['w-full p-1 rounded',  selectedOptions.arms === 'Fully Adjustable Arms' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">Fully Adjustable Arms</div>

                                                <Badge class="mt-1"
                                                    :severity="selectedOptions.arms === 'Fully Adjustable Arms' ? 'contrast' : 'secondary'">
                                                    {{ selectedOptions.arms === 'Fully Adjustable Arms' ? 'Selected' : '$65' }}
                                                </Badge>
                                            </div>

                                            <!-- Arms Item -->
                                            <div class="arms-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.arms = 'Adjustable Arms'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="Adjustable Arms"
                                                    :class="['w-full p-1 rounded',  selectedOptions.arms === 'Adjustable Arms' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">Adjustable Arms</div>

                                                <Badge  class="mt-1"
                                                :severity="selectedOptions.arms === 'Adjustable Arms' ? 'contrast' : 'secondary'">
                                                {{ selectedOptions.arms === 'Adjustable Arms' ? 'Selected' : '$50' }}
                                                </Badge>
                                            </div>

                                            <!-- Arms Item -->
                                            <div class="arms-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.arms = 'Fully Arms'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="Fully Arms"
                                                    :class="['w-full p-1 rounded',  selectedOptions.arms === 'Fully Arms' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">Fully Arms</div>

                                                <Badge class="mt-1"
                                                :severity="selectedOptions.arms === 'Fully Arms' ? 'contrast' : 'secondary'">
                                                {{ selectedOptions.arms === 'Fully Arms' ? 'Selected' : '$50' }}
                                                </Badge>
                                            </div>


                                             <!-- Arms Item -->
                                             <div class="arms-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.arms = 'F Arms'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="F Arms"
                                                    :class="['w-full p-1 rounded',  selectedOptions.arms === 'F Arms' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">F Arms</div>

                                                <Badge class="mt-1" 
                                                :severity="selectedOptions.arms === 'F Arms' ? 'contrast' : 'secondary'">
                                                {{ selectedOptions.arms === 'F Arms' ? 'Selected' : '$50' }}
                                                </Badge>
                                            </div>

                                            <!-- Arms Item -->
                                            <div class="arms-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.arms = 'SamiAuto'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="SamiAuto"
                                                    :class="['w-full p-1 rounded',  selectedOptions.arms === 'SamiAuto' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">SamiAuto</div>

                                                <Badge class="mt-1"
                                                :severity="selectedOptions.arms === 'SamiAuto' ? 'contrast' : 'secondary'">
                                                {{ selectedOptions.arms === 'SamiAuto' ? 'Selected' : '$50' }}
                                                </Badge>
                                            </div>

                                            <!-- Arms Item -->
                                            <div class="arms-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.arms = 'Top Arms'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="Top Arms"
                                                    :class="['w-full p-1 rounded',  selectedOptions.arms === 'Top Arms' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">Top Arms</div>

                                                <Badge class="mt-1"
                                                :severity="selectedOptions.arms === 'Top Arms' ? 'contrast' : 'secondary'">
                                                {{ selectedOptions.arms === 'Top Arms' ? 'Selected' : '$50' }}
                                                </Badge>
                                            </div>

                                        </div>

                                    </AccordionContent>
                                </AccordionPanel>

                                <AccordionPanel value="3">
                                    <AccordionHeader
                                        class="product-option-header flex justify-between items-center text-lg font-bold ">
                                        <span class="flex items-center">
                                            <span class="pr-2">3</span>
                                            <span>Base Finish</span>
                                        </span>
                                        <span class="heading-heilight text-sm font-semibold text-gray-700"
                                            style="position:absolute; right:100px;">{{ selectedOptions.baseFinish }}</span>
                                    </AccordionHeader>
                                    <AccordionContent>
                                        <div class="flex flex-wrap gap-4 pb-8">
                                              <div class="baseFinish-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.baseFinish = 'Graphite'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="Graphite"
                                                    :class="['w-full p-1 rounded',  selectedOptions.baseFinish === 'Graphite' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">Graphite</div>

                                                <Badge class="mt-1"
                                                    :severity="selectedOptions.baseFinish === 'Graphite' ? 'contrast' : 'secondary'">
                                                    {{ selectedOptions.baseFinish === 'Graphite' ? 'Selected' : '$65' }}
                                                </Badge>
                                            </div>

                                            <div class="baseFinish-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.baseFinish = 'Titanium'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="Titanium"
                                                    :class="['w-full p-1 rounded',  selectedOptions.baseFinish === 'Titanium' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">Titanium</div>

                                                <Badge  class="mt-1"
                                                :severity="selectedOptions.baseFinish === 'Titanium' ? 'contrast' : 'secondary'">
                                                {{ selectedOptions.baseFinish === 'Titanium' ? 'Selected' : '$50' }}
                                                </Badge>
                                            </div>

                                            <div class="baseFinish-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.baseFinish = 'Polished Aluminum'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="Polished Aluminum"
                                                    :class="['w-full p-1 rounded',  selectedOptions.baseFinish === 'Polished Aluminum' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">Polished Aluminum</div>

                                                <Badge class="mt-1"
                                                :severity="selectedOptions.baseFinish === 'Polished Aluminum' ? 'contrast' : 'secondary'">
                                                {{ selectedOptions.baseFinish === 'Polished Aluminum' ? 'Selected' : '$50' }}
                                                </Badge>
                                            </div>




                                        </div>
                                    </AccordionContent>
                                </AccordionPanel>

                                <AccordionPanel value="4">
                                    <AccordionHeader
                                        class="product-option-header flex justify-between items-center text-lg font-bold ">
                                        <span class="flex items-center">
                                            <span class="pr-2">4</span>
                                            <span>Frame Finish</span>
                                        </span>
                                        <span class="heading-heilight text-sm font-semibold text-gray-700"
                                            style="position:absolute; right:100px;">{{ selectedOptions.frameFinish }}</span>
                                    </AccordionHeader>
                                    <AccordionContent>
                                        <div class="flex flex-wrap gap-4 pb-8">
                                              <div class="frameFinish-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.frameFinish = 'Graphite'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="Graphite"
                                                    :class="['w-full p-1 rounded',  selectedOptions.frameFinish === 'Graphite' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">Graphite</div>

                                                <Badge class="mt-1"
                                                    :severity="selectedOptions.frameFinish === 'Graphite' ? 'contrast' : 'secondary'">
                                                    {{ selectedOptions.frameFinish === 'Graphite' ? 'Selected' : '$65' }}
                                                </Badge>
                                            </div>

                                            <div class="frameFinish-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.frameFinish = 'White'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="White"
                                                    :class="['w-full p-1 rounded',  selectedOptions.frameFinish === 'White' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">White</div>

                                                <Badge  class="mt-1"
                                                :severity="selectedOptions.frameFinish === 'White' ? 'contrast' : 'secondary'">
                                                {{ selectedOptions.frameFinish === 'White' ? 'Selected' : '$50' }}
                                                </Badge>
                                            </div>

                                            <div class="frameFinish-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.frameFinish = 'Polished Aluminum'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="Polished Aluminum"
                                                    :class="['w-full p-1 rounded',  selectedOptions.frameFinish === 'Polished Aluminum' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">Polished Aluminum</div>

                                                <Badge class="mt-1"
                                                :severity="selectedOptions.frameFinish === 'Polished Aluminum' ? 'contrast' : 'secondary'">
                                                {{ selectedOptions.frameFinish === 'Polished Aluminum' ? 'Selected' : '$50' }}
                                                </Badge>
                                            </div>




                                        </div>
                                    </AccordionContent>
                                </AccordionPanel>

                                <AccordionPanel value="5">
                                    <AccordionHeader
                                        class="product-option-header flex justify-between items-center text-lg font-bold ">
                                        <span class="flex items-center">
                                            <span class="pr-2">5</span>
                                            <span>Fabric</span>
                                        </span>
                                        <span class="heading-heilight text-sm font-semibold text-gray-700"
                                            style="position:absolute; right:100px;">{{ selectedOptions.fabric }}</span>
                                    </AccordionHeader>
                                    <AccordionContent>

                                        <div class="filter-option">
                                            <div class="filter-header flex justify-between" :class="!showHideValue ? 'border-b': ''">
                                                <span class="hideShowBtn" @click="showHideFilter">
                                                    <i class="pi pi-sliders-h pr-3"></i>
                                                    {{ showHideValue ? 'Show' : 'Hide' }} Filter
                                                </span>
                                                <button class="cleanBtn" severity="secondary">Clean Filter</button>
                                            </div>
                                            <div v-if="showHideValue" class="filter-process flex gap-5" >
                                                <SplitButton label="Tags(0)" :model="tags" @click="save" rounded severity="secondary"></SplitButton>
                                                <SplitButton label="Fimily(0)" :model="fimilys" @click="save" rounded severity="secondary"></SplitButton>
                                            </div>
                                        </div>


                                        <div class="flex flex-wrap gap-4 pb-8">
                                              <div class="fabric-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.fabric = 'Fabric'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="Fabric"
                                                    :class="['w-full p-1 rounded',  selectedOptions.fabric === 'Fabric' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">Fabric</div>

                                                <Badge class="mt-1"
                                                    :severity="selectedOptions.fabric === 'Fabric' ? 'contrast' : 'secondary'">
                                                    {{ selectedOptions.fabric === 'Fabric' ? 'Selected' : '$65' }}
                                                </Badge>
                                            </div>

                                            <div class="fabric-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.fabric = 'White'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="White"
                                                    :class="['w-full p-1 rounded',  selectedOptions.fabric === 'White' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">White</div>

                                                <Badge  class="mt-1"
                                                :severity="selectedOptions.fabric === 'White' ? 'contrast' : 'secondary'">
                                                {{ selectedOptions.frameFinish === 'White' ? 'Selected' : '$50' }}
                                                </Badge>
                                            </div>

                                            <div class="fabric-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.fabric = 'Polished Aluminum'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="Polished Aluminum"
                                                    :class="['w-full p-1 rounded',  selectedOptions.fabric === 'Polished Aluminum' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">Polished Aluminum</div>

                                                <Badge class="mt-1"
                                                :severity="selectedOptions.fabric === 'Polished Aluminum' ? 'contrast' : 'secondary'">
                                                {{ selectedOptions.fabric === 'Polished Aluminum' ? 'Selected' : '$50' }}
                                                </Badge>
                                            </div>




                                        </div>
                                    </AccordionContent>
                                </AccordionPanel>

                                <AccordionPanel value="6">
                                    <AccordionHeader
                                        class="product-option-header flex justify-between items-center text-lg font-bold ">
                                        <span class="flex items-center">
                                            <span class="pr-2">6</span>
                                            <span>Caster and Glides</span>
                                        </span>
                                        <span class="heading-heilight text-sm font-semibold text-gray-700"
                                            style="position:absolute; right:100px;">{{ selectedOptions.casterGlides }}</span>
                                    </AccordionHeader>
                                    <AccordionContent>
                                        <div class="flex flex-wrap gap-4 pb-8">
                                              <div class="casterGlides-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.casterGlides = 'Caster and Glides'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="Caster and Glides"
                                                    :class="['w-full p-1 rounded',  selectedOptions.casterGlides === 'Caster and Glides' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">Caster and Glides</div>

                                                <Badge class="mt-1"
                                                    :severity="selectedOptions.casterGlides === 'Caster and Glides' ? 'contrast' : 'secondary'">
                                                    {{ selectedOptions.casterGlides === 'Caster and Glides' ? 'Selected' : '$65' }}
                                                </Badge>
                                            </div>

                                            <div class="casterGlides-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.casterGlides = 'White'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="White"
                                                    :class="['w-full p-1 rounded',  selectedOptions.casterGlides === 'White' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">White</div>

                                                <Badge  class="mt-1"
                                                :severity="selectedOptions.casterGlides === 'White' ? 'contrast' : 'secondary'">
                                                {{ selectedOptions.frameFinish === 'White' ? 'Selected' : '$50' }}
                                                </Badge>
                                            </div>

                                            <div class="casterGlides-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none" @click="selectedOptions.casterGlides = 'Polished Aluminum'">
                                                <img :src="product.configuration.defaultOptions[0].fabricPreview"
                                                    alt="Polished Aluminum"
                                                    :class="['w-full p-1 rounded',  selectedOptions.casterGlides === 'Polished Aluminum' ? 'border-2 border-gray-500' : 'border border-gray-300']"/>
                                                <div class="font-semibold text-sm mt-1">Polished Aluminum</div>

                                                <Badge class="mt-1"
                                                :severity="selectedOptions.casterGlides === 'Polished Aluminum' ? 'contrast' : 'secondary'">
                                                {{ selectedOptions.casterGlides === 'Polished Aluminum' ? 'Selected' : '$50' }}
                                                </Badge>
                                            </div>




                                        </div>
                                    </AccordionContent>
                                </AccordionPanel>
                            </Accordion>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <!-- Sites Section -->
        <div class="bg-white rounded-lg shadow-sm">
            <button @click="toggleSites"
                class="w-full sm:px-6 py-4 text-left text-primary text-lg flex justify-between items-center">
                Sites
                <i :class="['pi', sitesExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>

            <div v-if="sitesExpanded" class="p-6 border-t">
                <Checkbox v-model="formData.site" value="default" class="scale-110" />
                <label class="ml-2">Default</label>
            </div>
        </div>

        <!-- Template Section -->
        <div class="bg-white rounded-lg shadow-sm">
            <button @click="toggleTemplate"
                class="w-full sm:px-6 py-4 text-left text-primary text-lg flex justify-between items-center">
                Template
                <i :class="['pi', templateExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>

            <div v-if="templateExpanded" class="p-6 border-t">
                <Select v-model="formData.template" :options="['-- Default template --']" class="w-full" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.filter-option{
    padding-bottom: 1.5rem;
}

.filter-header{
    align-items: center;
    border-top: 2px solid #ebebeb;
    display: flex;
    justify-content: space-between;
    padding: 25px 0px ;
    width: 100%;
}
.hideShowBtn{
    align-items: center;
    cursor: pointer;
    display: flex;
    width: auto;
}
.cleanBtn{
    align-items: center;
    color: #666;
    cursor: pointer;
    display: flex;
    padding-right: 20px;
}

.filter-process{
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    display: flex;
    padding: 15px 0;
}
</style>
