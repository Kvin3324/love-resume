<template>
  <header class="rounded-3xl bg-slate-900/80 p-8 shadow-glow ring-1 ring-white/10 backdrop-blur-xl">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div class="flex items-center gap-3">
          <p class="text-brand-300 uppercase tracking-[0.35em] text-sm">{{ $t('app.brand') }}</p>
          <LanguageSwitcher />
        </div>
        <h1 class="mt-3 text-4xl font-semibold text-white">{{ $t('app.title') }}</h1>
        <p class="mt-3 max-w-2xl text-slate-300 sm:text-lg">{{ $t('app.subtitle') }}</p>
        <p class="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <span aria-hidden="true">✦</span>{{ $t('app.disclaimer') }}
        </p>
      </div>
      <div>
        <BaseButton variant="primary" @click="$emit('generate-pdf')">{{ $t('app.exportCta') }}</BaseButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import BaseButton from './ui/BaseButton.vue';
import LanguageSwitcher from './LanguageSwitcher.vue';

defineEmits<{
  'generate-pdf': [];
}>();
</script>
