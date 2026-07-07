<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import { useQuoteStore } from '@/stores/quote';
import { useToast } from 'primevue';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const quoteStore = useQuoteStore();
const { fb, quote } = storeToRefs(quoteStore);
const toast = useToast();

const emit = defineEmits({})

const items = ref([
  { route: `/ecommerce/sales/quotes/list`, label: 'Quote List', icon: 'pi pi-home' },
  { route: `/ecommerce/sales/quotes/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/ecommerce/sales/quotes/items`, label: 'Items', icon: 'pi pi-link' },
  { route: `/ecommerce/sales/quotes/import`, label: 'Import', icon: 'pi pi-link' },
]);

const currentRoute = computed(() => {
  return router.currentRoute.value.path;
});

const showSaveButton = computed(() => {
  const path = currentRoute.value || '';
  return path.includes('/add') || path.includes('/edit');
});
// Change Save button label based on route
const saveLabel = computed(() => {
  return currentRoute.value && currentRoute.value.includes('/edit') ? 'Save and Update' : 'Save';
})


// Fetch quote if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (quote.value.quote_id) {
      response = await quoteStore.updateQuote(quote.value);
    } else {
      // Create new quote
      response = await quoteStore.createQuote(quote.value);
    }

    if (response?.quote_id) {
      router.push('/ecommerce/sales/quotes/edit/'+ response.quote_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Quote saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save quote: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving quote:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the quote.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/ecommerce/sales/quotes/edit/${routeId}`;
    const existRoute = items.value.find(item => item.route === editRoute);
    if (!existRoute) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
  }
}
refreshTabs();

const renderIcon = (icon: string) => {  
    if (props.id) {
    return fb.value.loading[`quote.update.${quote.value.quote_id}`] ? 'pi pi-spinner pi-spin' : icon;
    }else{
        return fb.value.loading['quote.create'] ? 'pi pi-spinner pi-spin' : icon;
    }
}

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
})
</script>


<template>
    <div class="card relative">
        <div class="sticky top-0 z-50 bg-white p-2">
            <Button v-if="showSaveButton" :label="saveLabel" :icon="renderIcon('pi pi-save')" class="p-button-md"
                @click="handleSave" :disabled="fb.loading['quote.update.' + quote.quote_id]"/>
        </div>
      <Tabs :value="currentRoute" scrollable>
        <TabList>
          <template v-for="tab in items" :key="tab.label">
            <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
              <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
                <a v-ripple :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">
                  <i :class="tab.icon" />
                  <span>{{ tab.label }}</span>
                </a>
              </Tab>
            </router-link>
          </template>
        </TabList>
        <div class="py-6">
          <router-view @editTabUnmunted="refreshTabs" @saved="handleSave" @editTabMounted="refreshTabs" />
        </div>
      </Tabs>
    </div>
  </template>


<style scoped>

:deep(.p-datatable-tbody > tr) {
    height: 100px;
}
</style> 