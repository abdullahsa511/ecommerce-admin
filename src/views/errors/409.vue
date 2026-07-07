<template>
    <ErrorPage
        image-url="/media/error/409.png"
        title="Resource Conflict"
        message="It seems there was a conflict with your request"
        cta-label="Return to Dashboard"
        cta-to="/"
        background-size="400px 370px"
        background-position="calc(50% + 40px) calc(50% - 130px)"
    />
</template>

<script setup>
import ErrorPage from './ErrorPage.vue';
</script>
