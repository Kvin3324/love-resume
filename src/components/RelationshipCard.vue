<template>
  <div class="rounded-3xl border border-slate-700 bg-slate-950/90 p-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.22em] text-slate-400">{{ entry.partnerName || $t('relationships.exPartner') }}</p>
        <h3 class="text-lg font-semibold text-white">{{ entry.partnerName }}</h3>
      </div>
      <BaseButton variant="text" @click="$emit('remove')">{{ $t('relationships.remove') }}</BaseButton>
    </div>
    <div class="grid gap-3 sm:grid-cols-3">
      <span class="rounded-2xl bg-white/5 px-3 py-2 text-sm text-slate-300">{{ entry.startDate }} → {{ entry.endDate }}</span>
      <span class="rounded-2xl bg-white/5 px-3 py-2 text-sm text-slate-300">{{ $t('relationships.durationLabel', { value: entry.duration }) }}</span>
      <span class="rounded-2xl bg-white/5 px-3 py-2 text-sm text-slate-300">{{ $t('relationships.reasonLabel', { value: entry.reason }) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RelationshipEntry } from '../types';
import BaseButton from './ui/BaseButton.vue';

defineProps<{
  entry: RelationshipEntry;
}>();

defineEmits<{ remove: [] }>();
</script>
