import { createApp } from 'vue';
import I18NextVue from 'i18next-vue';
import App from './App.vue';
import { i18next } from './i18n';
import './styles.css';

createApp(App).use(I18NextVue, { i18next }).mount('#app');
