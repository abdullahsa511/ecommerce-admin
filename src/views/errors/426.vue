<template>
    <ErrorPage
        image-url="/media/error/426.png"
        title="Upgrade Required"
        message="Please upgrade your account to access this resource"
        cta-label="Return to Dashboard"
        cta-to="/"
        background-size="440px 360px"
        background-position="calc(50% + 15px) calc(50% - 140px)"
    />
</template>

<script setup>
import ErrorPage from './ErrorPage.vue';
</script>
