<template>
    <ErrorPage
        image-url="/media/error/401.png"
        title="Unauthorized Access"
        message="You do not have permission to access this page"
        cta-label="Login"
        :cta-target="loginUrl"
        background-size="400px 370px"
        background-position="calc(50% + 0px) calc(50% - 130px)"
    />
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { buildAdminLoginUrl } from '@/services/authSessionService';
import ErrorPage from './ErrorPage.vue';

const route = useRoute();

const requestedPageUrl = computed(() => {
    const rawRedirect = route.query.redirect;
    const redirect = Array.isArray(rawRedirect) ? rawRedirect[0] : rawRedirect;

    if (typeof redirect === 'string' && redirect.trim()) {
        return redirect.trim();
    }

    return '';
});

const loginUrl = computed(() => buildAdminLoginUrl(requestedPageUrl.value));
</script>
