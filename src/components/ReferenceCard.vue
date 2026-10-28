<template>
  <div class="border-t border-ink-200 pt-5 first:border-t-0 first:pt-0">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0">
        <h3 class="font-display text-xl leading-tight text-ink-900">{{ entry.name }}</h3>
        <p class="mt-1 text-sm text-ink-500">
          <template v-if="entry.relation">{{ entry.relation }} · </template>{{ typeLabel }}
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-1">
        <template v-if="isEditing">
          <BaseButton
            variant="text"
            size="sm"
            :aria-label="`${$t('common.save')} ${entry.name}`"
            @click="save"
          >
            {{ $t('common.save') }}
          </BaseButton>
          <BaseButton
            variant="text"
            size="sm"
            :aria-label="`${$t('common.cancel')} ${entry.name}`"
            @click="cancel"
          >
            {{ $t('common.cancel') }}
          </BaseButton>
        </template>
        <template v-else>
          <BaseButton
            variant="text"
            size="sm"
            :aria-label="`${$t('common.edit')} ${entry.name}`"
            @click="startEditing"
          >
            {{ $t('common.edit') }}
          </BaseButton>
          <BaseButton
            variant="text"
            size="sm"
            :aria-label="`${$t('references.remove')} ${entry.name}`"
            @click="$emit('remove')"
          >
            {{ $t('references.remove') }}
          </BaseButton>
        </template>
      </div>
    </div>

    <blockquote v-if="!isEditing" class="mt-3 border-l border-brand-300 pl-4 text-ink-700">
      <p class="font-display text-lg leading-relaxed">“{{ entry.quote }}”</p>
    </blockquote>

    <div v-else class="mt-4 grid gap-3">
      <div class="grid gap-3 sm:grid-cols-2">
        <BaseInput
          v-model="draft.name"
          :label="$t('references.nameLabel')"
          :placeholder="$t('references.namePlaceholder')"
          :grid="false"
          tone="draft"
          required
          :maxlength="40"
          @enter="save"
        />
        <BaseInput
          v-model="draft.relation"
          :label="$t('references.relationLabel')"
          :placeholder="$t('references.relationPlaceholder')"
          :grid="false"
          tone="draft"
          :maxlength="60"
          @enter="save"
        />
      </div>
      <div class="grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-start">
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
          @enter="save"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { ReferenceDraft, ReferenceEntry } from '../types';
import BaseButton from './ui/BaseButton.vue';
import BaseInput from './ui/BaseInput.vue';
import BaseSelect, { type SelectOption } from './ui/BaseSelect.vue';

const props = defineProps<{
  entry: ReferenceEntry;
  typeOptions: SelectOption<ReferenceEntry['type']>[];
}>();

const emit = defineEmits<{
  remove: [];
  update: [draft: ReferenceDraft];
}>();

const isEditing = ref(false);

const typeLabel = computed<string>(
  () => props.typeOptions.find((option) => option.value === props.entry.type)?.label ?? props.entry.type
);

const draft = reactive<ReferenceDraft>({
  name: '',
  relation: '',
  quote: '',
  type: 'fun'
});

const startEditing = (): void => {
  draft.name = props.entry.name;
  draft.relation = props.entry.relation;
  draft.quote = props.entry.quote;
  draft.type = props.entry.type;
  isEditing.value = true;
};

const save = (): void => {
  if (!draft.name.trim() || !draft.quote.trim()) return;
  emit('update', { ...draft });
  isEditing.value = false;
};

const cancel = (): void => {
  isEditing.value = false;
};
</script>
