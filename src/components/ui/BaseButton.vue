<template>
  <button :class="[base, sizes[size], variants[variant]]" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'outline' | 'text';
    size?: 'sm' | 'md';
  }>(),
  { variant: 'primary', size: 'md' }
);

defineEmits<{ click: [event: MouseEvent] }>();

const base = 'rounded-2xl text-sm font-semibold transition';

const sizes: Record<'sm' | 'md', string> = {
  sm: 'px-4 py-2',
  md: 'px-5 py-3'
};

const variants: Record<'primary' | 'outline' | 'text', string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-400',
  outline: 'border border-white/10 bg-white/5 text-slate-100 hover:border-brand-300 hover:text-brand-200',
  text: '!p-0 text-brand-300 hover:text-brand-100'
};
</script>
