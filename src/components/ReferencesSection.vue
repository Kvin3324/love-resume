<template>
  <Panel :title="$t('references.title')" :subtitle="$t('references.subtitle')">
    <div class="border-b border-ink-200 pb-6">
      <div>
        <h3 class="font-display text-lg text-ink-900">{{ $t('references.draftTitle') }}</h3>
        <p class="mt-1 text-pretty text-sm leading-relaxed text-ink-500">{{ $t('references.draftHint') }}</p>
      </div>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <BaseInput
          v-model="draft.name"
          :label="$t('references.nameLabel')"
          :placeholder="$t('references.namePlaceholder')"
          :grid="false"
          tone="draft"
          required
          sanitize
          :maxlength="40"
          @enter="$emit('add')"
        />
        <BaseInput
          v-model="draft.relation"
          :label="$t('references.relationLabel')"
          :placeholder="$t('references.relationPlaceholder')"
          :grid="false"
          tone="draft"
          sanitize
          :maxlength="60"
          @enter="$emit('add')"
        />
      </div>
      <div class="mt-3 grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-start">
        <BaseSelect
          v-model="draft.type"
          class="w-40 max-w-full"
          :label="$t('references.typeLabel')"
          :options="typeOptions"
          :grid="false"
          tone="draft"
        />
        <BaseInput
          v-model="draft.quote"
          :label="$t('references.quoteLabel')"
          :placeholder="$t('references.quotePlaceholder')"
          :hint="$t('references.quoteHint')"
          :grid="false"
          tone="draft"
          sanitize
          :maxlength="180"
          @enter="$emit('add')"
        />
      </div>
      <div class="mt-4">
        <BaseButton :disabled="!canAdd" @click="$emit('add')">{{ $t('references.add') }}</BaseButton>
      </div>
    </div>

    <div v-if="references.length" class="mt-5 space-y-4">
      <ReferenceCard
        v-for="refEntry in references"
        :key="refEntry.id"
        :entry="refEntry"
        :type-options="typeOptions"
        @remove="$emit('remove', refEntry.id)"
        @update="$emit('update', refEntry.id, $event)"
      />
    </div>
    <p v-else class="mt-5 text-sm text-ink-500">{{ $t('references.empty') }}</p>
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

const props = defineProps<{
  references: ReferenceEntry[];
  draft: ReferenceDraft;
}>();

defineEmits<{
  add: [];
  update: [id: string, draft: ReferenceDraft];
  remove: [id: string];
}>();

const { t } = useTranslation();

const canAdd = computed(() => Boolean(props.draft.name.trim() && props.draft.quote.trim()));

const typeOptions = computed<SelectOption<ReferenceEntry['type']>[]>(() => [
  { value: 'fun', label: t('references.typeFun') },
  { value: 'honest', label: t('references.typeHonest') },
  { value: 'poetic', label: t('references.typePoetic') }
]);
</script>
