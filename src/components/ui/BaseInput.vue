<template>
  <div class="grid gap-2" :class="grid ? 'sm:grid-cols-2' : ''">
    <label v-if="label" class="text-sm font-medium text-slate-200">{{ label }}</label>
    <input
      v-model="rawModel"
      :type="type"
      :placeholder="placeholder"
      class="rounded-2xl border border-slate-700 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
      :class="tone === 'draft' ? 'bg-slate-950' : 'bg-slate-950/90'"
      @input="scheduleSanitize"
      @blur="sanitizeNow"
      @keyup.enter="$emit('enter', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { useProfanitySanitizer } from '../../composables/useProfanitySanitizer';

withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    type?: string;
    grid?: boolean;
    tone?: 'default' | 'draft';
  }>(),
  { type: 'text', grid: true, tone: 'default' }
);

defineEmits<{ enter: [event: KeyboardEvent] }>();

const rawModel = defineModel<string>({ default: '' });

const { scheduleSanitize, sanitizeNow } = useProfanitySanitizer(rawModel);
</script>
