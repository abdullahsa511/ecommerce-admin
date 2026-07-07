<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import Product, { ProductOption } from '@/models/Product.ts';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
import { productOptionsColumns, productOptionNames } from '../data/ProductData';
import { useMediaStore } from '@/stores/media';
import { useListStore } from '@/stores/list';
import { useToast } from 'primevue/usetoast';
const emit = defineEmits(['update:product', 'saved']);

const toast = useToast();
const mediaStore = useMediaStore();
const { fb: mediaFb } = storeToRefs(mediaStore);
const productStore = useProductStore();
const { fb } = storeToRefs(productStore);
const listStore = useListStore();
const { fb: listFb, types } = storeToRefs(listStore);

const props = defineProps({
  product: {
    type: Product,
    required: true,
    default: () => new Product({})
  }
});

const editingRows = ref([]);
const newOption = ref(new ProductOption({}));

const optionList = ref<ProductOption[]>([]);

const optionTypes = [
  { label: 'Texture', value: 'Texture' },
  { label: 'Colour', value: 'Colour' }
];

const handleUpload = async (event: any) => {
    try {
        const response: any = await mediaStore.uploadFiles(event.files, 'textureFile');
        newOption.value.textureFile = response.files;
        newOption.value.value = response.files;
    } catch (error) {
        console.error('Error uploading site logo:', error);
    }
}
const handleRemoveUploaded = async (file: any) => {
  try {
    await mediaStore.deleteImageByFilePath(file.image, 'textureFile');
    newOption.value.textureFile = [];
    newOption.value.value = [];
    toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Image deleted successfully',
        life: 3000
    });
  } catch (error) {
    console.error('Error deleting site logo:', error);
  }
};
const handleRowEditInit = (e: any) => {
  console.log(e);
  newOption.value = e.data;
  newOption.value.type = {
    type: e.data.type,
    name: e.data.name,
    option_id: e.data.option_id
  };
  newOption.value.product_option_id = e.data.option_id===0?'update':e.data.option_id;
}
const handleRowEditCancel = (e: any) => {
  newOption.value = new ProductOption({});
}
const updateOption = (e: any) => {
  let index = props.product.options.findIndex(option => option.product_option_id === newOption.value.product_option_id);
  props.product.options[index] = newOption.value;
  newOption.value = new ProductOption({});
  editingRows.value = [];
}

const addOption = () => {
  console.log(newOption.value);
  newOption.value.index = props.product.options.length;
  if(newOption.value.option_id === 'update') {
    newOption.value.option_id = 0;
  }
  props.product.options.push(newOption.value);
  newOption.value = new ProductOption({});
}


const isFormValid = computed(() => {
    const { name, metadata, type, value } = newOption.value;
    return name && metadata && type && value;
});

onMounted(async () => {
  listStore.fetchTypes();
  optionList.value = await productStore.getOptionList();
});

const handleSelectOption = (e: any) => {
    console.log(e);

    newOption.value.option_id = e.value.option_id;
    newOption.value.type = {};
    newOption.value.type.type = e.value.type;
    newOption.value.type.name = e.value.name;
    newOption.value.type.option_id = e.value.option_id;
    newOption.value.value = null;
    console.log(newOption.value);

}
const cellChange = (e: any, data: any, field: string) => {
  (newOption.value as any)[field] = e.target.value;
}
</script>
<template>
    <div class="flex flex-col md:flex-row gap-2">
        <div class="loading-overlay" v-if="fb.loading['product.show']">
        <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading product options data. Please wait.</p>
      </div>
    </div>
        <!-- Left Column -->
        <div class="md:w-2/3 w-full bg-white rounded-xl shadow p-6 flex flex-col gap-6 border border-gray-200" v-if="!fb.loading['product.show']">
            <DataTable
                :value="product.options"
                paginator
                showGridlines
                :rows="10"
                dataKey="product_option_id"
                :loading="fb.loading['product.options']"
                v-model:editingRows="editingRows"
                editMode="row"
                @row-edit-init="handleRowEditInit"
                @row-edit-save="updateOption"
                @row-edit-cancel="handleRowEditCancel"
            >
            <Column
                v-for="col of productOptionsColumns"
                :key="col.field"
                :field="col.field"
                :header="col.header"
                :style="{ width: col.width }"
            >
                <template #body="slotProps">
                    <div v-if="col.field === 'value' && slotProps.data['type'] && slotProps.data['type']['type'] === 'Texture'">
                        <Image :src="slotProps.data['value'][0]?.objectURL" alt="Texture" width="250" preview class="w-10 h-10 rounded-full"/>
                    </div>
                    <div v-else-if="col.field === 'value' && slotProps.data['type'] && slotProps.data['type']['type'] === 'ColorPicker'">
                        <ColorPicker v-model="slotProps.data['value']" disabled
                            :pt="{
                                preview: {
                                    style: 'width: 50px; height: 2rem;'
                                }
                            }"
                        />
                        <span class="ml-2">{{ slotProps.data['value'] }}</span>
                    </div>
                    <div v-else-if="col.field === 'type'">
                        {{ slotProps.data[col.field]['type'] }}
                    </div>
                    <div v-else-if="col.type === 'text'">
                        {{ slotProps.data[col.field] }}
                    </div>
                    <div v-else>
                        {{ slotProps.data[col.field] }}
                    </div>
                </template>
                <template #editor="slotProps">
                    <div v-if="col.field === 'value' && slotProps.data['type'] && slotProps.data['type'] === 'Texture'">
                        <Image :src="slotProps.data['value'][0]?.objectURL" alt="Texture" width="250" preview class="w-10 h-10 rounded-full"/>
                    </div>
                    <div v-else-if="col.field === 'value' && slotProps.data['type'] && slotProps.data['type']['type'] === 'ColorPicker'">
                        <ColorPicker v-model="slotProps.data['value']"
                            @change="cellChange($event, slotProps.data, col.field)"
                            :pt="{
                                preview: {
                                    style: 'width: 50px; height: 2rem;'
                                }
                            }"
                        />
                        <span class="ml-2">{{ slotProps.data['value'] }}</span>
                    </div>
                    <input
                        v-else-if="col.field === 'type'"
                        v-model="slotProps.data[col.field].type.type"
                        type="text"
                        class="w-full p-disabled"
                        disabled
                    />
                    <input
                        v-else-if="col.field === 'name'"
                        v-model="slotProps.data[col.field]"
                        type="text"
                        class="w-full p-disabled"
                        disabled
                    />
                    <input
                        v-else-if="col.type === 'text'"
                        v-model="slotProps.data[col.field]"
                        type="text"
                        class="w-full"
                        @input="cellChange($event, slotProps.data, col.field)"
                    />
                    <input
                        v-else-if="col.type === 'checkbox'"
                        v-model="slotProps.data[col.field]"
                        type="checkbox"
                        class="w-full"
                        @change="cellChange($event, slotProps.data, col.field)"
                    />
                    <input
                        v-else-if="col.type === 'number'"
                        v-model="slotProps.data[col.field]"
                        type="number"
                        class="w-full"
                        @input="cellChange($event, slotProps.data, col.field)"
                    />
                    <input
                        v-else-if="col.type === 'date'"
                        v-model="slotProps.data[col.field]"
                        type="date"
                        class="w-full"
                        @change="cellChange($event, slotProps.data, col.field)"
                    />
                    <InputText v-else v-model="slotProps.data[col.field]" type="text" class="w-full"  @keyup="cellChange($event, slotProps.data, col.field)"/>
                </template>
            </Column>
            <Column
                header="Actions"
                :rowEditor="true"
                style="width: 10%; min-width: 8rem"
                bodyStyle="text-align:center"
            ></Column>
            </DataTable>
        </div>

        <!-- Right column -->
        <div class="md:w-1/3 w-full bg-white rounded-xl shadow p-6 border border-gray-200 flex flex-col gap-6">
            <h2 class="text-xl font-bold mb-4">Product Option</h2>
            <!-- Name -->
            <div>
                <label class="block font-semibold text-gray-700 mb-1">Option Name *</label>
                <Select
                    v-model="newOption.type"
                    class="w-full p-1"
                    placeholder="Option Name"
                    :options="optionList"
                    @change="handleSelectOption"
                    optionLabel="name"
                    required
                />
            </div>
             <!-- Option Type -->
             <div>
                <DynamicInput
                    :types="types"
                    :model="newOption"
                    :fb="mediaFb"
                    @upload="handleUpload"
                    @removeUploaded="handleRemoveUploaded"
                    :disabled="false"
                />
            </div>
            <!-- Metadata -->
            <div>
                <label class="block font-semibold text-gray-700 mb-1">Metadata *</label>
                <input
                    v-model="newOption.metadata"
                    class="w-full text-lg border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 outline-none"
                    placeholder="Metadata"
                    required
                />
            </div>
            <!-- Save Button -->
            <div>
                <Button 
                    v-if="newOption.product_option_id"
                    icon="pi pi-save"
                    label="Update Option"
                    severity="primary"
                    :loading="fb.loading['product.create']"
                    @click="updateOption"
                    class="p-button-md"

                />
                <Button 
                    v-else
                    icon="pi pi-plus"
                    label="Add Option"
                    severity="primary"
                    :loading="fb.loading['product.create']"
                    @click="addOption"
                    class="p-button-md"
        
                />
            </div>
        </div>
  </div>
</template>
