<script setup lang="ts">
import { computed, PropType } from 'vue';
import Site from '@/models/Site';
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps({
  site: {
    type: Site,
    required: true,
    default: () => new Site()
  },
  fb: {
    type: Object as PropType<any>,
    required: false,
    default: () => ({})
  }
});

const siteId = computed(() => {
    const routeId = route.params.id;
    const normalizedRouteId = Array.isArray(routeId) ? routeId[0] : routeId;
    return props.site.site_id ?? normalizedRouteId ?? '';
});


</script>
<template>
    <div class="loading-overlay" v-if="siteId && props.fb?.loading?.['site.edit.' + siteId] || props.fb?.loading?.['site.create']">
        <div class="flex justify-center items-center h-full spinner">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
            <p class="mt-2">Loading site data. Please wait.</p>
        </div>
    </div>
    <!-- Comments Tab -->
    <div class="flex flex-col gap-6">
        <div class="space-y-6">
            <!-- Default post comments -->
            <div class="grid grid-cols-12 gap-2">
                <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Default post comments</label>
                <div class="col-span-12 md:col-span-9">
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="site.commentSettings.allow_comments" :binary="true" />
                        <label class="text-lg">Allow comments</label>
                    </div>
                    <div class="text-gray-500 text-sm mt-1">Individual posts may override these settings.</div>
                </div>
            </div>

            <!-- Anonymous comments -->
            <div class="grid grid-cols-12 gap-2">
                <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Anonymous comments</label>
                <div class="col-span-12 md:col-span-9">
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="site.commentSettings.logged_in_comments" :binary="true" />
                        <label class="text-lg">Allow comments only from logged in users</label>
                    </div>
                </div>
            </div>

            <!-- Automatically close comments -->
            <div class="grid grid-cols-12 gap-2">
                <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Automatically close comments</label>
                <div class="col-span-12 md:col-span-9">
                    <div class="flex items-center flex-nowrap whitespace-nowrap">
                        <span class="text-lg">On posts older than</span>
                        <InputText v-model="site.commentSettings.close_comments_days_old" type="number" class="mx-2" style="width: 100px;" />
                        <span class="text-lg">days</span>
                    </div>
                </div>
            </div>

            <!-- Nested comments level -->
            <div class="grid grid-cols-12 gap-2">
                <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Nested comments level</label>
                <div class="col-span-12 md:col-span-9 flex items-center gap-2">
                    <Select 
                        v-model="site.commentSettings.thread_comments_depth" 
                        :options="['1', '2', '3', '4', '5']"
                        placeholder="Select a Sort Order" 
                        class="w-40 text-lg" 
                    />
                    <span class="text-lg">levels deep</span>
                </div>
            </div>

            <!-- Comments pagination -->
            <div class="grid grid-cols-12 gap-2">
                <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Comments pagination</label>
                <div class="col-span-12 md:col-span-9">
                    <div class="flex items-center flex-nowrap whitespace-nowrap">
                        <Checkbox v-model="site.commentSettings.break_comments" :binary="true" />
                        <span class="text-lg ml-2">Break comments into pages with</span>
                        <InputText v-model="site.commentSettings.comments_per_page" type="number" class="mx-2" style="width: 100px;" />
                        <span class="text-lg">top level comments per page and the</span>
                        <Select v-model="site.commentSettings.default_comments_page" :options="['first', 'last']" class="mx-2" style="width: 100px;" />
                        <span class="text-lg">page displayed by default</span>
                    </div>
                </div>
            </div>

            <!-- Comments sort order -->
            <div class="grid grid-cols-12 gap-2">
                <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Comments sort order</label>
                <div class="col-span-12 md:col-span-9">
                    <Select 
                        v-model="site.commentSettings.comment_order" 
                        :options="['older', 'newer']"
                        placeholder="Select a Sort Order" 
                        class="w-40 text-lg" 
                    />
                </div>
            </div>
        </div>
    </div>
</template>