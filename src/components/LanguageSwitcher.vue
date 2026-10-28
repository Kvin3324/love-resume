<template>
  <div class="inline-flex rounded-full border border-ink-200 bg-white/60 p-1" role="group" :aria-label="t('switcher.label')">
    <button
      v-for="lang in SUPPORTED_LANGUAGES"
      :key="lang"
      type="button"
      :lang="lang"
      :aria-pressed="lang === i18next.language"
      class="min-h-11 rounded-full px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] transition"
      :class="
        lang === i18next.language
          ? 'bg-ink-900 text-paper shadow-sm'
          : 'text-ink-600 hover:bg-ink-100 hover:text-ink-800'
      "
      @click="changeLanguage(lang)"
    >
      {{ t(`switcher.${lang}`) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import { SUPPORTED_LANGUAGES, persistLanguage, type SupportedLanguage } from '../i18n';

const { t, i18next } = useTranslation();

const changeLanguage = (lang: SupportedLanguage): void => {
  document.documentElement.lang = lang;
  persistLanguage(lang);
  void i18next.changeLanguage(lang);
};
</script>
