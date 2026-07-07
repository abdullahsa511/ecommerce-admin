<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { useContactRequestStore } from '@/stores/contactRequest';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

//System variables such as props, useStore or stateToRef etc
const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const ContactRequestStore = useContactRequestStore();
const { contactRequest, fb } = storeToRefs(ContactRequestStore);
const toast = useToast();

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/contact-requests/list`, label: 'Contact Requests', icon: 'pi pi-home' }
]);
const currentRoute = computed(() => {
  return router.currentRoute.value.path;
});

const showSaveButton = computed(() => {
    const path = currentRoute.value || '';
    return path.includes('/add') || path.includes('/edit');
});

const saveLabel = computed(() => {
    return currentRoute.value && currentRoute.value.includes('/edit') ? 'Save and Update' : 'Save';
})


// Fetch customer if route is edit
const handleSave = async () => {
  try {
      // await ContactRequestStore.updateContactRequest(contactRequest.value);
      // router.push('/contact-requests/list');
      // toast.add({
      //   severity: 'success',
      //   summary: 'Success',
      //   detail: 'Contact request saved successfully',
      //   life: 3000
      // });

    let response: any;
    if (contactRequest.value.visit_showroom_id) {
      response = await ContactRequestStore.updateContactRequest(contactRequest.value);

      console.log(response);
      
    }

    if (response?.visit_showroom_id) {
      router.push('/contact-requests/list');
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Contact request saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save contact request: ' + (response?.message || ''), life: 5000 });
    }

    } catch (error) {
      console.error('Error saving lengthType:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while saving the contact request.',
        life: 5000
      });
    }
};

const refreshTabs = () => {
  if (props.id) {
    const existRoute = items.value.find(item => item.route === `/contact-requests/edit/${props.id}`);
    if (!existRoute) {
      items.value.push({ route: `/contact-requests/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
  }
  ContactRequestStore.resetContactRequest();
}
const renderIcon = (icon: string) => {
  if(props.id){
    return fb.value.loading[`contactRequest.update.${contactRequest.value.visit_showroom_id}`] ? 'pi pi-spinner pi-spin' : icon;
  }else{
    return fb.value.loading['contactRequest.create'] ? 'pi pi-spinner pi-spin' : icon;
  }
}

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
})
</script>

<template>
  <div class="contact-requests card relative">
    <Button v-if="showSaveButton" :label="saveLabel" :icon="renderIcon('pi pi-save')"  class="p-button-md" @click="handleSave" 
    :disabled="fb.loading['contactRequest.update.'+contactRequest.visit_showroom_id]" />
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

</style>

