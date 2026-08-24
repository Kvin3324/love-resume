<template>
  <Panel :title="$t('references.title')" :subtitle="$t('references.subtitle')">
    <template #actions>
      <BaseButton size="sm" @click="$emit('add')">{{ $t('references.add') }}</BaseButton>
    </template>
    <div class="space-y-4">
      <ReferenceCard
        v-for="refEntry in references"
        :key="refEntry.id"
        :entry="refEntry"
        :type-options="typeOptions"
        @remove="$emit('remove', refEntry.id)"
        @update="$emit('update', refEntry.id, $event)"
      />
    </div>
    <div class="mt-6 grid gap-4 rounded-3xl border border-dashed border-slate-700 bg-slate-950/90 p-5">
      <div class="grid gap-2 sm:grid-cols-2">
        <BaseInput v-model="draft.name" :placeholder="$t('references.namePlaceholder')" :grid="false" tone="draft" />
        <BaseInput v-model="draft.relation" :placeholder="$t('references.relationPlaceholder')" :grid="false" tone="draft" />
      </div>
      <div class="grid gap-2 sm:grid-cols-2">
        <BaseSelect v-model="draft.type" :options="typeOptions" tone="draft" />
        <BaseInput v-model="draft.quote" :placeholder="$t('references.quotePlaceholder')" :grid="false" tone="draft" />
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { ReferenceDraft, ReferenceEntry } from '../types';
import Panel from './ui/Panel.vue';
import BaseButton from './ui/BaseButton.vue';
import BaseInput from './ui/BaseInput.vue';
import BaseSelect, { type SelectOption } from './ui/BaseSelect.vue';
import ReferenceCard from './ReferenceCard.vue';

defineProps<{
  references: ReferenceEntry[];
  draft: ReferenceDraft;
}>();

defineEmits<{
  add: [];
  update: [id: string, draft: ReferenceDraft];
  remove: [id: string];
}>();

const { t } = useTranslation();

const typeOptions = computed<SelectOption<ReferenceEntry['type']>[]>(() => [
  { value: 'fun', label: t('references.typeFun') },
  { value: 'honest', label: t('references.typeHonest') },
  { value: 'poetic', label: t('references.typePoetic') }
]);
</script>
