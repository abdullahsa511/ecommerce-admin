<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const items = ref([
    { route: '/pages/list', label: 'Pages List', icon: 'pi pi-home' },
    { route: '/pages/add/general', label: 'Add', icon: 'pi pi-plus' },
    { route: '/pages/import', label: 'Import', icon: 'pi pi-upload' },
]);

const currentRoute = computed(() => router.currentRoute.value.path);
const refreshTabs = () => {
    const routeId = router.currentRoute.value.params.id;
    if (routeId) {
        const editRoute = `/pages/edit/${routeId}/general` || `/pages/edit/${routeId}/seo`;
        const existRoute = items.value.find(item => item.route === editRoute);
        if (!existRoute) {
            items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-pencil' });
        }
    } else {
        items.value = items.value.filter(item => !item.route.includes('/edit'));
    }
}
refreshTabs();

onMounted(() => {
    refreshTabs();
});
</script>
<template>
    <div class="card relative">
        <Tabs :value="currentRoute" scrollable>
            <TabList>
                <template v-for="tab in items" :key="tab.label">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
                            <a v-ripple :href="href" class="flex items-center gap-2 text-inherit">
                                <i :class="tab.icon" />
                                <span>{{ tab.label }}</span>
                            </a>
                        </Tab>
                    </router-link>
                </template>
            </TabList>
            <div class="p-6">
                <router-view @editTabUnmunted="refreshTabs" @editTabMounted="refreshTabs"/>
            </div>
        </Tabs>
    </div>
</template>

<style scoped>
.p-button-md {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1000;
}

.p-button-md-bottom {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}
</style>