<template>
  <header class="screen-only border-b border-ink-200/80 pb-8">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <a href="#" class="inline-flex min-h-11 items-center gap-2.5 font-display text-xl font-semibold text-ink-900">
        <svg viewBox="0 0 24 24" class="h-6 w-6 text-brand-600" fill="none" aria-hidden="true">
          <path
            d="M12 20.25s-7.5-4.35-7.5-10.05A4.2 4.2 0 0 1 12 7.5a4.2 4.2 0 0 1 7.5 2.7c0 5.7-7.5 10.05-7.5 10.05Z"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ $t('app.brand') }}</span>
      </a>
      <div class="flex flex-wrap items-center gap-3">
        <span
          class="hidden items-center gap-2 text-xs font-medium text-ink-600 sm:inline-flex"
          :role="saveStatus === 'error' ? 'status' : undefined"
          :aria-live="saveStatus === 'error' ? 'assertive' : 'off'"
          :aria-label="saveLabel"
        >
          <span :class="statusDotClass" class="h-1.5 w-1.5 rounded-full" aria-hidden="true"></span>
          <span>{{ saveLabel }}</span>
          <button
            v-if="saveStatus === 'error'"
            type="button"
            class="min-h-11 px-2 text-xs font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-800"
            @click="$emit('retry-save')"
          >
            {{ $t('save.retry') }}
          </button>
        </span>
        <LanguageSwitcher />
      </div>
    </div>

    <div
      class="mt-1 flex items-center gap-2 text-xs font-medium text-ink-600 sm:hidden"
      :role="saveStatus === 'error' ? 'status' : undefined"
      :aria-live="saveStatus === 'error' ? 'assertive' : 'off'"
      :aria-label="saveLabel"
    >
      <span :class="statusDotClass" class="h-1.5 w-1.5 rounded-full" aria-hidden="true"></span>
      <span>{{ saveLabel }}</span>
      <button
        v-if="saveStatus === 'error'"
        type="button"
        class="min-h-11 px-2 text-xs font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-800"
        @click="$emit('retry-save')"
      >
        {{ $t('save.retry') }}
      </button>
    </div>

    <div class="mt-6 grid gap-8 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div>
        <h1 class="max-w-[15ch] text-balance font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.04em] text-ink-900">
          {{ $t('app.title') }}
        </h1>
        <p class="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-600 sm:mt-5 sm:text-lg">
          {{ $t('app.subtitle') }}
        </p>
        <p class="mt-2 max-w-xl text-pretty text-xs leading-relaxed text-ink-600 sm:mt-3">{{ $t('app.disclaimer') }}</p>
      </div>
      <div class="flex flex-col items-start gap-2">
        <a
          href="#form-top"
          class="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-18px_rgba(92,43,38,0.9)] transition hover:bg-brand-700 active:bg-brand-800 lg:hidden"
        >
          {{ $t('app.startCta') }}
        </a>
        <div class="hidden lg:block">
          <BaseButton :disabled="!canExport" :loading="isExporting" @click="$emit('generate-pdf')">
            {{ isExporting ? $t('export.loading') : $t('app.exportCta') }}
          </BaseButton>
        </div>
        <p class="hidden max-w-[17rem] text-xs leading-relaxed text-ink-600 lg:block">
          {{ canExport ? $t('app.exportHint') : $t('export.nameRequired') }}
        </p>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseButton from './ui/BaseButton.vue';
import LanguageSwitcher from './LanguageSwitcher.vue';

const props = defineProps<{
  canExport: boolean;
  isExporting: boolean;
  saveLabel: string;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}>();

defineEmits<{
  'generate-pdf': [];
  'retry-save': [];
}>();

const statusDotClass = computed(() => {
  switch (props.saveStatus) {
    case 'saving':
      return 'bg-amber-500';
    case 'saved':
      return 'bg-emerald-600';
    case 'error':
      return 'bg-brand-700';
    default:
      return 'bg-ink-300';
  }
});
</script>
