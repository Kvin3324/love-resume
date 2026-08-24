<template>
  <Panel :title="$t('relationships.title')" :subtitle="$t('relationships.subtitle')">
    <template #actions>
      <BaseButton size="sm" @click="$emit('add')">{{ $t('relationships.add') }}</BaseButton>
    </template>
    <div class="space-y-4">
      <RelationshipCard
        v-for="entry in relationships"
        :key="entry.id"
        :entry="entry"
        @remove="$emit('remove', entry.id)"
        @update="$emit('update', entry.id, $event)"
      />
    </div>
    <div class="mt-6 grid gap-4 rounded-3xl border border-dashed border-slate-700 bg-slate-950/90 p-5">
      <div class="grid gap-2 sm:grid-cols-3">
        <BaseInput v-model="draft.partnerName" :placeholder="$t('relationships.partnerNamePlaceholder')" :grid="false" tone="draft" />
        <BaseInput v-model="draft.startDate" type="month" :grid="false" tone="draft" />
        <BaseInput v-model="draft.endDate" type="month" :grid="false" tone="draft" />
      </div>
      <div class="grid gap-2 sm:grid-cols-2">
        <BaseInput v-model="draft.duration" :placeholder="$t('relationships.durationPlaceholder')" :grid="false" tone="draft" />
        <BaseInput v-model="draft.reason" :placeholder="$t('relationships.reasonPlaceholder')" :grid="false" tone="draft" />
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import type { RelationshipDraft, RelationshipEntry } from '../types';
import Panel from './ui/Panel.vue';
import BaseButton from './ui/BaseButton.vue';
import BaseInput from './ui/BaseInput.vue';
import RelationshipCard from './RelationshipCard.vue';

defineProps<{
  relationships: RelationshipEntry[];
  draft: RelationshipDraft;
}>();

defineEmits<{
  add: [];
  update: [id: string, draft: RelationshipDraft];
  remove: [id: string];
}>();
</script>
