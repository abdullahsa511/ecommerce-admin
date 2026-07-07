<template>
    <ErrorPage
        image-url="/media/error/500.png"
        title="Internal Server Error"
        message="Oops, something went wrong Try refreshing the page"
        cta-label="Return to Home"
        cta-to="/"
        background-size="400px 370px"
        background-position="calc(50% + 50px) calc(50% - 60px)"
    />
</template>

<script setup>
import ErrorPage from './ErrorPage.vue';
</script>
