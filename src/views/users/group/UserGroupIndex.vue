<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useUserGroupStore } from '@/stores/userGroup';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const userGroupStore = useUserGroupStore();
const { userGroup, fb } = storeToRefs(userGroupStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/users/groups/list`, label: 'User Group List', icon: 'pi pi-home' },
  { route: `/users/groups/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/users/groups/import`, label: 'Import', icon: 'pi pi-link' },
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

// Fetch document if route is edit
const handleSave = async () => {
    try {
        let response: any;
        if (userGroup.value.user_group_id) {
            response = await userGroupStore.updateUserGroup(userGroup.value.user_group_id, userGroup.value);
        } else {
            response = await userGroupStore.createUserGroup(userGroup.value);
        }

        if (response?.user_group_id) {
            router.push('/users/groups/edit/' + response.user_group_id);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User group saved successfully',
                life: 3000
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save user group: ' + (response?.message || ''), life: 5000 });
        }
    } catch (error) {
        console.error('Error saving user group:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while saving the user group.',
            life: 5000
        });
    }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/users/groups/edit/${routeId}`;
    const existRoute = items.value.find(item => item.route === editRoute);
    if (!existRoute) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    userGroupStore.resetUserGroup();
  }
}
refreshTabs();

//Lifecycle hook started from here
onMounted(() => {
    refreshTabs();
})
</script>

<template>
    <div class="document card relative p-0">
        <div class="sticky top-0 z-50 bg-white p-2">
            <Button
                v-if="showSaveButton"
                :label="fb.loading['userGroup.create'] ? 'Saving...' : (fb.loading['userGroup.update.' + userGroup.user_group_id] ? 'Updating...' : saveLabel)"
                :icon="(fb.loading['userGroup.create'] || fb.loading['userGroup.update.' + userGroup.user_group_id]) ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
                :disabled="fb.loading['userGroup.create'] || fb.loading['userGroup.update.' + userGroup.user_group_id]"
                class="p-button-md"
                @click="handleSave"
            />
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
            <div class="">
                <router-view @editTabUnmunted="refreshTabs" @saved="handleSave" @editTabMounted="refreshTabs" />
            </div>
        </Tabs>
    </div>
</template>

<style scoped>

</style>