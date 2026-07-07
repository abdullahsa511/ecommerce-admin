<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCompanyStore } from '@/stores/company';
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';


const emit = defineEmits(['update:company', 'saved', 'editTabUnmunted', 'editTabMounted']);
const route = useRoute();
const CompanyStore = useCompanyStore();
const { company, fb } = storeToRefs(CompanyStore);

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
  console.log('event', event);
  company.value.vendor_id = event.value.vendor_id;
  company.value.vendor_name = event.value.name;
  console.log('company', company.value);
}

// 🔹 When component mounted
onMounted(async () => {
  emit('editTabMounted');

  // Load company (for edit)
  if (route.params.id) {
    await CompanyStore.getCompanyById(route.params.id as string);
  }
});

onUnmounted(() => {
  emit('editTabUnmunted');
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Company Form -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Company</h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Company Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Company Name</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.company_name" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter company name" :class="{'p-invalid': fb.errors?.['company.update.' + company.company_id]?.company_name}" />
              <Message v-if="fb.errors?.['company.update.' + company.company_id]?.company_name" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.update.' + company.company_id]?.company_name" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Company Code -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Company Code</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.company_code" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter company code" :class="{'p-invalid': fb.errors?.['company.update.' + company.company_id]?.company_code}" />
              <Message v-if="fb.errors?.['company.update.' + company.company_id]?.company_code" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.update.' + company.company_id]?.company_code" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Company Prefix -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Company Prefix</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.company_prefix" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter company prefix" :class="{'p-invalid': fb.errors?.['company.update.' + company.company_id]?.company_prefix}" />
              <Message v-if="fb.errors?.['company.update.' + company.company_id]?.company_prefix" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.update.' + company.company_id]?.company_prefix" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Vendor ID -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Vendor</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <!-- <InputText v-model="company.vendor_id" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter vendor ID" :class="{'p-invalid': fb.errors?.['company.update.' + company.company_id]?.vendor_id}" />
              <Message v-if="fb.errors?.['company.update.' + company.company_id]?.vendor_id" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.update.' + company.company_id]?.vendor_id" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message> -->

              <AutoComplete 
                v-model="company.vendor_name"
                ref="vendorIdAutocomplete" 
                optionLabel="name"
                placeholder="Search vendors" 
                class="w-full text-lg border border-gray-200 rounded-md p-2"
                inputClass="w-full text-lg border border-gray-200 rounded-md p-2" 
                :class="{'p-invalid': fb.errors?.['company.update.' + company.company_id]?.vendor_id}"
                :suggestions="vendorIdSuggestions"
                @complete="onVendorIdInput" 
                @item-select="onVendorIdItemSelect"
              />
              <Message v-if="fb.errors?.['company.update.' + company.company_id]?.vendor_id" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.update.' + company.company_id]?.vendor_id" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>

          </div>

          <!-- Company Entity -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Company Entity</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.company_entity" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter company entity" 
              :class="{'p-invalid': fb.errors?.['company.update.' + company.company_id]?.company_entity}" />
              <Message v-if="fb.errors?.['company.update.' + company.company_id]?.company_entity" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.update.' + company.company_id]?.company_entity" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Company Short -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Company Short</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.company_short" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter company short" 
              :class="{'p-invalid': fb.errors?.['company.update.' + company.company_id]?.company_short}" />
              <Message v-if="fb.errors?.['company.update.' + company.company_id]?.company_short" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.update.' + company.company_id]?.company_short" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Company Trade Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Trade Name</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.company_trade_name" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter trade name" 
              :class="{'p-invalid': fb.errors?.['company.update.' + company.company_id]?.company_trade_name}" />
              <Message v-if="fb.errors?.['company.update.' + company.company_id]?.company_trade_name" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.update.' + company.company_id]?.company_trade_name" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Company Entity Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Entity Name</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.company_entity_name" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter entity name" 
              :class="{'p-invalid': fb.errors?.['company.update.' + company.company_id]?.company_entity_name}" />
              <Message v-if="fb.errors?.['company.update.' + company.company_id]?.company_entity_name" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.update.' + company.company_id]?.company_entity_name" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Phone Main -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Phone Main</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.phone_main" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter phone number" 
              :class="{'p-invalid': fb.errors?.['company.update.' + company.company_id]?.phone_main}" />
              <Message v-if="fb.errors?.['company.update.' + company.company_id]?.phone_main" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['company.update.' + company.company_id]?.phone_main" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Sort Order -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Sort Order</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="company.sort_order as any" type="number" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter sort order" />
          </div>
        </div>
      </div>

      <!-- Right column: Preview Sidebar -->
      <div class="sm:w-full md:w-3/5 space-y-4" v-if="company.company_id">
        <div class="border border-gray-200 rounded-md p-4">
          <h4 class="text-lg font-medium mb-2">Company Preview</h4>
          <p><strong>Name:</strong> {{ company.company_name }}</p>
          <p><strong>Code:</strong> {{ company.company_code }}</p>
          <p><strong>Prefix:</strong> {{ company.company_prefix }}</p>
          <p><strong>Vendor name:</strong> {{ company.vendor_name }}</p>
          <p v-if="company.company_entity"><strong>Entity:</strong> {{ company.company_entity }}</p>
          <p v-if="company.phone_main"><strong>Phone:</strong> {{ company.phone_main }}</p>
        </div>
      </div>
    </div>
    <div class="loading-overlay" v-if="fb.loading['company.show.' + route.params.id]">
      <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional custom styles */
</style>


