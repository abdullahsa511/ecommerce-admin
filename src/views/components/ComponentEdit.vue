<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from 'vue-router';
import Component from '@/models/Component';
import { useComponentStore } from '@/stores/component';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const router = useRouter();
const componentStore = useComponentStore();
const { fb, componentData } = storeToRefs(componentStore);
const route = useRoute();
const id = ref(route.params.id);

// Computed property to determine the items tab route
const itemsTabRoute = computed(() => {
    return componentData.value.component_id 
        ? `/components/${componentData.value.component_id}/items` 
        : '/components/items';
});

const items = computed(() => [
    { route: `/components/${id.value}/overview`, label: 'Component Overview', icon: 'pi pi-home', disabled: false },
    { route: `/components/${id.value}/items`, label: 'Component Items', icon: 'pi pi-chart-line', disabled: false },
]);

const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});

const updateComponent = (prop, value) => {
    const keys = prop.split('.');
    let current = componentData.value;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            current[keys[i]] = {}; // Create the object if it doesn't exist
        }
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

// Handler for when component is saved
const onComponentSaved = (savedComponent) => {
    if (savedComponent && savedComponent.component_id) {        
        // Navigate to the items tab using the new component ID
        router.push(`/components/${savedComponent.component_id}/overview`);
    }
}

onMounted(async () => {
    try {
        await componentStore.fetchComponentById(id.value);
        // setTimeout(() => {
        //     console.log('component', componentData.value);
        // }, 5000);
    } catch (error) {
        console.error('Error fetching component:', error);
    }
});

</script>
<template>
    <div class="card">
        <h2 class="text-2xl font-bold">{{ componentData?.name || 'New Component' }}</h2>
        <Tabs :value="currentRoute" scrollable>
            <TabList >
                <template v-for="tab in items" :key="tab.label">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <Tab 
                            :active="currentRoute === tab.route || (tab.route.includes('/items') && currentRoute.includes('/items'))"
                            :key="tab.label" 
                            :value="tab.route" 
                            :disabled="tab.disabled"
                            @click="navigate"
                        >
                            <a v-ripple :href="href" class="flex items-center gap-2 text-inherit" :class="{ 'opacity-50 pointer-events-none': tab.disabled }">
                                <i :class="tab.icon" />
                                <span>{{ tab.label }}</span>
                            </a>
                        </Tab>
                    </router-link>
                </template>
            </TabList>
            <div class="p-6">
                <router-view @saved="onComponentSaved"/>
            </div>
        </Tabs>
        <div v-if="fb.loading['component']" class="overlay" 
            style="
                position: absolute;
                z-index: 999999;
                width: 100%;
                height: 100vh;
                left: 0;
                top: 0;
                padding:25px;
            "
        >
            <div class="flex justify-center items-center h-full"
            style="
                background: rgba(0, 0, 0, .3);
                border-radius: 15px;
            ">
                <div class="flex flex-col gap-2">
                    ... Loading
                </div>
            </div>
        </div>
    </div>
</template>
