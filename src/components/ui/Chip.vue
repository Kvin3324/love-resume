<template>
  <span :class="[classes, 'inline-flex items-center gap-1.5']">
    <slot />
    <button
      v-if="removable"
      type="button"
      class="rounded-full leading-none text-current/70 transition hover:text-white"
      :aria-label="removeLabel"
      @click="$emit('remove')"
    >
      &times;
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'brand' | 'neutral';
    size?: 'sm' | 'xs';
    removable?: boolean;
    removeLabel?: string;
  }>(),
  { variant: 'brand', size: 'sm', removable: false, removeLabel: 'Remove' }
);

defineEmits<{ remove: [] }>();

const styles = {
  sm: {
    brand: 'rounded-full bg-brand-500/15 px-3 py-1 text-sm text-brand-100',
    neutral: 'rounded-full bg-slate-800/80 px-3 py-1 text-sm text-slate-200'
  },
  xs: {
    brand: 'rounded-full bg-brand-500/20 px-1.5 py-0.5 text-xs text-brand-100',
    neutral: 'rounded-full bg-slate-700/50 px-1.5 py-0.5 text-xs text-slate-100'
  }
};

const classes = computed(() => styles[props.size][props.variant]);
</script>
