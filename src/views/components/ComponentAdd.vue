<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from 'vue-router';
import Component from '@/models/Component';
import { useComponentStore } from "@/stores/component";
import { storeToRefs } from "pinia";

const router = useRouter();
const componentStore = useComponentStore();
const { componentData } = storeToRefs(componentStore);

// Computed property to determine the items tab route

const tabs = computed(() => [
    { route: '/components/add', label: 'Component Overview', icon: 'pi pi-home', disabled: false }
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
    console.log(componentData.value);
}

// Handler for when component is saved
const onComponentSaved = (savedComponent) => {
    if (savedComponent && savedComponent.component_id) {
        // Navigate to the items tab using the new component ID
        router.push(`/components/${savedComponent.component_id}/overview`);
    }
}
</script>
<template>
    <div class="card">
        <Tabs :value="currentRoute" scrollable>
            <TabList >
                <template v-for="tab in tabs" :key="tab.label">
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
    </div>
</template>
