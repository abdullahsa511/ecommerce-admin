<script setup lang="ts">
  import { ref, onMounted, computed, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useProductAttributeStore } from '@/stores/productAttribute';
  import Select from 'primevue/select';
  import InputText from 'primevue/inputtext';
  import Message from 'primevue/message';
  import { storeToRefs } from 'pinia';
  
  const emit = defineEmits(['saved', 'editTabUnmunted', 'editTabMounted']);
  const route = useRoute();
  const ProductAttributeStore = useProductAttributeStore();
  const { attribute, groups, fb } = storeToRefs(ProductAttributeStore);
  
  // Computed selected group preview data
  const selectedAttributeGroup = computed(() =>
    groups.value?.find((g: any) => Number(g.id) === Number(attribute.value.attribute_group_id)) ?? null
  );
  
  // Load attribute on mount
  onMounted(async () => {
    emit('editTabMounted');
  
    if (route.params.id) {
      await ProductAttributeStore.getAttributeById(route.params.id as string);
      // Convert to number to match group id type
      attribute.value.attribute_group_id = Number(attribute.value.attribute_group_id);
    }
  
    await ProductAttributeStore.fetchAttributeGroups();
    console.log('groups: ', groups.value);
  });
  
  onUnmounted(() => {
    emit('editTabUnmunted');
  });
  </script>
  
  <template>
    <div class="flex flex-col gap-6">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Left column -->
        <div class="sm:w-full md:w-3/5 space-y-4">
          <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
            Edit Attribute
          </h3>
  
          <div class="grid grid-cols-12 gap-x-6 gap-y-4">
            <!-- Attribute Name -->
            <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
              Name
            </label>
            <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
              <InputText
                v-model="attribute.content.name"
                class="w-full text-lg border border-gray-200 rounded-md p-2"
                placeholder="Enter attribute name"
                :class="{ 'p-invalid': fb.errors['attribute.update.' + route.params.id]?.name }"
              />
              <Message
                v-if="fb.errors['attribute.update.' + route.params.id]?.name"
                severity="error"
                size="small"
                variant="title"
              >
                <span
                  v-for="error in fb.errors['attribute.update.' + route.params.id]?.name"
                  :key="error"
                  class="flex flex-col"
                >
                  {{ error }}
                </span>
              </Message>
            </div>
  
            <!-- Attribute Group -->
            <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
              Group
            </label>
            <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
              <Select
                v-model="attribute.attribute_group_id"
                :options="groups"
                optionLabel="name"
                :optionValue="g => Number(g.id)"
                placeholder="Select a group"
                class="w-full"
                :class="{ 'p-invalid': fb.errors['attribute.update.' + route.params.id]?.attribute_group_id }"
              />
              <Message
                v-if="fb.errors['attribute.update.' + route.params.id]?.attribute_group_id"
                severity="error"
                size="small"
                variant="title"
              >
                <span
                  v-for="error in fb.errors['attribute.update.' + route.params.id]?.attribute_group_id"
                  :key="error"
                  class="flex flex-col"
                >
                  {{ error }}
                </span>
              </Message>
            </div>
  
            <!-- Sort Order -->
            <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
              Sort Order
            </label>
            <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
              <InputText
                v-model="attribute.sort_order"
                class="w-full text-lg border border-gray-200 rounded-md p-2"
                placeholder="Enter sort order"
                :class="{ 'p-invalid': fb.errors['attribute.update.' + route.params.id]?.sort_order }"
              />
              <Message
                v-if="fb.errors['attribute.update.' + route.params.id]?.sort_order"
                severity="error"
                size="small"
                variant="title"
              >
                <span
                  v-for="error in fb.errors['attribute.update.' + route.params.id]?.sort_order"
                  :key="error"
                  class="flex flex-col"
                >
                  {{ error }}
                </span>
              </Message>
            </div>
          </div>
        </div>
  
        <!-- Right preview column -->
        <div class="sm:w-full md:w-3/5 space-y-4" v-if="attribute.attribute_id">
          <div class="border border-gray-200 rounded-md p-4">
            <h4 class="text-lg font-medium mb-2">Attribute Preview</h4>
            <p><strong>Name:</strong> {{ attribute.content.name }}</p>
            <p>
              <strong>Group:</strong>
              {{ selectedAttributeGroup?.name ?? 'No group selected' }}
            </p>
            <p><strong>Sort Order:</strong> {{ attribute.sort_order }}</p>
          </div>
        </div>
      </div>
  
      <!-- Loading Overlay -->
      <div class="loading-overlay" v-if="fb.loading['attribute.show.' + route.params.id]">
        <div class="flex justify-center items-center h-full spinner">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <p class="mt-2">Loading...</p>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* optional styles */
  </style>
  