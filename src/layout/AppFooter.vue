<script setup>
import { useLayout } from '@/layout/composables/layout';

const { isDarkTheme } = useLayout();
</script>

<template>
    <div class="layout-footer">
        <div class="footer-logo-container">
            <img :src="`/layout/images/logo-${isDarkTheme ? 'white' : 'dark'}.png`" alt="krost-ecommerce" />
        </div>
        <span class="footer-copyright">&#169; KROST Business Furniture - 2025</span>
    </div>
</template>
