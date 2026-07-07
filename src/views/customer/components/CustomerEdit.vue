<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomerStore } from '@/stores/customer';
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['update:customer', 'saved', 'editTabUnmunted', 'editTabMounted']);
const route = useRoute();
const CustomerStore = useCustomerStore();
const { customer, fb } = storeToRefs(CustomerStore);

// 🔹 When component mounted
onMounted(async () => {
  emit('editTabMounted');

  // Load customer (for edit)
  if (route.params.id) {
    await CustomerStore.getCustomerById(route.params.id as string);
  }
});

onUnmounted(() => {
  emit('editTabUnmunted');
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Customer Form -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Customer</h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Name</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="customer.name" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter customer name" :class="{ 'p-invalid': fb.errors?.['customer.update.' + customer.customer_id]?.name }" />
              <Message v-if="fb.errors?.['customer.update.' + customer.customer_id]?.name" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['customer.update.' + customer.customer_id]?.name" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Org Code -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Org Code
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="customer.org_code" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter org code" @input="onFieldChange"
              :class="{ 'p-invalid': fb.errors?.['customer.update.' + customer.customer_id]?.org_code }" />
            <Message v-if="fb.errors?.['customer.update.' + customer.customer_id]?.org_code" severity="error" size="small" variant="title">
              <span v-for="error in fb.errors?.['customer.update.' + customer.customer_id]?.org_code" :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>

          <!-- Email -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Email</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="customer.gmail_Id" type="email"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter email address"
              :class="{ 'p-invalid': fb.errors?.['customer.update.' + customer.customer_id]?.gmail_Id }" />
              <Message v-if="fb.errors?.['customer.update.' + customer.customer_id]?.gmail_Id" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['customer.update.' + customer.customer_id]?.gmail_Id" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <!-- Phone -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Phone</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="customer.phone" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter phone number" />
          </div>

          <!-- Address -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Address</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="customer.address" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter address" />
          </div>

          <!-- User ID -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">User ID</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="customer.user_id" type="number"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter user ID" />
          </div>
        </div>
      </div>

      <!-- Right column: Preview Sidebar -->
      <div class="sm:w-full md:w-3/5 space-y-4" v-if="customer.customer_id">
        <div class="border border-gray-200 rounded-md p-4">
          <h4 class="text-lg font-medium mb-2">Customer Preview</h4>
          <p><strong>Name:</strong> {{ customer.name }}</p>
          <p><strong>Email:</strong> {{ customer.email }}</p>
          <p><strong>Phone:</strong> {{ customer.phone }}</p>
          <p v-if="customer.address"><strong>Address:</strong> {{ customer.address }}</p>
          <p v-if="customer.user_id"><strong>User ID:</strong> {{ customer.user_id }}</p>
        </div>
      </div>
    </div>
    <div class="loading-overlay" v-if="fb.loading['customer.show.' + route.params.id]">
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
