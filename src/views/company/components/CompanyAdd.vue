<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCompanyStore } from '@/stores/company';
import { storeToRefs } from 'pinia';
import InputText from 'primevue/inputtext';

// Props
const CompanyStore = useCompanyStore();
const { company, fb } = storeToRefs(CompanyStore);
// Emit to parent
const emit = defineEmits(['update:company', 'saved']);

// Update parent on field changes
const onFieldChange = () => {
  emit('update:company', company.value);
};

const vendorIdSuggestions = ref<any[]>([]);


const onVendorIdInput = async (event: any) => {
  const query = event.query?.toLowerCase();
  if (query?.length > 0) {
    vendorIdSuggestions.value = await CompanyStore.searchVendors(query);
  } else {
    vendorIdSuggestions.value = [];
  }
}

const onVendorIdItemSelect = (event: any) => {
  company.value.vendor_id = event.value.vendor_id;
  company.value.vendor_name = event.value.name;
}

// Set default values on mount
onMounted(() => {
  // Reset company on mount
  CompanyStore.resetCompany();
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Company Form -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
          Company Details
        </h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Company Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Company Name
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.company_name"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter company name"
              @input="onFieldChange" :class="{'p-invalid': fb.errors?.['company.create']?.company_name}" />
              <Message v-if="fb.errors?.['company.create']?.company_name" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.create']?.company_name" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Company Code -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Company Code
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.company_code"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter company code"
              @input="onFieldChange" :class="{'p-invalid': fb.errors?.['company.create']?.company_code}" />
              <Message v-if="fb.errors?.['company.create']?.company_code" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.create']?.company_code" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Company Prefix -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Company Prefix
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.company_prefix"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter company prefix"
              @input="onFieldChange" :class="{'p-invalid': fb.errors?.['company.create']?.company_prefix}" />
              <Message v-if="fb.errors?.['company.create']?.company_prefix" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.create']?.company_prefix" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Vendor ID -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Vendor
          </label>

          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <AutoComplete 
              v-model="company.vendor_name"
              ref="vendorIdAutocomplete" 
              optionLabel="name"
             
              placeholder="Search vendors" 
              class="w-full text-lg border border-gray-200 rounded-md p-2"
              inputClass="w-full text-lg border border-gray-200 rounded-md p-2" 
              :class="{'p-invalid': fb.errors?.['company.create']?.vendor_id}"
              :suggestions="vendorIdSuggestions"
              @complete="onVendorIdInput" 
              @item-select="onVendorIdItemSelect"
              />
              <Message v-if="fb.errors?.['company.create']?.vendor_id" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.create']?.vendor_id" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>  



          <!-- Company Entity -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Company Entity
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.company_entity"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter company entity"
              @input="onFieldChange" 
              :class="{'p-invalid': fb.errors?.['company.create']?.company_entity}" />
              <Message v-if="fb.errors?.['company.create']?.company_entity" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.create']?.company_entity" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Company Short -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Company Short
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.company_short"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter company short"
              @input="onFieldChange" 
              :class="{'p-invalid': fb.errors?.['company.create']?.company_short}" />
              <Message v-if="fb.errors?.['company.create']?.company_short" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.create']?.company_short" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Sort Order -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Sort Order
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.sort_order as any" type="number"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter sort order"
              @input="onFieldChange" 
              :class="{'p-invalid': fb.errors?.['company.create']?.sort_order}" />
              <Message v-if="fb.errors?.['company.create']?.sort_order" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.create']?.sort_order" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>


