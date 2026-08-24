<template>
  <span :class="cn(badgeVariants({ variant }), props.class)">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { badgeVariants, type BadgeVariants } from '.';

const props = defineProps<{
  variant?: BadgeVariants['variant'];
  class?: HTMLAttributes['class'];
}>();

const variant = computed(() => props.variant);
</script>
