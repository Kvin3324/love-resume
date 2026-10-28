<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :class="[base, sizes[size], variants[variant]]"
    @click="$emit('click', $event)"
  >
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
    size?: 'sm' | 'md';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
  }>(),
  { variant: 'primary', size: 'md', type: 'button', disabled: false, loading: false }
);

defineEmits<{ click: [event: MouseEvent] }>();

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-45';

const sizes: Record<'sm' | 'md', string> = {
  sm: 'min-h-11 px-4 py-2 text-sm',
  md: 'min-h-12 px-5 py-3 text-sm'
};

const variants: Record<'primary' | 'secondary' | 'outline' | 'text' | 'danger', string> = {
  primary:
    'bg-brand-600 text-white shadow-[0_12px_28px_-18px_rgba(92,43,38,0.9)] hover:bg-brand-700 active:bg-brand-800',
  secondary:
    'border border-ink-200 bg-white/70 text-ink-800 hover:border-ink-300 hover:bg-white active:bg-ink-50',
  outline: 'border border-brand-300 text-brand-700 hover:bg-brand-50 active:bg-brand-100',
  text: 'px-2 text-brand-700 hover:bg-brand-50 hover:text-brand-800',
  danger: 'bg-brand-700 text-white hover:bg-brand-800 active:bg-ink-900'
};
</script>
