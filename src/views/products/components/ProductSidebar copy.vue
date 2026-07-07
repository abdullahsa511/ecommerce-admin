<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useProductStore } from '@/stores/product';
import { useMediaStore } from '@/stores/media';
import { SidebarMedia, ProductVariant, ProductImage } from '@/models/Product.ts';
import Product from '@/models/Product.ts';
import OptionGroupBox from '@/views/products/components/product-general/OptionGroupBox.vue';
import OptionGroupTiles from '@/views/products/components/product-general/OptionGroupTiles.vue';
import OptionGroupFilter from '@/views/products/components/product-general/OptionGroupFilter.vue';
import WayPoint from '@/views/wayPoint/WayPoint.vue';


const toast = useToast();
const productStore = useProductStore();
const mediaStore = useMediaStore();
const mediaFb = mediaStore.fb;

const featuredMediaExpanded = ref(true);
const bannerMediaExpanded = ref(true);

const postOptionsExpanded = ref(true);
const sitesExpanded = ref(true);
const templateExpanded = ref(true);
const occanPlasticsExpanded = ref(true);
const videoBannerExpanded = ref(true);
const showHideValue = ref(true);

const wayPointSuggestions = ref<any[]>([]);

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

const visible = ref(false);

const bannerWayPointsData = computed(() => {
    return props.product.banner_way_points ? props.product.banner_way_points : [];
});



// group id as key (number|string) and option name as value (string)
const selectedOptions = ref<Record<number | string, string>>({});

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

// occan plastics true or false
const toggleOccanPlastics = () => {
    occanPlasticsExpanded.value = !occanPlasticsExpanded.value;
};

const toggleVideoBanner = () => {
    videoBannerExpanded.value = !videoBannerExpanded.value;
};

const videoUrls = ref<string[]>([]);

const getVideoUrlsFromProduct = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.filter((url): url is string => typeof url === 'string');
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed.filter((url): url is string => typeof url === 'string') : [];
        } catch {
            return [];
        }
    }
    return [];
};

const emitVideoUrls = () => {
    emit('update:product', { video_url: [...videoUrls.value] });
};

const addVideoBannerInput = () => {
    videoUrls.value.push('');
    emitVideoUrls();
};

const removeVideoBannerInput = (index: number) => {
    videoUrls.value.splice(index, 1);
    emitVideoUrls();
};

const updateVideoUrl = (index: number, value: string | undefined) => {
    videoUrls.value[index] = value ?? '';
    emitVideoUrls();
};

const toggleFeatured = (event: any) => {
    console.log('toggleFeatured', event);
    emit('update:product', { is_featured: formData.value.is_featured });
}

type ProductImageTypes = 'image' | 'image_banner' | 'banner_image' | 'main_image_one' | 'main_image_two' | 'feature_image_one' | 'feature_image_two' | 'feature_image_three' | 'dimension_image';

const uploadSidebarMediaImage = async (event: any, property: ProductImageTypes) => {
    // console.log('Deleting file:', event.files);
    // console.log('Deleting file:', property);
    try {
        // const response: any = await mediaStore.uploadFiles(event.files, property);
        let productId = props.product.product_id ? props.product.product_id : 0; // 0 is for new products
        const files: ProductImage[] = await productStore.uploadProductImages(event.files, property, productId);
        (props.product as any)[property] = files;
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

const defaultVariantName = ref<string>('');

const selectedVariant = ref<ProductVariant | null>(null)


const selectedItems = (groupId: number | string, optionName: string) => {
    console.log('selectedItems', groupId, optionName);
    selectedOptions.value[groupId] = optionName;
}

// const showHideFilter = () => {
//     showHideValue.value = !showHideValue.value
// }

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
// const save = () => {
//     console.log();
// };

onMounted(() => {
    videoUrls.value = getVideoUrlsFromProduct(props.product.video_url);
    setTimeout(() => {
        selectedVariant.value = props.product.productVariants[0] as ProductVariant || new ProductVariant();
        defaultVariantName.value = props.product.productVariants[0]?.variant_name || '';
        console.log('defaultVariantName', defaultVariantName.value);
    }, 1000);
});

watch(
    () => props.product.video_url,
    (newValue) => {
        videoUrls.value = getVideoUrlsFromProduct(newValue);
    }
);

const updateWayPoints = async (wayPoints: any) => {
    let response: any = await productStore.updateProductWayPoints(props.product.product_id ?? 0, wayPoints);
    if (response) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Way Points saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save way points: ' + (response?.message || ''), life: 5000 });
    }
};

// WAY POINT SUGGESTIONS
const searchWayPointSuggestions = async (query: any) => {
    // dummy data for suggestions
    // api connection to get way point suggestions
    const suggestions: any = await productStore.getWayPointSuggestions(query);
    // const suggestions = dummyData.value.filter(item => item.label.toLowerCase().includes(query));
    wayPointSuggestions.value = suggestions;
};

</script>

<template>
    <div class="sm:w-full md:w-full lg:w-full xl:w-3/5 space-y-4">
        <div class="bg-white rounded-lg shadow-sm flex items-center gap-2 sm:px-6 py-4 ">
            <label class="block text-left text-lg text-primary">Featured</label>
            <ToggleSwitch v-model="product.is_featured" />
        </div>

        <div class="bg-white rounded-lg shadow-sm gap-2 sm:px-6 py-4 ">
            <label class="block text-gray-700 mb-2">Status</label>
            <Select v-model="formData.status" :options="statusOptions" optionLabel="label" optionValue="value"
                class="w-full" />
        </div>


        <!-- Banner Image Section -->
        <div class="bg-white rounded-lg shadow-sm mt-4">
            <button @click="bannerMediaExpanded = !bannerMediaExpanded"
                class="w-full sm:px-6 py-4 text-left text-lg flex justify-between items-center text-primary">
                Banner Image
                <i :class="['pi', bannerMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>

            <div v-if="bannerMediaExpanded" class="sm:p-6 border-t banner-media-container">
                <!-- Image Preview & Upload -->
                <UploadFileFeature v-model:uploadedFilesData="product.banner_image" :fb="mediaFb"
                    :property="'banner_image'" @upload="uploadSidebarMediaImage($event, 'banner_image')"
                    @removeUploadedFile="deleteSidebarMediaImage($event, 'banner_image')" />

                    <div class="way-points-button">
                        <Button v-if="product.banner_image.length > 0" label="Setup Way-Points" @click="visible = true"/>
                    </div>
            </div>
        </div>

        <!-- Video banner upload Section -->
        <div class="bg-white rounded-lg shadow-sm">
            <button @click="toggleVideoBanner"
                class="w-full sm:px-6 py-4 text-left text-primary text-lg flex justify-between items-center">
                Video Banner
                <i :class="['pi', videoBannerExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>

            <div v-if="videoBannerExpanded" class="p-6 border-t">
                <Button class="mb-4" severity="secondary" icon="pi pi-plus" label="Add Video Banner"
                    @click="addVideoBannerInput" />

                <div v-if="videoUrls.length > 0" class="video-input-container">
                    <div v-for="(videoUrl, index) in videoUrls" :key="`video-url-${index}`"
                        class="flex items-center gap-2 mb-2">
                        <InputText :modelValue="videoUrl" type="text" placeholder="Enter Video URL"
                            @update:modelValue="updateVideoUrl(index, $event)"
                            class="w-full" />
                        <Button type="button" severity="danger" icon="pi pi-minus"
                            @click="removeVideoBannerInput(index)" />
                    </div>
                </div>


                <!-- <UploadFileFeature v-model:uploadedFilesData="product.video_banner" :fb="mediaFb" :property="'video_banner'" @upload="uploadSidebarMediaImage($event, 'video_banner')" @removeUploadedFile="deleteSidebarMediaImage($event, 'video_banner')" /> -->
            </div>
        </div>

        <!-- Featured Media Section -->
        <div class="bg-white rounded-lg shadow-sm">
            <button @click="toggleFeaturedMedia"
                class="w-full sm:px-6 py-4 text-left text-lg flex justify-between items-center text-primary">
                Featured Media
                <i :class="['pi', featuredMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>

            <div v-if="featuredMediaExpanded" class="sm:p-6 border-t">
                <!-- Image Preview -->
                <UploadFileFeature v-model:uploadedFilesData="product.image" :fb="mediaFb" :property="'image'"
                    @upload="uploadSidebarMediaImage($event, 'image')"
                    @removeUploadedFile="deleteSidebarMediaImage($event, 'image')" />

                <Divider />

                <!-- Post Options Section -->
                <div class="space-y-6">
                    <button @click="togglePostOptions"
                        class="w-full text-left text-primary text-lg flex justify-between items-center border-b pb-4">
                        Product Variants
                        <i :class="['pi', postOptionsExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
                    </button>

                    <div v-if="postOptionsExpanded" class="space-y-6">
                        <div class="flex flex-wrap w-full gap-4">
                            <!-- Arms Item -->
                            <div v-for="variant in product.productVariants" :key="variant.product_variant_id"
                                class="arms-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none"
                                @click="selectedVariant = variant as ProductVariant; defaultVariantName = variant.variant_name">
                                <img :src="product.configuration.defaultOptions[0].fabricPreview" alt="variant1"
                                    :class="['w-full p-1 rounded', defaultVariantName === variant.variant_name ? 'border-2 border-gray-500' : 'border border-gray-300']" />
                                <div class="font-semibold text-sm mt-1">{{ variant.variant_name }}</div>

                                <Badge class="mt-1" v-if="defaultVariantName === variant.variant_name"
                                    severity="contrast">
                                    Selected
                                </Badge>
                            </div>

                            <!--  -->
                            <div class=" w-full bg-white shadow flex flex-col gap-4" v-if="selectedVariant">
                                <Accordion
                                    :value="selectedVariant.productOptionGroups.map((group) => group.product_option_group_id.toString())">
                                    <AccordionPanel :value="group.product_option_group_id.toString()"
                                        class="product-option-panel border"
                                        v-for="(group, index) in selectedVariant.productOptionGroups"
                                        :key="group.product_option_group_id">
                                        <AccordionHeader
                                            class="product-option-header flex justify-between items-center text-lg font-bold border position-relative">
                                            <span class="flex items-center">
                                                <span class="pr-2">{{ index + 1 }}</span>
                                                <span>{{ group.option_group_name }}</span>
                                            </span>
                                            <span class="heading-heilight text-sm font-semibold text-gray-700" style="position:absolute; 
                                            right:100px;">
                                                {{ selectedOptions[group.product_option_group_id] ||
                                                group.productOptions[0]?.option_name || '' }}
                                            </span>
                                        </AccordionHeader>

                                        <AccordionContent class="" :value="group.product_option_group_id.toString()">
                                            <!-- first item show box  -->
                                            <OptionGroupBox v-if="index === 0" :optionGroup="group"
                                                :selectedOptions="selectedOptions[group.product_option_group_id]"
                                                @selectOption="selectedItems(group.product_option_group_id, $event)" />
                                            <!-- other items show tiles (only middle items when there are more than 2 groups) -->
                                            <OptionGroupTiles
                                                v-if="index > 0 && index < selectedVariant.productOptionGroups.length - 1 && selectedVariant.productOptionGroups.length > 2"
                                                :optionGroup="group"
                                                :selectedOptions="selectedOptions[group.product_option_group_id]"
                                                @selectOption="selectedItems(group.product_option_group_id, $event)"
                                                />
                                            <!-- if last item then show filter -->
                                            <OptionGroupFilter :showHideValue="showHideValue"
                                                v-if="index === selectedVariant.productOptionGroups.length - 1"
                                                :optionGroup="group" :tags="tags" :fimilys="fimilys"
                                                :selectedOptions="selectedOptions[group.product_option_group_id]"
                                                @selectOption="selectedItems(group.product_option_group_id, $event)" />
                                        </AccordionContent>
                                    </AccordionPanel>
                                </Accordion>
                            </div>
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

        <!-- Occan Plastics Section -->
        <div class="bg-white rounded-lg shadow-sm">
            <button @click="toggleOccanPlastics"
                class="w-full sm:px-6 py-4 text-left text-primary text-lg flex justify-between items-center">
                Occan Plastics
                <i :class="['pi', occanPlasticsExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>

            <div v-if="occanPlasticsExpanded" class="p-6 border-t">
                <Checkbox v-model="product.ocean_plastic_used" class="scale-110" :binary="product.ocean_plastic_used ? true : false" :value="product.ocean_plastic_used ? true : false" />
                <label class="ml-2">Occan Plastics Used</label>
            </div>
        </div>
    </div>

    <div class="card flex justify-center">
        <Dialog v-model:visible="visible" modal header="Setup Way-Points" maximizable :maximized="true"
            :style="{ width: '100vw', maxHeight: '100%', height: '100%' }">

            <div class="body-container">
                <WayPoint 
                :wayPointSuggestions="wayPointSuggestions"
                :imageSrc="product.banner_image[0].objectURL"
                :wayPoints="bannerWayPointsData"
                :modelId="product.product_id"
                :fb="mediaFb"
                @update:wayPoints="updateWayPoints"
                @search:way-points-suggestions="searchWayPointSuggestions"               
                />
            </div>
        </Dialog>
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

/* ======= way points button css =======  */
.banner-media-container {
    position: relative;
}

.way-points-button {
    position: absolute;
    bottom: 20px;
    left: 40px;
}
.way-points-button > button {
    margin-left: 80px;
    margin-bottom: 15px;
    font-size: 0.85rem;
    padding: 2px 9px;
    border-radius: 8px;
    font-weight: 500;
}
@media screen and (max-width: 768px) {
    .way-points-button {
        display: none;
        bottom: 10px;
        left: 20px;
    }
    .banner-media-container {
        padding: 10px;
    }
}
</style>