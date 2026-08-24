<template>
  <div class="rounded-3xl border border-slate-700 bg-slate-950/90 p-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-white">{{ entry.name }}</p>
        <p class="text-sm text-slate-400">{{ entry.relation }} • {{ typeLabel }}</p>
      </div>
      <div class="flex items-center gap-4">
        <template v-if="isEditing">
          <BaseButton variant="text" @click="save">{{ $t('common.save') }}</BaseButton>
          <BaseButton variant="text" @click="cancel">{{ $t('common.cancel') }}</BaseButton>
        </template>
        <template v-else>
          <BaseButton variant="text" @click="startEditing">{{ $t('common.edit') }}</BaseButton>
          <BaseButton variant="text" @click="$emit('remove')">{{ $t('references.remove') }}</BaseButton>
        </template>
      </div>
    </div>

    <p v-if="!isEditing" class="mt-3 text-slate-300">“{{ entry.quote }}”</p>

    <div v-else class="mt-3 grid gap-2">
      <div class="grid gap-2 sm:grid-cols-2">
        <BaseInput
          v-model="draft.name"
          :placeholder="$t('references.namePlaceholder')"
          :grid="false"
          tone="draft"
          @enter="save"
        />
        <BaseInput
          v-model="draft.relation"
          :placeholder="$t('references.relationPlaceholder')"
          :grid="false"
          tone="draft"
          @enter="save"
        />
      </div>
      <div class="grid gap-2 sm:grid-cols-2">
        <BaseSelect v-model="draft.type" :options="typeOptions" tone="draft" />
        <BaseInput
          v-model="draft.quote"
          :placeholder="$t('references.quotePlaceholder')"
          :grid="false"
          tone="draft"
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
  if (!draft.name.trim() || !draft.quote.trim()) {
    return;
  }

  emit('update', { ...draft });
  isEditing.value = false;
};

const cancel = (): void => {
  isEditing.value = false;
};
</script>
