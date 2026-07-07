<template>
    <ErrorPage
        image-url="/media/error/403.png"
        title="Forbidden"
        message="You do not have permission to access this server"
        cta-label="Return to Home"
        cta-to="/"
        background-size="400px 370px"
        background-position="calc(50% + 75px) calc(50% - 75px)"
    />
</template>

<script setup>
import ErrorPage from './ErrorPage.vue';
</script>
