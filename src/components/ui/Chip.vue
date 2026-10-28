<template>
  <span :class="[classes, 'inline-flex items-center gap-1 rounded-full']">
    <slot />
    <button
      v-if="removable"
      type="button"
      class="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-current/70 transition hover:bg-ink-900/5 hover:text-ink-900"
      :aria-label="removeLabel"
      @click="$emit('remove')"
    >
      <svg viewBox="0 0 16 16" class="h-3.5 w-3.5" fill="none" aria-hidden="true">
        <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
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
    brand: 'bg-brand-100 py-1 pl-3 pr-2 text-sm text-brand-800',
    neutral: 'bg-ink-100 py-1 pl-3 pr-2 text-sm text-ink-700'
  },
  xs: {
    brand: 'bg-brand-100 px-2 py-0.5 text-xs text-brand-800',
    neutral: 'bg-ink-100 px-2 py-0.5 text-xs text-ink-700'
  }
};

const classes = computed(() => styles[props.size][props.variant]);
</script>
