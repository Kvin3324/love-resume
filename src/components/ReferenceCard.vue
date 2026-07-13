<template>
  <div class="rounded-3xl border border-slate-700 bg-slate-950/90 p-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-white">{{ entry.name }}</p>
        <p class="text-sm text-slate-400">{{ entry.relation }} • {{ entry.type }}</p>
      </div>
      <BaseButton variant="text" @click="$emit('remove')">{{ $t('references.remove') }}</BaseButton>
    </div>
    <p class="mt-3 text-slate-300">“{{ entry.quote }}”</p>
  </div>
</template>

<script setup lang="ts">
import type { ReferenceEntry } from '../types';
import BaseButton from './ui/BaseButton.vue';

defineProps<{
  entry: ReferenceEntry;
}>();

defineEmits<{ remove: [] }>();
</script>
