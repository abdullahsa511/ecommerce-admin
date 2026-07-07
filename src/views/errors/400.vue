<template>
    <ErrorPage
        image-url="/media/error/400.png"
        title="Page Not Found"
        message="It seems the page you are looking for no longer exists"
        cta-label="Return to Dashboard"
        cta-to="/"
        background-size="340px 345px"
        background-position="calc(50% + 0px) calc(50% - 130px)"
    />
</template>

<script setup>
import ErrorPage from './ErrorPage.vue';
</script>
