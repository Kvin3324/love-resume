<template>
  <Panel :title="$t('traits.title')" :subtitle="$t('traits.subtitle')">
    <template #actions>
      <BaseButton size="sm" @click="$emit('reset')">{{ $t('traits.reset') }}</BaseButton>
    </template>
    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <h3 class="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">{{ $t('traits.personality') }}</h3>
        <div class="grid gap-3">
          <div class="flex flex-wrap gap-2">
            <Chip
              v-for="trait in form.personalityTraits"
              :key="trait"
              variant="brand"
              removable
              :remove-label="$t('traits.remove', { value: trait })"
              @remove="$emit('remove-trait', trait)"
            >
              {{ trait }}
            </Chip>
          </div>
          <BaseInput v-model="newTrait" :placeholder="$t('traits.addTraitPlaceholder')" :grid="false" @enter="$emit('add-trait')" />
        </div>
      </div>
      <div>
        <h3 class="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">{{ $t('traits.values') }}</h3>
        <div class="grid gap-3">
          <div class="flex flex-wrap gap-2">
            <Chip
              v-for="value in form.values"
              :key="value"
              variant="neutral"
              removable
              :remove-label="$t('traits.remove', { value })"
              @remove="$emit('remove-value', value)"
            >
              {{ value }}
            </Chip>
          </div>
          <BaseInput v-model="newValue" :placeholder="$t('traits.addValuePlaceholder')" :grid="false" @enter="$emit('add-value')" />
        </div>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import type { LoveResumeForm } from '../types';
import Panel from './ui/Panel.vue';
import BaseButton from './ui/BaseButton.vue';
import BaseInput from './ui/BaseInput.vue';
import Chip from './ui/Chip.vue';

defineProps<{
  form: LoveResumeForm;
}>();

defineEmits<{
  reset: [];
  'add-trait': [];
  'add-value': [];
  'remove-trait': [trait: string];
  'remove-value': [value: string];
}>();

const newTrait = defineModel<string>('newTrait', { default: '' });
const newValue = defineModel<string>('newValue', { default: '' });
</script>
