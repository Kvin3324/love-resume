<template>
  <Panel :title="$t('skills.title')" :subtitle="$t('skills.subtitle')">
    <div class="border-b border-ink-200 pb-6">
      <div>
        <h3 class="font-display text-lg text-ink-900">{{ $t('skills.draftTitle') }}</h3>
        <p class="mt-1 text-sm leading-relaxed text-ink-500">{{ $t('skills.draftHint') }}</p>
      </div>
      <div class="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
        <BaseInput
          v-model="draft.name"
          :label="$t('skills.nameLabel')"
          :placeholder="$t('skills.namePlaceholder')"
          :grid="false"
          tone="draft"
          :maxlength="40"
          @enter="$emit('add')"
        />
        <div class="pt-0.5">
          <div class="flex items-center justify-between gap-3">
            <label :for="rangeId" class="shrink-0 text-sm font-semibold text-ink-700">
              {{ $t('skills.levelLabel', { name: draft.name || $t('skills.nameLabel') }) }}
            </label>
            <output class="w-10 shrink-0 text-right text-sm tabular-nums text-ink-600">
              {{ $t('skills.levelValue', { value: draft.level }) }}
            </output>
          </div>
          <input
            :id="rangeId"
            v-model.number="draft.level"
            type="range"
            min="0"
            max="10"
            class="mt-1 h-11 w-full accent-brand-600 sm:w-32"
            :aria-valuetext="$t('skills.levelValue', { value: draft.level })"
          />
        </div>
      </div>
      <div class="mt-4">
        <BaseButton :disabled="!canAdd" @click="$emit('add')">{{ $t('skills.add') }}</BaseButton>
      </div>
    </div>

    <div v-if="skills.length" class="mt-5 space-y-4">
      <div
        v-for="skill in skills"
        :key="skill.id"
        class="grid gap-3 border-t border-ink-200 pt-4 first:border-t-0 first:pt-0 sm:grid-cols-[1fr_auto] sm:items-center"
      >
        <span class="min-w-0 truncate font-semibold text-ink-800">{{ skill.name }}</span>
        <div class="flex min-w-0 flex-wrap items-center gap-3">
          <input
            v-model.number="skill.level"
            type="range"
            min="0"
            max="10"
            class="h-11 min-w-0 flex-1 accent-brand-600 sm:w-36 sm:flex-none"
            :aria-label="$t('skills.levelLabel', { name: skill.name })"
            :aria-valuetext="$t('skills.levelValue', { value: skill.level })"
          />
          <output class="w-10 shrink-0 text-right text-sm tabular-nums text-ink-500">
            {{ $t('skills.levelValue', { value: skill.level }) }}
          </output>
          <BaseButton
            variant="text"
            size="sm"
            :aria-label="`${$t('skills.remove')} ${skill.name}`"
            class="shrink-0"
            @click="$emit('remove', skill.id)"
          >
            {{ $t('skills.remove') }}
          </BaseButton>
        </div>
      </div>
    </div>
    <p v-else class="mt-5 text-sm text-ink-500">{{ $t('skills.empty') }}</p>
  </Panel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFieldId } from '../composables/useFieldId';
import type { SkillEntry } from '../types';
import Panel from './ui/Panel.vue';
import BaseButton from './ui/BaseButton.vue';
import BaseInput from './ui/BaseInput.vue';

const props = defineProps<{
  skills: SkillEntry[];
  draft: Pick<SkillEntry, 'name' | 'level'>;
}>();

defineEmits<{
  add: [];
  remove: [id: string];
}>();

const rangeId = useFieldId('skill-level');
const canAdd = computed(() => Boolean(props.draft.name.trim()));
</script>
