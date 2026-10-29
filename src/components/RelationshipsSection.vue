<template>
  <Panel :title="$t('relationships.title')" :subtitle="$t('relationships.subtitle')">
    <div class="border-b border-ink-200 pb-6">
      <div>
        <h3 class="font-display text-lg text-ink-900">{{ $t('relationships.draftTitle') }}</h3>
        <p class="mt-1 text-pretty text-sm leading-relaxed text-ink-500">{{ $t('relationships.draftHint') }}</p>
      </div>
      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <BaseInput
          v-model="draft.partnerName"
          :label="$t('relationships.partnerNameLabel')"
          :placeholder="$t('relationships.partnerNamePlaceholder')"
          :grid="false"
          tone="draft"
          required
          sanitize
          :maxlength="40"
          @enter="$emit('add')"
        />
        <BaseInput
          v-model="draft.startDate"
          type="month"
          :label="$t('relationships.startDateLabel')"
          :grid="false"
          tone="draft"
        />
        <BaseInput
          v-model="draft.endDate"
          type="month"
          :label="$t('relationships.endDateLabel')"
          :grid="false"
          tone="draft"
        />
      </div>
      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <BaseInput
          v-model="draft.duration"
          :label="$t('relationships.durationLabelInput')"
          :placeholder="$t('relationships.durationPlaceholder')"
          :grid="false"
          tone="draft"
          sanitize
          :maxlength="40"
          @enter="$emit('add')"
        />
        <BaseInput
          v-model="draft.reason"
          :label="$t('relationships.reasonLabelInput')"
          :placeholder="$t('relationships.reasonPlaceholder')"
          :grid="false"
          tone="draft"
          sanitize
          :maxlength="100"
          @enter="$emit('add')"
        />
      </div>
      <div class="mt-4">
        <BaseButton :disabled="!canAdd" @click="$emit('add')">{{ $t('relationships.add') }}</BaseButton>
      </div>
    </div>

    <div v-if="relationships.length" class="mt-5 space-y-4">
      <RelationshipCard
        v-for="entry in relationships"
        :key="entry.id"
        :entry="entry"
        @remove="$emit('remove', entry.id)"
        @update="$emit('update', entry.id, $event)"
      />
    </div>
    <p v-else class="mt-5 text-sm text-ink-500">{{ $t('relationships.empty') }}</p>
  </Panel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RelationshipDraft, RelationshipEntry } from '../types';
import Panel from './ui/Panel.vue';
import BaseButton from './ui/BaseButton.vue';
import BaseInput from './ui/BaseInput.vue';
import RelationshipCard from './RelationshipCard.vue';

const props = defineProps<{
  relationships: RelationshipEntry[];
  draft: RelationshipDraft;
}>();

defineEmits<{
  add: [];
  update: [id: string, draft: RelationshipDraft];
  remove: [id: string];
}>();

const canAdd = computed(() => Boolean(props.draft.partnerName.trim()));
</script>
