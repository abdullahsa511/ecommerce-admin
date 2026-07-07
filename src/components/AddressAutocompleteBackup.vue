<!-- eslint-disable vue/no-setup-props-destructure -->
<template>
    <div class="address-autocomplete">
        <div class="input-wrapper">
            <input
                v-model="searchQuery"
                type="text"
                :placeholder="placeholder"
                @input="handleInput"
                @focus="showSuggestions = true"
                class="address-input"
            />
            <div v-if="isLoading" class="loading-indicator">
                Loading...
            </div>
        </div>

        <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-list">
            <div
                v-for="suggestion in suggestions"
                :key="suggestion.place_id"
                class="suggestion-item"
                @click="handleSelect(suggestion)"
            >
                <div class="main-text">{{ suggestion.structured_formatting.main_text }}</div>
                <div class="secondary-text">{{ suggestion.structured_formatting.secondary_text }}</div>
            </div>
        </div>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useGooglePlaces } from '@/composables/useGooglePlaces';
import type { Address } from '@/models/Google';
import { debounce } from 'lodash-es';

const props = defineProps<{
    apiKey: string;
    placeholder?: string;
    modelValue?: Address;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: Address): void;
    (e: 'select', value: Address): void;
}>();

const { isLoading, error, initializeGoogleMaps, getPlacePredictions } = useGooglePlaces();

const searchQuery = ref('');
const suggestions = ref<Address[]>([]);
const showSuggestions = ref(false);

const debouncedSearch = debounce(async (query: string) => {
    if (query.length < 2) {
        suggestions.value = [];
        return;
    }

    suggestions.value = await getPlacePredictions(query, {
        locationRestriction: {
            west: 113,    // Western Australia
            north: -10,   // Cape York, Australia
            east: 179,    // Eastern New Zealand
            south: -47    // Southern New Zealand
        }
    });
}, 300);

const handleInput = () => {
    debouncedSearch(searchQuery.value);
};

const handleSelect = (suggestion: Address) => {
    searchQuery.value = suggestion.description;
    showSuggestions.value = false;
    emit('update:modelValue', suggestion);
    emit('select', suggestion);
};

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        searchQuery.value = newValue.description;
    }
}, { immediate: true });

onMounted(async () => {
    await initializeGoogleMaps(props.apiKey);
});
</script>

<style scoped>
.address-autocomplete {
    position: relative;
    width: 100%;
}

.input-wrapper {
    position: relative;
}

.address-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}

.loading-indicator {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
}

.suggestions-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 4px 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
}

.suggestion-item {
    padding: 8px;
    cursor: pointer;
}

.suggestion-item:hover {
    background-color: #f5f5f5;
}

.main-text {
    font-weight: 500;
}

.secondary-text {
    font-size: 0.9em;
    color: #666;
}

.error-message {
    color: red;
    margin-top: 4px;
    font-size: 0.9em;
}
</style> 