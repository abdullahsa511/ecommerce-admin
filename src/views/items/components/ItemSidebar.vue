<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useProductStore } from '@/stores/product';
import { useItemStore } from '@/stores/item';
import { useMediaStore } from '@/stores/media';
import { ProductVariant } from '@/models/Product.ts';
import Product from '@/models/Product.ts';
import OptionGroupBox from '@/views/products/components/product-general/OptionGroupBox.vue';
import OptionGroupTiles from '@/views/products/components/product-general/OptionGroupTiles.vue';
import OptionGroupFilter from '@/views/products/components/product-general/OptionGroupFilter.vue';
import Item, { VariantItem } from '@/models/Item';
import { mediaUrl } from '@/utils/mediaUrl';

const toast = useToast();
const productStore = useProductStore();
const itemStore = useItemStore();
const mediaStore = useMediaStore();
const mediaFb = mediaStore.fb;

const featuredMediaExpanded = ref(true);
const bannerMediaExpanded = ref(true);

const postOptionsExpanded = ref(true);
const templateExpanded = ref(true);
const itemOptionsExpanded = ref(true);
const showHideValue = ref(true);

const emit = defineEmits(['update:item']);

const props = defineProps({
    product: {
        type: Product,
        required: false,
        default: () => new Product()
    },
    item: {
        type: Item,
        required: true,
        default: () => new Item()
    }
});

const variant = computed(() => {
    return props.item.variantItems[0] || new VariantItem();
});

const formData = ref({
    status: 'enabled',
    site: 'default',
    template: '-- Default template --',
    is_featured: false
});

// group id as key (number|string) and option name as value (string)
const selectedOptions = ref<Record<number | string, string>>({});

const togglePostOptions = () => {
    postOptionsExpanded.value = !postOptionsExpanded.value;
};


const toggleTemplate = () => {
    templateExpanded.value = !templateExpanded.value;
};

const toggleItemOptions = () => {
    itemOptionsExpanded.value = !itemOptionsExpanded.value;
};

const uploadSidebarMediaImage = async (event: any, property: 'quote_image' | 'dimensions_image') => {
    try {
        // const response: any = await mediaStore.uploadFiles(event.files, property);
        let itemId = props.item.item_id ? props.item.item_id : 0; // 0 is for new products
        const response: any = await itemStore.uploadItemImages(event.files, property, itemId);
        props.item[property] = response.files;
    } catch (error) {
        console.error('Error uploading site logo:', error);
    }
}

const deleteSidebarMediaImage = async (file: any, property: 'quote_image' | 'dimensions_image') => {
    try {
        let itemId = props.item.item_id ? props.item.item_id : 0; // 0 is for new products
        await itemStore.deleteImageByFilePath(file.objectURL, property, itemId);
        if (property === 'quote_image') {
            props.item.quote_image = [];
        } else if (property === 'dimensions_image') {
            props.item.dimensions_image = [];
        }
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

const defaultVariantName = ref<string>('');

const selectedVariant = ref<ProductVariant | null>(null)


const selectedItems = (groupId: number | string, optionName: string) => {
    console.log('selectedItems', groupId, optionName);
    // selectedOptions.value[groupId] = optionName;
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

onMounted(() => { 
});

// watch(props.item, (newVal: Item) => {
//     console.log('item sidebar', newVal);
// }, { deep: true });
</script>

<template>
    <div class="sm:w-full md:w-full lg:w-full xl:w-3/5 space-y-4">
        <div class="bg-white rounded-lg shadow-sm flex items-center gap-2 sm:px-6 py-4 ">
            <label class="block text-left text-lg text-primary">Is Default</label>
            <ToggleSwitch v-model="item.is_default" />
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
                <UploadFileFeature v-model:uploadedFilesData="item.quote_image" :fb="mediaFb" :property="'quote_image'"
                    @upload="uploadSidebarMediaImage($event, 'quote_image')"
                    @removeUploadedFile="deleteSidebarMediaImage($event, 'quote_image')" />
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm mt-4">
            <button @click="bannerMediaExpanded = !bannerMediaExpanded"
                class="w-full sm:px-6 py-4 text-left text-lg flex justify-between items-center text-primary">
                Dimensions Image
                <i :class="['pi', bannerMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>

            <div v-if="bannerMediaExpanded" class="sm:p-6 border-t">
                <!-- Image Preview & Upload -->
                <UploadFileFeature v-model:uploadedFilesData="item.dimensions_image" :fb="mediaFb" :property="'dimensions_image'"
                    @upload="uploadSidebarMediaImage($event, 'dimensions_image')"
                    @removeUploadedFile="deleteSidebarMediaImage($event, 'dimensions_image')" />
            </div>
        </div>

        <!-- Item Options -->
        <div class="bg-white rounded-lg shadow-sm">
            <div class="sm:p-6 border-t">
                <!-- Post Options Section -->
                <div class="space-y-6">
                    <button @click="toggleItemOptions"
                        class="w-full text-left text-primary text-lg flex justify-between items-center border-b pb-4">
                        Item Options
                        <i :class="['pi', itemOptionsExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
                    </button>

                    <div v-if="itemOptionsExpanded" class="space-y-6">
                        <div class="flex flex-wrap w-full gap-4">
                            <!-- Arms Item -->
                            <div class="arms-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none">
                                <img
                                    :src="variant.productVariantImagePreview ? mediaUrl(variant.productVariantImagePreview) : 'https://dummyimage.com/40x40/444/fff&text=F'"
                                    alt="variant1"
                                    :class="['w-full p-1 rounded', 'border-2 border-gray-500']"
                                />
                                <div class="font-semibold text-sm mt-1">{{ variant.variant_name }}</div>

                                <Badge class="mt-1" severity="contrast">
                                    Selected
                                </Badge>
                            </div>

                            <!--  -->
                            <div class=" w-full bg-white shadow flex flex-col gap-4" v-if="variant">
                                <Accordion
                                    :value="variant.itemOptionGroups.map((group) => group.product_option_group_id.toString())">
                                    <AccordionPanel :value="group.product_option_group_id.toString()"
                                        class="product-option-panel border"
                                        v-for="(group, index) in variant.productOptionGroups"
                                        :key="group.product_option_group_id">
                                        <AccordionHeader
                                            class="product-option-header flex justify-between items-center text-lg font-bold border position-relative">
                                            <span class="flex items-center">
                                                <span class="pr-2">{{ index + 1 }}</span>
                                                <span>{{ group.option_group_name }}</span>
                                            </span>
                                            <span class="heading-heilight text-sm font-semibold text-gray-700" style="position:absolute; 
                                                right:100px;">
                                                {{group.productOptions[0]?.option_name || '' }}
                                            </span>
                                        </AccordionHeader>

                                        <AccordionContent class="" :value="group.option_group_code.toString()">
                                            <!-- first item show box  -->
                                            <OptionGroupBox v-if="index === 0" :optionGroup="group"
                                                :selectedOptions="group.productOptions[0]?.option_name || ''"
                                                @selectOption="selectedItems(group.product_option_group_id, $event)" />
                                            <!-- other items show tiles (only middle items when there are more than 2 groups) -->
                                            <OptionGroupTiles
                                                v-if="index > 0 && index < variant.productOptionGroups.length - 1 && variant.productOptionGroups.length > 2"
                                                :optionGroup="group"
                                                :selectedOptions="group.productOptions[0]?.option_name || ''"
                                                @selectOption="selectedItems(group.product_option_group_id, $event)" />
                                            <!-- if last item then show filter -->
                                            <OptionGroupFilter :showHideValue="showHideValue"   
                                                v-if="index === variant.productOptionGroups.length - 1"
                                                :optionGroup="group" :tags="tags" :fimilys="fimilys"
                                                :selectedOptions="group.productOptions[0]?.option_name || ''"
                                                @selectOption="selectedItems(group.item_option_group_id, $event)" />
                                        </AccordionContent>
                                    </AccordionPanel>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
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
.filter-option {
    padding-bottom: 1.5rem;
}

.filter-header {
    align-items: center;
    border-top: 2px solid #ebebeb;
    display: flex;
    justify-content: space-between;
    padding: 25px 0px;
    width: 100%;
}

.hideShowBtn {
    align-items: center;
    cursor: pointer;
    display: flex;
    width: auto;
}

.cleanBtn {
    align-items: center;
    color: #666;
    cursor: pointer;
    display: flex;
    padding-right: 20px;
}

.filter-process {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    display: flex;
    padding: 15px 0;
}
</style>