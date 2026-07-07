<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
// @ts-ignore
import { useLanguageStore } from '@/stores/language';

const router = useRouter();
const languageStore = useLanguageStore();
const { newLanguage, fb } = storeToRefs(languageStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/configuration/settings/languages/list`, label: 'Languages List', icon: 'pi pi-home' },
  { route: `/configuration/settings/languages/add`, label: 'Add', icon: 'pi pi-link' },
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

// Fetch taxonomy if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (newLanguage.value.language_id) {
      response = await languageStore.updateLanguage(newLanguage.value.language_id, newLanguage.value);
    } else {
      response = await languageStore.createLanguage(newLanguage.value);
    }

    if (response?.language_id) {
      router.push('/configuration/settings/languages/edit/' + response.language_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Language created successfully',
        life: 3000
      });
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save language. Please try again.', life: 5000 });
    }
  } catch (error) {
    console.error('Error saving language:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the language.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/configuration/settings/languages/edit/${routeId}`;
    const existRoute = items.value.find(item => item.route === editRoute);
    if (!existRoute) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    languageStore.resetNewLanguage();
  }
}
refreshTabs();

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
})
</script>

<template>
  <div class="taxonomy card relative">
    <Button v-if="showSaveButton" 
    :label="fb.loading['language.create'] || fb.loading['language.update.' + newLanguage.language_id] ? 'Saving...' : saveLabel" 
    :icon="fb.loading['language.create'] || fb.loading['language.update.' + newLanguage.language_id] ? 'pi pi-spinner pi-spin' : 'pi pi-save'" 
    class="p-button-md" 
    @click="handleSave" 
    :loading="fb.loading['language.create'] || fb.loading['language.update.' + newLanguage.language_id]" />
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