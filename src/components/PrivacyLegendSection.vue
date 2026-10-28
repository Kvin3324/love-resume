<template>
  <Panel id="confidentialite" :title="$t('privacyLegend.title')" :subtitle="$t('privacyLegend.subtitle')">
    <div class="divide-y divide-ink-200">
      <div
        v-for="item in legend"
        :key="item.value"
        class="py-3.5 transition first:pt-0 last:pb-0"
        :class="item.value === currentPrivacy ? '-mx-2 bg-brand-50/70 px-2' : ''"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-semibold text-ink-900">{{ item.label }}</p>
            <p class="mt-1 text-pretty text-sm leading-relaxed text-ink-600">{{ item.description }}</p>
          </div>
          <span
            class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
            :class="item.value === currentPrivacy ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600'"
          >
            {{ item.value === currentPrivacy ? $t('privacyLegend.active') : item.status }}
          </span>
        </div>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { PrivacyLevel } from '../types';
import Panel from './ui/Panel.vue';

defineProps<{
  currentPrivacy: PrivacyLevel;
}>();

const { t } = useTranslation();

const legend = computed<
  { value: PrivacyLevel; label: string; description: string; status: string }[]
>(() => [
  {
    value: 'public',
    label: t('privacy.public'),
    description: t('privacyLegend.publicDescription'),
    status: t('privacyLegend.publicStatus')
  },
  {
    value: 'semi-private',
    label: t('privacy.semiPrivate'),
    description: t('privacyLegend.semiPrivateDescription'),
    status: t('privacyLegend.semiPrivateStatus')
  },
  {
    value: 'private',
    label: t('privacy.private'),
    description: t('privacyLegend.privateDescription'),
    status: t('privacyLegend.privateStatus')
  }
]);
</script>
