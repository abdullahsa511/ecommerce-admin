<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import Product, { ProductAttribute } from '@/models/Product.ts';
import { productAttributes, productAttributeColumns } from '../data/ProductData';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
import { useMediaStore } from '@/stores/media';
import { useToast } from 'primevue/usetoast';

const emit = defineEmits(['update:product', 'saved']);

const toast = useToast();
const productStore = useProductStore();
const mediaStore = useMediaStore();
const { fb: mediaFb } = storeToRefs(mediaStore);
const { fb } = storeToRefs(productStore);

const props = defineProps({
  product: {
    type: Product,
    required: true,
    default: () => new Product({})
  }
});

const editingRows = ref([]);
const newAttribute = ref(new ProductAttribute({}));

const attributeTypes = ref<{ label: string, value: string }[]>([
  { label: 'Text', value: 'text' },
  { label: 'Colour', value: 'colour' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Number', value: 'number' },
  { label: 'Date', value: 'date' },
]);

const handleUpload = async (event: any) => {
    try {
        const response: any = await mediaStore.uploadFiles(event.files, 'image');
        newAttribute.value.image = response.files;
        newAttribute.value.value = response.files[0].image;
    } catch (error) {
        console.error('Error uploading site logo:', error);
    }
}
const handleRemoveUploaded = async (file: any) => {
  try {
    await mediaStore.deleteImageByFilePath(file.image, 'image');
    newAttribute.value.image = [];
    newAttribute.value.value = [];
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
  newAttribute.value = e.data;
  newAttribute.value.product_attribute_id = e.data.product_attribute_id===0?'update':e.data.product_attribute_id;
  console.log(newAttribute.value);
}
const handleRowEditCancel = (e: any) => {
  newAttribute.value = new ProductAttribute({});
}
const updateAttribute = (e: any) => {
  let index = props.product.attributes.findIndex(attribute => attribute.product_attribute_id === newAttribute.value.product_attribute_id);
  props.product.attributes[index] = newAttribute.value;
  newAttribute.value = new ProductAttribute({});
  editingRows.value = [];
}

const addAttribute = () => {
  console.log(newAttribute.value);
  newAttribute.value.index = props.product.attributes.length;
  if(newAttribute.value.product_attribute_id === 'update') {
    newAttribute.value.product_attribute_id = 0;
  }
  props.product.attributes.push(newAttribute.value);
  newAttribute.value = new ProductAttribute({});
}

const isFormValid = computed(() => {
    const { name, metadata, type, value } = newAttribute.value;
    return name && metadata && type && value;
});

onMounted(() => {
  console.log(props.product);
});
</script>
<template>
  <div class="flex flex-col md:flex-row gap-2">
    <div class="loading-overlay" v-if="fb.loading['product.show']">
        <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading product attributes data. Please wait.</p>
      </div>
    </div>
    <!-- Left Column -->
    <div class="md:w-2/3 w-full bg-white rounded-xl shadow p-6 flex flex-col gap-6 border border-gray-200" v-if="!fb.loading['product.show']">
      <DataTable
        :value="product.attributes"
        paginator
        showGridlines
        :rows="10"
        dataKey="index"
        :loading="fb.loading['product.attributes']"
        v-model:editingRows="editingRows"
        editMode="row"
        @row-edit-init="handleRowEditInit"
        @row-edit-save="updateAttribute"
        @row-edit-cancel="handleRowEditCancel"
      >
      <Column
          v-for="col of productAttributeColumns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          :style="{ width: col.width }"
      >
          <template #body="slotProps">
              <div v-if="col.field === 'value' && slotProps.data['type'] && slotProps.data['type'] === 'text'">
                  {{ slotProps.data[col.field] }}
              </div>
              <div v-else-if="col.field === 'value' && slotProps.data['type'] && slotProps.data['type'] === 'colour'">
                  <ColorPicker v-model="slotProps.data['value']" disabled
                      :pt="{
                          preview: {
                              style: 'width: 50px; height: 2rem;'
                          }
                      }"
                  />
                  <span class="ml-2">{{ slotProps.data['value'] }}</span>
              </div>
              <div v-else-if="col.field === 'value' && slotProps.data['type'] && slotProps.data['type'] === 'checkbox'">
                <!-- <Checkbox v-model="slotProps.data['value']" disabled /> -->
                {{ slotProps.data[col.field] }}
              </div>
              <div v-else-if="col.field === 'value' && slotProps.data['type'] && slotProps.data['type'] === 'number'">
                  {{ slotProps.data[col.field] }}
              </div>
              <div v-else-if="col.field === 'value' && slotProps.data['type'] && slotProps.data['type'] === 'date'">
                  {{ slotProps.data[col.field] }}
              </div>
              <div v-else-if="col.type === 'text'">
                  {{ slotProps.data[col.field] }}
              </div>
              <div v-else>
                  {{ slotProps.data[col.field] }}
              </div>
          </template>
          <template #editor="slotProps">
              <div v-if="col.field === 'value' && slotProps.data['type'] && slotProps.data['type'] === 'text'">
                <input v-model="slotProps.data['value']" type="text" class="w-full" />
              </div>
              <div v-else-if="col.field === 'value' && slotProps.data['type'] && slotProps.data['type'] === 'colour'">
                  <ColorPicker v-model="slotProps.data['value']"
                      :pt="{
                          preview: {
                              style: 'width: 50px; height: 2rem;'
                          }
                      }"
                  />
                  <span class="ml-2">{{ slotProps.data['value'] }}</span>
              </div>
              <div v-else-if="col.field === 'value' && slotProps.data['type'] && slotProps.data['type'] === 'checkbox'">
                <Checkbox v-model="slotProps.data['value']" />
              </div>
              <div v-else-if="col.field === 'value' && slotProps.data['type'] && slotProps.data['type'] === 'number'">
                <input v-model="slotProps.data['value']" type="number" class="w-full" />
              </div>
              <div v-else-if="col.field === 'value' && slotProps.data['type'] && slotProps.data['type'] === 'date'">
                <input v-model="slotProps.data['value']" type="date" class="w-full" />
              </div>
              <input
                  v-else-if="col.type === 'text'"
                  v-model="slotProps.data[col.field]"
                  type="text"
                  class="w-full"
              />
              <input
                  v-else-if="col.type === 'color'"
                  v-model="slotProps.data[col.field]"
                  type="color"
                  class="w-full"
              />
              <input
                  v-else-if="col.type === 'checkbox'"
                  v-model="slotProps.data[col.field]"
                  type="checkbox"
                  class="w-full"
              />
              <input
                  v-else-if="col.type === 'number'"
                  v-model="slotProps.data[col.field]"
                  type="number"
                  class="w-full"
              />
              <input
                  v-else-if="col.type === 'date'"
                  v-model="slotProps.data[col.field]"
                  type="date"
                  class="w-full"
              />
              <input v-else v-model="slotProps.data[col.field]" type="text" class="w-full" />
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

    <!-- Right Column -->
    <div class="md:w-1/3 w-full bg-white rounded-xl shadow p-6 border border-gray-200 flex flex-col gap-6">
      <!-- Upload -->
      <div>
        <label class="block font-semibold text-gray-700 mb-2 text-lg">Upload Component</label>
        <!-- Image Preview -->
        <UploadFileFeature 
              v-model:uploadedFilesData="newAttribute.image"
              :fb="mediaFb"
              :property="'image'"
              @upload="handleUpload"
              @removeUploadedFile="handleRemoveUploaded"
          />
      </div>
      <!-- Name -->
      <div>
        <label class="block font-semibold text-gray-700 mb-1">Name</label>
        <input v-model="newAttribute.name" class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 outline-none" />
      </div>
      <!-- Attribute Type -->
      <div>
          <label class="block font-semibold text-gray-700 mb-1">Attribute Type</label>
          <select
              v-model="newAttribute.type"
              class="w-full text-lg border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 outline-none"
          >
              <option v-for="type in attributeTypes" :key="type.value" :value="type.value">
              {{ type.label }}
              </option>
          </select>
      </div>
      <!-- Value -->
      <div>
        <label class="block font-semibold text-gray-700 mb-1">Value</label>
        <input v-if="newAttribute.type === 'text'" v-model="newAttribute.value" class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 outline-none" />
        <input v-else-if="newAttribute.type === 'color'" v-model="newAttribute.value" type="color" class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 outline-none" />
        <input v-else-if="newAttribute.type === 'checkbox'" v-model="newAttribute.value" type="checkbox" class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 outline-none" />
        <input v-else-if="newAttribute.type === 'number'" v-model="newAttribute.value" type="number" class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 outline-none" />
        <input v-else-if="newAttribute.type === 'date'" v-model="newAttribute.value" type="date" class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 outline-none" />
      </div>
      <!-- Description -->
      <div>
        <label class="block font-semibold text-gray-700 mb-1">Description</label>
        <textarea v-model="newAttribute.description" class="w-full border border-gray-300 rounded-md p-2 min-h-[80px] focus:ring-2 focus:ring-blue-300 outline-none" />
      </div>
      <!-- Metadata -->
      <div>
        <label class="block font-semibold text-gray-700 mb-1">Metadata</label>
        <input v-model="newAttribute.metadata" class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 outline-none" />
      </div>

      <!-- Save Button -->
      <div>
        <!-- remove p-button-md class -->
          <Button 
              v-if="newAttribute.product_attribute_id"
              icon="pi pi-save"
              label="Update Attribute"
              severity="primary"
              :loading="fb.loading['product.create']"
              @click="updateAttribute"
              :disabled="!isFormValid"
          />
          <Button 
              v-else
              icon="pi pi-plus"
              label="Add Attribute"
              severity="primary"
              :loading="fb.loading['product.create']"
              @click="addAttribute"
              :disabled="!isFormValid"
          />
      </div>
    </div>
  </div>
</template>