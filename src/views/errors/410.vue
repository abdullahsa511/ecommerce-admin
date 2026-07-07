<template>
    <ErrorPage
        image-url="/media/error/410.png"
        title="Page Not Found"
        message="It seems the page you are looking for no longer exists"
        cta-label="Return to Dashboard"
        cta-to="/"
        background-size="400px 370px"
        background-position="calc(50% + 15px) calc(50% - 140px)"
    />
</template>

<script setup>
import ErrorPage from './ErrorPage.vue';
</script>
