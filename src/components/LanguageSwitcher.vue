<template>
  <div class="inline-flex rounded-2xl border border-white/10 bg-white/5 p-1">
    <button
      v-for="lang in SUPPORTED_LANGUAGES"
      :key="lang"
      class="rounded-xl px-3 py-1.5 text-sm font-semibold transition"
      :class="lang === i18next.language ? 'bg-brand-500 text-white' : 'text-slate-300 hover:text-brand-200'"
      @click="i18next.changeLanguage(lang)"
    >
      {{ t(`switcher.${lang}`) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import { SUPPORTED_LANGUAGES } from '../i18n';

const { t, i18next } = useTranslation();
</script>
