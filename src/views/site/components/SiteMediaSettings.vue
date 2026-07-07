<script setup lang="ts">
import { ref, PropType, computed } from 'vue';
import Site from '@/models/Site';
import { useRoute } from 'vue-router';


const route = useRoute();
const props = defineProps({
  site: {
    type: Site,
    required: true,
    default: () => new Site()
  },
  fb: {
    type:Object as PropType<any>,
    required: false,
    default: () => ({})
  }
});

const siteId = computed(() => {
    const routeId = route.params.id;
    const normalizedRouteId = Array.isArray(routeId) ? routeId[0] : routeId;
    return props.site.site_id ?? normalizedRouteId ?? '';
});
const methodOptions = ref([
  { label: 'Crop & Resize', value: 'Crop & Resize' },
  { label: 'Stretch', value: 'Stretch' },
  { label: 'Crop', value: 'Crop' }
]);
const formatOptions = ref([
  { label: 'Original', value: 'original' },
  { label: 'JPG', value: 'jpg' },
  { label: 'PNG', value: 'png' },
  { label: 'WebP', value: 'webp' },
  { label: 'GIF', value: 'gif' }
]);

</script>
<template>
    <!-- Media Settings Tab -->
    <div class="flex flex-col gap-8">
        <div class="loading-overlay" v-if="siteId && props.fb?.loading?.['site.edit.' + siteId] || props.fb?.loading?.['site.create']">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading site data. Please wait.</p>
            </div>
        </div>
        <!-- Post image size -->
        <div>
            <h3 class="text-lg font-medium mb-4 border-b border-gray-200 pb-2">Post image size</h3>
            <div class="grid grid-cols-4 gap-6">
                <!-- Extra large -->
                <div>
                    <div class="font-medium mb-3">Extra large</div>
                    <div class="space-y-3">
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Width</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.post_extra_large_width" type="number" class="w-full" 
                                :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.post_extra_large_width || fb?.errors?.['site.create']?.post_extra_large_width}"
                                />
                                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.post_extra_large_width 
                                || props.fb?.errors?.['site.create']?.post_extra_large_width" severity="error" size="small" variant="title">
                                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.post_extra_large_width 
                                    || props.fb?.errors?.['site.create']?.post_extra_large_width" :key="error" class="flex flex-col">
                                        {{ error }}
                                    </span>
                                </Message>
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Height</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.post_extra_large_height" type="number" class="w-full" 
                                :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.post_extra_large_height || fb?.errors?.['site.create']?.post_extra_large_height}"
                                />
                                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.post_extra_large_height || props.fb?.errors?.['site.create']?.post_extra_large_height" severity="error" size="small" variant="title">
                                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.post_extra_large_height 
                                    || props.fb?.errors?.['site.create']?.post_extra_large_height" :key="error" class="flex flex-col">
                                        {{ error }}
                                    </span>
                                </Message>
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Method</label>
                            <div class="col-span-8">
                                <Select 
                                    v-model="site.mediaSettings.post_extra_large_method" 
                                    :options="methodOptions" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    placeholder="Select a Method" 
                                    class="w-full text-lg" 
                                    :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.post_extra_large_method || fb?.errors?.['site.create']?.post_extra_large_method}"
                                />
                                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.post_extra_large_method || props.fb?.errors?.['site.create']?.post_extra_large_method" severity="error" size="small" variant="title">
                                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.post_extra_large_method 
                                    || props.fb?.errors?.['site.create']?.post_extra_large_method" :key="error" class="flex flex-col">
                                        {{ error }}
                                    </span>
                                </Message>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Large -->
                <div>
                    <div class="font-medium mb-3">Large</div>
                    <div class="space-y-3">
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Width</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.post_large_width" type="number" class="w-full" 
                                :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.post_large_width || fb?.errors?.['site.create']?.post_large_width}"
                                />
                                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.post_large_width || props.fb?.errors?.['site.create']?.post_large_width" severity="error" size="small" variant="title">
                                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.post_large_width 
                                    || props.fb?.errors?.['site.create']?.post_large_width" :key="error" class="flex flex-col">
                                        {{ error }}
                                    </span>
                                </Message>
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Height</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.post_large_height" type="number" class="w-full" />
                                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.post_large_height || props.fb?.errors?.['site.create']?.post_large_height" severity="error" size="small" variant="title">
                                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.post_large_height 
                                    || props.fb?.errors?.['site.create']?.post_large_height" :key="error" class="flex flex-col">
                                        {{ error }}
                                    </span>
                                </Message>
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Method</label>
                            <div class="col-span-8">
                                <Select 
                                    v-model="site.mediaSettings.post_large_method" 
                                    :options="methodOptions" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    placeholder="Select a Method" 
                                    class="w-full text-lg" 
                                    :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.post_large_method || fb?.errors?.['site.create']?.post_large_method}"
                                />
                                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.post_large_method || props.fb?.errors?.['site.create']?.post_large_method" severity="error" size="small" variant="title">
                                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.post_large_method 
                                    || props.fb?.errors?.['site.create']?.post_large_method" :key="error" class="flex flex-col">
                                        {{ error }}
                                    </span>
                                </Message>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Medium -->
                <div>
                    <div class="font-medium mb-3">Medium</div>
                    <div class="space-y-3">
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Width</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.post_medium_width" type="number" class="w-full" 
                                :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.post_medium_width || fb?.errors?.['site.create']?.post_medium_width}"
                                />
                                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.post_medium_width || props.fb?.errors?.['site.create']?.post_medium_width" severity="error" size="small" variant="title">
                                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.post_medium_width 
                                    || props.fb?.errors?.['site.create']?.post_medium_width" :key="error" class="flex flex-col">
                                        {{ error }}
                                    </span>
                                </Message>
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Height</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.post_medium_height" type="number" class="w-full" />
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Method</label>
                            <div class="col-span-8">
                                <Select 
                                    v-model="site.mediaSettings.post_medium_method" 
                                    :options="methodOptions" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    placeholder="Select a Method" 
                                    class="w-full text-lg" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Thumb -->
                <div>
                    <div class="font-medium mb-3">Thumb</div>
                    <div class="space-y-3">
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Width</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.post_thumb_width" type="number" class="w-full" 
                                :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.post_thumb_width || fb?.errors?.['site.create']?.post_thumb_width}"
                                />
                                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.post_thumb_width || props.fb?.errors?.['site.create']?.post_thumb_width" severity="error" size="small" variant="title">
                                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.post_thumb_width 
                                    || props.fb?.errors?.['site.create']?.post_thumb_width" :key="error" class="flex flex-col">
                                        {{ error }}
                                    </span>
                                </Message>
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Height</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.post_thumb_height" type="number" class="w-full" />
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Method</label>
                            <div class="col-span-8">
                                <Select 
                                    v-model="site.mediaSettings.post_thumb_method" 
                                    :options="methodOptions" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    placeholder="Select a Method" 
                                    class="w-full text-lg" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Product image size -->
        <div>
            <h3 class="text-lg font-medium mb-4 border-b border-gray-200 pb-2">Product image size</h3>
            <div class="grid grid-cols-4 gap-6">
                <!-- Extra large -->
                <div>
                    <div class="font-medium mb-3">Extra large</div>
                    <div class="space-y-3">
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Width</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.product_extra_large_width" type="number" class="w-full" 
                                :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.product_extra_large_width || fb?.errors?.['site.create']?.product_extra_large_width}"
                                />
                                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.product_extra_large_width || props.fb?.errors?.['site.create']?.product_extra_large_width" severity="error" size="small" variant="title">
                                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.product_extra_large_width 
                                    || props.fb?.errors?.['site.create']?.product_extra_large_width" :key="error" class="flex flex-col">
                                        {{ error }}
                                    </span>
                                </Message>
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Height</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.product_extra_large_height" type="number" class="w-full" />
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Method</label>
                            <div class="col-span-8">
                                <Select 
                                    v-model="site.mediaSettings.product_extra_large_method" 
                                    :options="methodOptions" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    placeholder="Select a Method" 
                                    class="w-full text-lg" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Large -->
                <div>
                    <div class="font-medium mb-3">Large</div>
                    <div class="space-y-3">
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Width</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.product_large_width" type="number" class="w-full" 
                                :class="{'p-invalid': fb?.errors?.['site.update.' + props.site.site_id]?.product_large_width || fb?.errors?.['site.create']?.product_large_width}"
                                />
                                <Message v-if="props.fb?.errors?.['site.update.' + props.site.site_id]?.product_large_width || props.fb?.errors?.['site.create']?.product_large_width" severity="error" size="small" variant="title">
                                    <span v-for="error in props.fb?.errors?.['site.update.' + props.site.site_id]?.product_large_width 
                                    || props.fb?.errors?.['site.create']?.product_large_width" :key="error" class="flex flex-col">
                                        {{ error }}
                                    </span>
                                </Message>
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Height</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.product_large_height" type="number" class="w-full" />
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Method</label>
                            <div class="col-span-8">
                                <Select 
                                    v-model="site.mediaSettings.product_large_method" 
                                    :options="methodOptions" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    placeholder="Select a Method" 
                                    class="w-full text-lg" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Medium -->
                <div>
                    <div class="font-medium mb-3">Medium</div>
                    <div class="space-y-3">
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Width</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.product_medium_width" type="number" class="w-full" />
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Height</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.product_medium_height" type="number" class="w-full" />
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Method</label>
                            <div class="col-span-8">
                                <Select 
                                    v-model="site.mediaSettings.product_medium_method" 
                                    :options="methodOptions" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    placeholder="Select a Method" 
                                    class="w-full text-lg" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Thumb -->
                <div>
                    <div class="font-medium mb-3">Thumb</div>
                    <div class="space-y-3">
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Width</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.product_thumb_width" type="number" class="w-full" />
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Height</label>
                            <div class="col-span-8">
                                <InputText v-model="site.mediaSettings.product_thumb_height" type="number" class="w-full" />
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label class="flex items-center col-span-4 text-sm">Method</label>
                            <div class="col-span-8">
                                <Select 
                                    v-model="site.mediaSettings.product_thumb_method" 
                                    :options="methodOptions" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    placeholder="Select a Method" 
                                    class="w-full text-lg" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Image output -->
        <div>
            <h3 class="text-lg font-medium mb-4 border-b border-gray-200 pb-2">Image output</h3>
            <div class="grid grid-cols-2 gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-4 text-sm">Format</label>
                    <div class="col-span-8">
                        <Select 
                            v-model="site.mediaSettings.format" 
                            :options="formatOptions" 
                            optionValue="value"
                            optionLabel="label" 
                            placeholder="Select a Format" 
                            class="w-full text-lg" 
                        />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-4 text-sm">Quality</label>
                    <div class="col-span-8">
                        <InputText v-model="site.mediaSettings.quality" type="number" class="w-full" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Help text -->
        <div class="flex items-center gap-2 text-gray-600 mt-2">
            <i class="pi pi-info-circle"></i>
            <span>To keep image proportion set either height or width to 0 (zero)</span>
        </div>
    </div>
</template>