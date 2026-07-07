<template>
    <section class="error-page" :style="backgroundStyle">
        <h1>{{ title }}</h1>
        <p>{{ message }}</p>
        <a v-if="resolvedCtaTarget" class="p-button k-button" :href="resolvedCtaTarget">
            {{ ctaLabel }}
        </a>
    </section>
</template>

<script setup>
import { computed } from 'vue';
import { mediaUrl } from '@/utils/mediaUrl';

const props = defineProps({
    imageUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    ctaLabel: {
        type: String,
        default: 'Return to Dashboard'
    },
    ctaTo: {
        type: [String, Object],
        default: ''
    },
    ctaTarget: {
        type: String,
        default: ''
    },
    backgroundSize: {
        type: String,
        default: '400px 370px'
    },
    backgroundPosition: {
        type: String,
        default: 'calc(50% + 0px) calc(50% - 130px)'
    }
});

const backgroundStyle = computed(() => ({
    backgroundImage: `url('${mediaUrl(props.imageUrl)}')`,
    backgroundSize: props.backgroundSize,
    backgroundPosition: props.backgroundPosition
}));

const webBaseUrl = (import.meta.env.VITE_WEB_BASE_URL || '').replace(/\/$/, '');

const resolvedCtaTarget = computed(() => {
    const rawTarget = props.ctaTarget || (typeof props.ctaTo === 'string' ? props.ctaTo : '');
    if (!rawTarget) {
        return '';
    }

    if (/^(https?:)?\/\//.test(rawTarget) || !webBaseUrl) {
        return rawTarget;
    }

    const normalizedPath = rawTarget.startsWith('/') ? rawTarget : `/${rawTarget}`;
    return `${webBaseUrl}${normalizedPath}`;
});
</script>

<style scoped>
.error-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 250px;
    width: 100%;
    min-height: 70vh;
    background-repeat: no-repeat;
    color: #717784;
    text-align: center;
}

h1 {
    margin: 0;
    font-family: Inter, Nunito, sans-serif;
    font-size: 25px;
    font-weight: 600;
    color: #212529;
}

.error-page p {
    margin-top: 0;
    margin-bottom: 14px;
    font-family: Inter, Nunito, sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: #889191;
}

.p-button {
    border: 1px solid #262626;
    border-radius: 5px;
    box-shadow: 0 0 6px #34357e1b;
    padding: 0.4rem 1.2rem;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    background: #262626;
    text-decoration: none;
    transition:
        background-color 0.2s,
        color 0.2s,
        border-color 0.2s,
        box-shadow 0.2s;
}
</style>
