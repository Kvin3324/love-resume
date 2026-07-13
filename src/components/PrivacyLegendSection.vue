<template>
  <Panel :title="$t('privacyLegend.title')" :subtitle="$t('privacyLegend.subtitle')">
    <div class="flex flex-col gap-4 rounded-3xl border border-dashed border-slate-700 bg-slate-950/90 p-5">
      <div
        v-for="item in legend"
        :key="item.label"
        class="flex items-center justify-between gap-3 rounded-2xl bg-slate-900/80 px-4 py-3"
      >
        <span class="text-sm text-slate-300">{{ item.label }}</span>
        <Chip :variant="item.variant">{{ item.status }}</Chip>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import Panel from './ui/Panel.vue';
import Chip from './ui/Chip.vue';

const { t } = useTranslation();

const legend = computed<{ label: string; status: string; variant: 'brand' | 'neutral' }[]>(() => [
  { label: t('privacy.public'), status: t('privacyLegend.publicStatus'), variant: 'brand' },
  { label: t('privacy.semiPrivate'), status: t('privacyLegend.semiPrivateStatus'), variant: 'neutral' },
  { label: t('privacy.linkOnly'), status: t('privacyLegend.linkOnlyStatus'), variant: 'brand' }
]);
</script>
