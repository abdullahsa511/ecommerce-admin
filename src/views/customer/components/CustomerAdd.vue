<script setup lang="ts">
import { defineEmits, ref, onMounted } from 'vue';
import { useCustomerStore } from '@/stores/customer';
import { storeToRefs } from 'pinia';
import InputText from 'primevue/inputtext';

// Props
const CustomerStore = useCustomerStore();
const { customer, fb } = storeToRefs(CustomerStore);
// Emit to parent
const emit = defineEmits(['update:customer', 'saved']);

// Update parent on field changes
const onFieldChange = () => {
  emit('update:customer', customer.value);
};

// Set default values on mount
onMounted(() => {
  // Reset customer on mount
  CustomerStore.resetCustomer();
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Customer Form -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
          Customer Details
        </h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Name
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="customer.name"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter customer name"
              @input="onFieldChange" :class="{'p-invalid': fb.errors?.['customer.create']?.name}" />
              <Message v-if="fb.errors?.['customer.create']?.name" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['customer.create']?.name" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Org Code -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Org Code
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="customer.org_code"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter org code"
              @input="onFieldChange" :class="{'p-invalid': fb.errors?.['customer.create']?.org_code}" />
              <Message v-if="fb.errors?.['customer.create']?.org_code" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['customer.create']?.org_code" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Email -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Email
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="customer.gmail_Id" type="email"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter email address"
              @input="onFieldChange" />
          </div>

          <!-- Phone -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Phone
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="customer.phone"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter phone number"
              @input="onFieldChange" />
          </div>

          <!-- Address -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Address
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="customer.address"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter address"
              @input="onFieldChange" />
          </div>

          <!-- User ID -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            User ID
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="customer.user_id" type="number"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter user ID"
              @input="onFieldChange" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>

