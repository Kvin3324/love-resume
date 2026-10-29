<template>
  <Panel :title="$t('traits.title')" :subtitle="$t('traits.subtitle')">
    <template #actions>
      <BaseButton
        variant="secondary"
        size="sm"
        :disabled="!form.personalityTraits.length && !form.values.length"
        @click="$emit('reset')"
      >
        {{ $t('traits.reset') }}
      </BaseButton>
    </template>
    <div class="grid gap-6 sm:grid-cols-2">
      <div>
        <h3 class="font-display text-lg text-ink-900">{{ $t('traits.personality') }}</h3>
        <div class="mt-3 flex min-h-8 flex-wrap gap-2">
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
          <span v-if="!form.personalityTraits.length" class="text-sm text-ink-500">
            {{ $t('traits.emptyPersonality') }}
          </span>
        </div>
        <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div class="min-w-0 flex-1">
            <BaseInput
              v-model="newTrait"
              :label="$t('traits.addTraitLabel')"
              :placeholder="$t('traits.addTraitPlaceholder')"
              :grid="false"
              tone="draft"
              sanitize
              :maxlength="30"
              @enter="$emit('add-trait')"
            />
          </div>
          <BaseButton size="sm" :disabled="!canAddTrait" @click="$emit('add-trait')">
            {{ $t('traits.addTraitButton') }}
          </BaseButton>
        </div>
      </div>
      <div>
        <h3 class="font-display text-lg text-ink-900">{{ $t('traits.values') }}</h3>
        <div class="mt-3 flex min-h-8 flex-wrap gap-2">
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
          <span v-if="!form.values.length" class="text-sm text-ink-500">
            {{ $t('traits.emptyValues') }}
          </span>
        </div>
        <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div class="min-w-0 flex-1">
            <BaseInput
              v-model="newValue"
              :label="$t('traits.addValueLabel')"
              :placeholder="$t('traits.addValuePlaceholder')"
              :grid="false"
              tone="draft"
              sanitize
              :maxlength="30"
              @enter="$emit('add-value')"
            />
          </div>
          <BaseButton size="sm" :disabled="!canAddValue" @click="$emit('add-value')">
            {{ $t('traits.addValueButton') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { LoveResumeForm } from '../types';
import Panel from './ui/Panel.vue';
import BaseButton from './ui/BaseButton.vue';
import BaseInput from './ui/BaseInput.vue';
import Chip from './ui/Chip.vue';

const props = defineProps<{
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

const canAddTrait = computed(() => {
  const value = newTrait.value.trim();
  return Boolean(value) && !props.form.personalityTraits.includes(value);
});

const canAddValue = computed(() => {
  const value = newValue.value.trim();
  return Boolean(value) && !props.form.values.includes(value);
});
</script>
