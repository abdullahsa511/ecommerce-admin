<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '@/stores/user';
import { UserRole } from '@/models/User';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const userStore = useUserStore();
const { newUser, fb } = storeToRefs(userStore);
const toast = useToast();
const selectedRoleId = ref<number | null>(null);

const emit = defineEmits({})

//Define local variables here
const items = ref([
    { route: `/users/list`, label: 'User List', icon: 'pi pi-home' },
    { route: `/users/add`, label: 'Add', icon: 'pi pi-link' },
    { route: `/users/import`, label: 'Import', icon: 'pi pi-link' },
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
    console.log('handleSave user:', newUser.value);
    console.log('handleSave userRole:', newUser.value.userRole);
    try {
        let response: any;
        if (newUser.value.user_id) {
            // Set userRole before saving
            // newUser.value.userRole = new UserRole({
            //     model_id: newUser.value.user_id, // Set to current user_id
            //     model_type: 'user',
            //     role_id: selectedRoleId.value ?? 1
            // });
            response = await userStore.updateUser(newUser.value.user_id, newUser.value);
        } else {
            // Set userRole before saving
            // newUser.value.userRole = new UserRole({
            //     model_id: null, // or set to user_id if available after creation
            //     model_type: 'user',
            //     role_id: selectedRoleId.value ?? 1
            // });
            response = await userStore.createUser(newUser.value);
        }
        console.log('response:', response);

        if (response?.user_id) {
            router.push('/users/edit/' + response.user_id);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User saved successfully',
                life: 3000
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save document: ' + (response?.message || ''), life: 5000 });
        }
    } catch (error) {
        console.error('Error saving user:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while saving the user.',
            life: 5000
        });
    }
};

const refreshTabs = () => {
    const routeId = router.currentRoute.value.params.id;
    if (routeId) {
        const editRoute = `/users/edit/${routeId}`;
        const existRoute = items.value.find(item => item.route === editRoute);
        if (!existRoute) {
            items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
        }
    } else {
        items.value = items.value.filter(item => !item.route.includes('/edit'));
        userStore.resetNewUser();
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
            <Button v-if="showSaveButton"
                :label="fb.loading['user.create'] ? 'Saving...' : (fb.loading['user.update.' + newUser.user_id] ? 'Updating...' : saveLabel)"
                :icon="(fb.loading['user.create'] || fb.loading['user.update.' + newUser.user_id]) ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
                :disabled="fb.loading['user.create'] || fb.loading['user.update.' + newUser.user_id]"
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

<style scoped></style>