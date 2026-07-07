<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';
import { useContactRequestStore } from '@/stores/contactRequest';

const emit = defineEmits(['update:customer', 'saved', 'editTabUnmunted', 'editTabMounted']);
const route = useRoute();
const ContactRequestStore = useContactRequestStore();
const { contactRequest, fb } = storeToRefs(ContactRequestStore);

const timeSlots = ref([
  { name: '09:00 AM', value: '09:00:00' },
  { name: '09:10 AM', value: '09:10:00' },
  { name: '09:20 AM', value: '09:20:00' },
  { name: '09:30 AM', value: '09:30:00' },
  { name: '09:40 AM', value: '09:40:00' },
  { name: '09:50 AM', value: '09:50:00' },
  { name: '10:00 AM', value: '10:00:00' },
  { name: '10:10 AM', value: '10:10:00' },
  { name: '10:20 AM', value: '10:20:00' },
  { name: '10:30 AM', value: '10:30:00' },

  { name: '17:00 PM', value: '17:00:00' },
  { name: '17:10 PM', value: '17:10:00' },
  { name: '17:20 PM', value: '17:20:00' },
  { name: '17:30 PM', value: '17:30:00' },
  { name: '17:40 PM', value: '17:40:00' },
  { name: '17:50 PM', value: '17:50:00' },
  { name: '18:00 PM', value: '18:00:00' },
  { name: '18:10 PM', value: '18:10:00' },
  { name: '18:20 PM', value: '18:20:00' },

]);

// 🔹 When component mounted
onMounted(async () => {
  emit('editTabMounted');

  // Load contact request (for edit)
  if (route.params.id) {
    await ContactRequestStore.getContactRequestById(route.params.id as string);
  }
});

onUnmounted(() => {
  emit('editTabUnmunted');
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Contact Request Form -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Contact Request</h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Customer Name -->
          <!-- <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Customer Name</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="contactRequest.customer_name" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter customer name" :class="{ 'p-invalid': fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.customer_name }" />
              <Message v-if="fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.customer_name" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.customer_name" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>

          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Contact Name</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="contactRequest.showroom_contact_name" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter showroom contact name"
              :class="{ 'p-invalid': fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.showroom_contact_name }" />
            <Message v-if="fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.showroom_contact_name" severity="error" size="small" variant="title">
              <span v-for="error in fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.showroom_contact_name" :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>

          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Showroom Name</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="contactRequest.showroom_title" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter showroom title"
              :class="{ 'p-invalid': fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.showroom_title }" />
            <Message v-if="fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.showroom_title" severity="error" size="small" variant="title">
              <span v-for="error in fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.showroom_title" :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div> -->

          <!-- Pinboard Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Tour Type</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <Select v-model="contactRequest.tour_type" class="w-full text-lg border border-gray-200 rounded-md p-2"
              :options="[{ name: 'Physical Tour', value: 'physicalTour' }, { name: 'Virtual Tour', value: 'virtualTour' }]" optionLabel="name" optionValue="value" placeholder="Select tour type"
              :class="{ 'p-invalid': fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.tour_type }" />
            <Message v-if="fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.tour_type" severity="error" size="small" variant="title">
              <span v-for="error in fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.tour_type" :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>

          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Date</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="contactRequest.date" type="date" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter date"
              :class="{ 'p-invalid': fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.date }" />
            <Message v-if="fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.date" severity="error" size="small" variant="title">
              <span v-for="error in fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.date" :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>

          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Meeting Time</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
              <Select v-model="contactRequest.meeting_time" :options="timeSlots" optionLabel="name" optionValue="value" placeholder="Select meeting time" class="w-full text-lg border border-gray-200 rounded-md p-2"
                :class="{ 'p-invalid': fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.meeting_time }">
                <template #option="{ option }">
                  <div class="flex items-center gap-2">
                    <span>{{ option.name }}</span>
                  </div>  
                </template>
              </Select>
          </div>

          <!-- Time Zone -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Time Zone</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="contactRequest.time_zone" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter time zone"
              :class="{ 'p-invalid': fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.time_zone }" />
              <Message v-if="fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.time_zone" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['contactRequest.update.' + contactRequest.visit_showroom_id]?.time_zone" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
          </div>
        </div>
      </div>

    </div>
    <div class="loading-overlay" v-if="fb.loading['contactRequest.update.' + contactRequest.visit_showroom_id]">
      <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading contact request details. Please wait.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional custom styles */
</style>
