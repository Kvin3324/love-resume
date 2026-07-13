<template>
  <Panel :title="$t('skills.title')" :subtitle="$t('skills.subtitle')">
    <template #actions>
      <BaseButton size="sm" @click="$emit('add')">{{ $t('skills.add') }}</BaseButton>
    </template>
    <div class="space-y-3">
      <div
        v-for="skill in skills"
        :key="skill.id"
        class="grid gap-3 rounded-3xl border border-slate-700 bg-slate-950/90 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
      >
        <span class="font-medium text-slate-100">{{ skill.name }}</span>
        <div class="flex items-center gap-3">
          <input
            v-model.number="skill.level"
            type="range"
            min="0"
            max="10"
            class="w-40 accent-brand-400"
            :aria-label="$t('skills.levelLabel', { name: skill.name })"
          />
          <span class="w-6 text-right text-sm text-slate-400">{{ skill.level }}</span>
          <button
            type="button"
            class="text-sm text-slate-400 transition hover:text-rose-300"
            @click="$emit('remove', skill.id)"
          >
            {{ $t('skills.remove') }}
          </button>
        </div>
      </div>
    </div>
    <div class="mt-6 grid gap-3 rounded-3xl border border-dashed border-slate-700 bg-slate-950/90 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <BaseInput
        v-model="draft.name"
        :placeholder="$t('skills.namePlaceholder')"
        :grid="false"
        tone="draft"
        @enter="$emit('add')"
      />
      <div class="flex items-center gap-3">
        <input
          v-model.number="draft.level"
          type="range"
          min="0"
          max="10"
          class="w-40 accent-brand-400"
          :aria-label="$t('skills.levelLabel', { name: draft.name || $t('skills.namePlaceholder') })"
        />
        <span class="w-6 text-right text-sm text-slate-400">{{ draft.level }}</span>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import type { SkillEntry } from '../types';
import Panel from './ui/Panel.vue';
import BaseButton from './ui/BaseButton.vue';
import BaseInput from './ui/BaseInput.vue';

defineProps<{
  skills: SkillEntry[];
  draft: Pick<SkillEntry, 'name' | 'level'>;
}>();

defineEmits<{
  add: [];
  remove: [id: string];
}>();
</script>
