<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useTaxTypeStore } from '@/stores/taxType';
import { storeToRefs } from 'pinia';
import TaxType from '@/models/TaxType';
const router = useRouter();
const toast = useToast();
const taxTypeStore = useTaxTypeStore();
const { newTaxType, fb } = storeToRefs(taxTypeStore);

const emit = defineEmits(['update:taxType', 'saved']);
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex gap-6">
      <div class="w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
          Tax Type Details
        </h3>
        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">Name</label>
          <div class="col-span-12 md:col-span-10">
            <InputText v-model="newTaxType.name" :disabled="fb.loading['taxType.create']" class="w-full text-lg border border-gray-200 rounded-md" id="name" type="text" placeholder="Name" :class="{ 'p-invalid': fb.errors['taxType.create']?.name }" />
            <Message v-if="fb.errors['taxType.create']?.name" severity="error" size="small" variant="title">
              <span v-for="error in fb.errors['taxType.create']?.name" :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">Content</label>
          <div class="col-span-12 md:col-span-10">
            <InputText v-model="newTaxType.content" :disabled="fb.loading['taxType.create']" class="w-full text-lg border border-gray-200 rounded-md" id="content" type="text" placeholder="Content" :class="{ 'p-invalid': fb.errors['taxType.create']?.content }" />
            <Message v-if="fb.errors['taxType.create']?.content" severity="error" size="small" variant="title">
              <span v-for="error in fb.errors['taxType.create']?.content" :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>
