import { createApp } from 'vue';
import I18NextVue from 'i18next-vue';
import { inject } from '@vercel/analytics';
import App from './App.vue';
import { i18next } from './i18n';
import './styles.css';

/** Analytics Vercel : sans cookie, donc pas de bandeau de consentement requis. */
inject();

createApp(App).use(I18NextVue, { i18next }).mount('#app');
