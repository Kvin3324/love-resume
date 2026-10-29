import { computed, nextTick, onScopeDispose, reactive, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import { pageview } from '@vercel/analytics';
import { i18next } from '../i18n';
import { censorText } from '../utils/profanityFilter';
import { confirmAction } from './useConfirm';
import type {
  LoveResumeForm,
  PrivacyLevel,
  ReferenceDraft,
  RelationshipDraft,
  SkillEntry
} from '../types';

const STORAGE_KEY = 'loveresume:draft:v1';
const STORAGE_VERSION = 2;
const PDF_BACKGROUND = '#ffffff';
const SAVE_DELAY = 500;
const TOAST_DURATION = 3200;
const TOAST_ACTION_DURATION = 6000;
const EXAMPLE_LEVELS = [9, 8, 8, 8, 7];

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface ToastAction {
  label: string;
  run: () => void;
}

interface ExampleSnapshot {
  form: LoveResumeForm;
  relationshipId: string;
  referenceId: string;
  skillIds: string[];
}

const randomId = (): string =>
  globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);

const emptyForm = (): LoveResumeForm => ({
  fullName: '',
  role: '',
  bio: '',
  personalityTraits: [],
  values: [],
  privacy: 'semi-private',
  relationships: [],
  references: [],
  coupleSkills: []
});

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');
const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const LEGACY_DEFAULTS = {
  duration: new Set(['Durée non précisée', 'Duration not specified']),
  reason: new Set(['Motif non précisé', 'Reason not specified']),
  relation: new Set(['Un proche', 'A close one'])
};

const withoutLegacyDefault = (value: string, defaults: Set<string>): string =>
  defaults.has(value) ? '' : value;

const normalizePrivacy = (value: unknown): PrivacyLevel => {
  if (value === 'public' || value === 'semi-private' || value === 'private') return value;
  if (value === 'link-only') return 'private';
  return 'semi-private';
};

const normalizeLevel = (value: unknown): number => {
  const level = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(level)) return 5;
  return Math.min(10, Math.max(0, Math.round(level)));
};

const normalizeForm = (raw: unknown, stripLegacyDefaults = false): LoveResumeForm => {
  const source = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const relationships = Array.isArray(source.relationships) ? source.relationships : [];
  const references = Array.isArray(source.references) ? source.references : [];
  const skills = Array.isArray(source.coupleSkills) ? source.coupleSkills : [];

  return {
    fullName: asString(source.fullName),
    role: asString(source.role),
    bio: asString(source.bio),
    personalityTraits: asStringArray(source.personalityTraits),
    values: asStringArray(source.values),
    privacy: normalizePrivacy(source.privacy),
    relationships: relationships
      .map((entry) => {
        const item = (entry && typeof entry === 'object' ? entry : {}) as Record<string, unknown>;
        return {
          id: asString(item.id) || randomId(),
          partnerName: asString(item.partnerName),
          startDate: asString(item.startDate),
          endDate: asString(item.endDate),
          duration: stripLegacyDefaults
            ? withoutLegacyDefault(asString(item.duration), LEGACY_DEFAULTS.duration)
            : asString(item.duration),
          reason: stripLegacyDefaults
            ? withoutLegacyDefault(asString(item.reason), LEGACY_DEFAULTS.reason)
            : asString(item.reason)
        };
      })
      .filter((entry) => entry.partnerName),
    references: references
      .map((entry) => {
        const item = (entry && typeof entry === 'object' ? entry : {}) as Record<string, unknown>;
        const rawType = item.type;
        const type: 'fun' | 'honest' | 'poetic' =
          rawType === 'honest' || rawType === 'poetic' ? rawType : 'fun';
        return {
          id: asString(item.id) || randomId(),
          name: asString(item.name),
          relation: stripLegacyDefaults
            ? withoutLegacyDefault(asString(item.relation), LEGACY_DEFAULTS.relation)
            : asString(item.relation),
          quote: asString(item.quote),
          type
        };
      })
      .filter((entry) => entry.name && entry.quote),
    coupleSkills: skills
      .map((entry) => {
        const item = (entry && typeof entry === 'object' ? entry : {}) as Record<string, unknown>;
        return {
          id: asString(item.id) || randomId(),
          name: asString(item.name),
          level: normalizeLevel(item.level)
        };
      })
      .filter((entry) => entry.name)
  };
};

const censorForm = (form: LoveResumeForm): LoveResumeForm => ({
  ...form,
  fullName: censorText(form.fullName),
  role: censorText(form.role),
  bio: censorText(form.bio),
  personalityTraits: form.personalityTraits.map(censorText),
  values: form.values.map(censorText),
  relationships: form.relationships.map((entry) => ({
    ...entry,
    partnerName: censorText(entry.partnerName),
    duration: censorText(entry.duration),
    reason: censorText(entry.reason)
  })),
  references: form.references.map((entry) => ({
    ...entry,
    name: censorText(entry.name),
    relation: censorText(entry.relation),
    quote: censorText(entry.quote)
  })),
  coupleSkills: form.coupleSkills.map((entry) => ({
    ...entry,
    name: censorText(entry.name)
  }))
});

const hasMeaningfulContent = (form: LoveResumeForm): boolean =>
  Boolean(
    form.fullName.trim() ||
      form.role.trim() ||
      form.bio.trim() ||
      form.personalityTraits.length ||
      form.values.length ||
      form.relationships.length ||
      form.references.length ||
      form.coupleSkills.length
  );

const loadStoredDraft = (): { form: LoveResumeForm; isExample: boolean } | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { version?: unknown; form?: unknown; isExample?: unknown };
    const version = typeof parsed.version === 'number' ? parsed.version : 1;
    return {
      form: censorForm(normalizeForm(parsed.form, version < STORAGE_VERSION)),
      isExample: Boolean(parsed.isExample)
    };
  } catch {
    return null;
  }
};

const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const arraysEqual = (a: string[], b: string[]): boolean =>
  a.length === b.length && a.every((item, index) => item === b[index]);

const padCanvasToFullPages = (canvas: HTMLCanvasElement, pageRatio: number): HTMLCanvasElement => {
  const pageHeight = Math.floor(canvas.width * pageRatio);
  const fullHeight = Math.max(1, Math.ceil(canvas.height / pageHeight)) * pageHeight;
  if (fullHeight === canvas.height) return canvas;

  const padded = document.createElement('canvas');
  padded.width = canvas.width;
  padded.height = fullHeight;

  const context = padded.getContext('2d');
  if (!context) return canvas;

  context.fillStyle = PDF_BACKGROUND;
  context.fillRect(0, 0, padded.width, padded.height);
  context.drawImage(canvas, 0, 0);

  return padded;
};

export function useLoveResumeForm() {
  const { t } = useTranslation();

  const createExample = (ids?: {
    relationshipId?: string;
    referenceId?: string;
    skillIds?: string[];
  }): ExampleSnapshot => {
    const traits = t('example.traits', { returnObjects: true }) as unknown as string[];
    const values = t('example.values', { returnObjects: true }) as unknown as string[];
    const skills = t('example.skills', { returnObjects: true }) as unknown as string[];
    const relationshipId = ids?.relationshipId ?? randomId();
    const referenceId = ids?.referenceId ?? randomId();
    const skillIds = skills.map((_, index) => ids?.skillIds?.[index] ?? randomId());

    return {
      relationshipId,
      referenceId,
      skillIds,
      form: {
        fullName: t('example.fullName'),
        role: t('example.role'),
        bio: t('example.bio'),
        personalityTraits: [...traits],
        values: [...values],
        privacy: 'semi-private',
        relationships: [
          {
            id: relationshipId,
            partnerName: t('example.relationship.partnerName'),
            startDate: '2022-02',
            endDate: '2023-06',
            duration: t('example.relationship.duration'),
            reason: t('example.relationship.reason')
          }
        ],
        references: [
          {
            id: referenceId,
            name: t('example.reference.name'),
            relation: t('example.reference.relation'),
            quote: t('example.reference.quote'),
            type: 'fun'
          }
        ],
        coupleSkills: skills.map((name, index) => ({
          id: skillIds[index],
          name,
          level: EXAMPLE_LEVELS[index] ?? 7
        }))
      }
    };
  };

  const stored = loadStoredDraft();
  const form = reactive<LoveResumeForm>(stored?.form ?? emptyForm());
  const isExample = ref(stored?.isExample ?? false);
  let example: ExampleSnapshot;

  if (isExample.value) {
    example = {
      form: clone(form),
      relationshipId: form.relationships[0]?.id ?? randomId(),
      referenceId: form.references[0]?.id ?? randomId(),
      skillIds: form.coupleSkills.map((skill) => skill.id)
    };
  } else {
    example = createExample();
  }

  const newTrait = ref('');
  const newValue = ref('');
  const saveStatus = ref<SaveStatus>(stored ? 'saved' : 'idle');
  const isExporting = ref(false);
  const toastMessage = ref('');
  const toastAction = ref<ToastAction | null>(null);
  const toastActionLabel = computed<string>(() => toastAction.value?.label ?? '');
  let saveTimer: ReturnType<typeof setTimeout> | undefined;
  let toastTimer: ReturnType<typeof setTimeout> | undefined;

  const relationshipDraft = reactive<RelationshipDraft>({
    partnerName: '',
    startDate: '',
    endDate: '',
    duration: '',
    reason: ''
  });

  const referenceDraft = reactive<ReferenceDraft>({
    name: '',
    relation: '',
    quote: '',
    type: 'fun'
  });

  const skillDraft = reactive<Pick<SkillEntry, 'name' | 'level'>>({
    name: '',
    level: 5
  });

  const clearToast = (): void => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = undefined;
    }
    toastMessage.value = '';
    toastAction.value = null;
  };

  const notify = (message: string, action?: ToastAction): void => {
    toastMessage.value = message;
    toastAction.value = action ?? null;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      clearToast();
    }, action ? TOAST_ACTION_DURATION : TOAST_DURATION);
  };

  const notifyUndo = (message: string, undo: () => void): void => {
    notify(message, {
      label: t('common.undo'),
      run: () => {
        undo();
        notify(t('toast.undoDone'));
      }
    });
  };

  const runToastAction = (): void => {
    const action = toastAction.value;
    if (!action) return;
    clearToast();
    action.run();
  };

  const persist = (): void => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: STORAGE_VERSION,
          form,
          isExample: isExample.value,
          savedAt: new Date().toISOString()
        })
      );
      saveStatus.value = 'saved';
    } catch {
      saveStatus.value = 'error';
    }
  };

  const schedulePersist = (): void => {
    if (typeof window === 'undefined') return;

    saveStatus.value = 'saving';
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = undefined;
      persist();
    }, SAVE_DELAY);
  };

  const retranslateExample = (): void => {
    if (!isExample.value) return;

    const previous = example.form;
    const next = createExample({
      relationshipId: example.relationshipId,
      referenceId: example.referenceId,
      skillIds: example.skillIds
    });

    if (form.fullName === previous.fullName) form.fullName = next.form.fullName;
    if (form.role === previous.role) form.role = next.form.role;
    if (form.bio === previous.bio) form.bio = next.form.bio;
    if (arraysEqual(form.personalityTraits, previous.personalityTraits)) {
      form.personalityTraits = [...next.form.personalityTraits];
    }
    if (arraysEqual(form.values, previous.values)) {
      form.values = [...next.form.values];
    }

    const relationship = form.relationships.find((entry) => entry.id === example.relationshipId);
    const previousRelationship = previous.relationships[0];
    if (
      relationship &&
      previousRelationship &&
      relationship.partnerName === previousRelationship.partnerName &&
      relationship.duration === previousRelationship.duration &&
      relationship.reason === previousRelationship.reason
    ) {
      relationship.partnerName = next.form.relationships[0].partnerName;
      relationship.duration = next.form.relationships[0].duration;
      relationship.reason = next.form.relationships[0].reason;
    }

    const reference = form.references.find((entry) => entry.id === example.referenceId);
    const previousReference = previous.references[0];
    if (
      reference &&
      previousReference &&
      reference.name === previousReference.name &&
      reference.relation === previousReference.relation &&
      reference.quote === previousReference.quote
    ) {
      reference.name = next.form.references[0].name;
      reference.relation = next.form.references[0].relation;
      reference.quote = next.form.references[0].quote;
    }

    example.skillIds.forEach((id, index) => {
      const skill = form.coupleSkills.find((entry) => entry.id === id);
      if (skill && skill.name === previous.coupleSkills[index]?.name) {
        skill.name = next.form.coupleSkills[index].name;
      }
    });

    example = next;
  };

  i18next.on('languageChanged', retranslateExample);

  const formMatchesExample = (): boolean =>
    JSON.stringify(form) === JSON.stringify(example.form);

  const isDirty = ref(false);
  watch(
    form,
    () => {
      if (isExample.value && !formMatchesExample()) {
        isExample.value = false;
      }
      isDirty.value = true;
      schedulePersist();
    },
    { deep: true }
  );
  watch(isExample, () => {
    isDirty.value = true;
    schedulePersist();
  });

  const beforeUnload = (event: BeforeUnloadEvent): void => {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = undefined;
      persist();
    }

    if (saveStatus.value === 'error' && isDirty.value) {
      event.preventDefault();
      event.returnValue = '';
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', beforeUnload);
  }

  onScopeDispose(() => {
    i18next.off('languageChanged', retranslateExample);
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', beforeUnload);
    }
    if (saveTimer) persist();
    if (toastTimer) clearTimeout(toastTimer);
  });

  const hasContent = computed<boolean>(() => hasMeaningfulContent(form));
  const isFirstRun = computed<boolean>(() => !hasContent.value && !isExample.value);
  const canExport = computed<boolean>(() => Boolean(form.fullName.trim()));
  const privacyLabel = computed<string>(() => {
    switch (form.privacy) {
      case 'public':
        return t('privacy.public');
      case 'semi-private':
        return t('privacy.semiPrivate');
      case 'private':
        return t('privacy.private');
      default:
        return t('privacy.unknown');
    }
  });

  const privacyNotice = computed<string>(() => {
    switch (form.privacy) {
      case 'public':
        return t('privacy.publicNotice');
      case 'semi-private':
        return t('privacy.semiPrivateNotice');
      case 'private':
        return t('privacy.privateNotice');
      default:
        return '';
    }
  });

  const visibleRelationships = computed(() => {
    if (form.privacy === 'private') return [];
    if (form.privacy === 'semi-private') {
      return form.relationships.map((entry) => ({
        ...entry,
        partnerName: t('privacy.anonymousPerson')
      }));
    }
    return form.relationships;
  });

  const visibleReferences = computed(() => {
    if (form.privacy === 'private') return [];
    if (form.privacy === 'semi-private') {
      return form.references.map((entry) => ({
        ...entry,
        name: t('privacy.anonymousPerson'),
        relation: t('privacy.anonymousRelation')
      }));
    }
    return form.references;
  });

  const saveLabel = computed<string>(() => {
    switch (saveStatus.value) {
      case 'saving':
        return t('save.saving');
      case 'saved':
        return t('save.saved');
      case 'error':
        return t('save.error');
      default:
        return t('save.localOnly');
    }
  });

  const addTrait = (): void => {
    const trait = censorText(newTrait.value.trim());
    if (trait && !form.personalityTraits.includes(trait)) {
      form.personalityTraits.push(trait);
      newTrait.value = '';
      notify(t('toast.traitAdded', { value: trait }));
    }
  };

  const addValue = (): void => {
    const value = censorText(newValue.value.trim());
    if (value && !form.values.includes(value)) {
      form.values.push(value);
      newValue.value = '';
      notify(t('toast.valueAdded', { value }));
    }
  };

  const removeTrait = (trait: string): void => {
    const index = form.personalityTraits.indexOf(trait);
    if (index === -1) return;

    form.personalityTraits.splice(index, 1);
    notifyUndo(t('toast.traitRemoved'), () => {
      form.personalityTraits.splice(Math.min(index, form.personalityTraits.length), 0, trait);
    });
  };

  const removeValue = (value: string): void => {
    const index = form.values.indexOf(value);
    if (index === -1) return;

    form.values.splice(index, 1);
    notifyUndo(t('toast.valueRemoved'), () => {
      form.values.splice(Math.min(index, form.values.length), 0, value);
    });
  };

  const addRelationship = (): void => {
    const partnerName = censorText(relationshipDraft.partnerName.trim());
    if (!partnerName) return;

    form.relationships.push({
      id: randomId(),
      partnerName,
      startDate: relationshipDraft.startDate,
      endDate: relationshipDraft.endDate,
      duration: censorText(relationshipDraft.duration.trim()),
      reason: censorText(relationshipDraft.reason.trim())
    });

    relationshipDraft.partnerName = '';
    relationshipDraft.startDate = '';
    relationshipDraft.endDate = '';
    relationshipDraft.duration = '';
    relationshipDraft.reason = '';
    notify(t('toast.relationshipAdded', { name: partnerName }));
  };

  const updateRelationship = (id: string, patch: RelationshipDraft): void => {
    const entry = form.relationships.find((item) => item.id === id);
    const partnerName = censorText(patch.partnerName.trim());
    if (!entry || !partnerName) return;

    entry.partnerName = partnerName;
    entry.startDate = patch.startDate;
    entry.endDate = patch.endDate;
    entry.duration = censorText(patch.duration.trim());
    entry.reason = censorText(patch.reason.trim());
    notify(t('toast.relationshipUpdated'));
  };

  const removeRelationship = (id: string): void => {
    const index = form.relationships.findIndex((item) => item.id === id);
    if (index === -1) return;

    const [entry] = form.relationships.splice(index, 1);
    notifyUndo(t('toast.relationshipRemoved'), () => {
      form.relationships.splice(Math.min(index, form.relationships.length), 0, entry);
    });
  };

  const addReference = (): void => {
    const name = censorText(referenceDraft.name.trim());
    const quote = censorText(referenceDraft.quote.trim());
    if (!name || !quote) return;

    form.references.push({
      id: randomId(),
      name,
      relation: censorText(referenceDraft.relation.trim()),
      quote,
      type: referenceDraft.type
    });

    referenceDraft.name = '';
    referenceDraft.relation = '';
    referenceDraft.quote = '';
    referenceDraft.type = 'fun';
    notify(t('toast.referenceAdded', { name }));
  };

  const updateReference = (id: string, patch: ReferenceDraft): void => {
    const entry = form.references.find((item) => item.id === id);
    const name = censorText(patch.name.trim());
    const quote = censorText(patch.quote.trim());
    if (!entry || !name || !quote) return;

    entry.name = name;
    entry.relation = censorText(patch.relation.trim());
    entry.quote = quote;
    entry.type = patch.type;
    notify(t('toast.referenceUpdated'));
  };

  const removeReference = (id: string): void => {
    const index = form.references.findIndex((item) => item.id === id);
    if (index === -1) return;

    const [entry] = form.references.splice(index, 1);
    notifyUndo(t('toast.referenceRemoved'), () => {
      form.references.splice(Math.min(index, form.references.length), 0, entry);
    });
  };

  const addSkill = (): void => {
    const name = censorText(skillDraft.name.trim());
    if (!name) return;

    form.coupleSkills.push({
      id: randomId(),
      name,
      level: skillDraft.level
    });

    skillDraft.name = '';
    skillDraft.level = 5;
    notify(t('toast.skillAdded', { name }));
  };

  const removeSkill = (id: string): void => {
    const index = form.coupleSkills.findIndex((item) => item.id === id);
    if (index === -1) return;

    const [entry] = form.coupleSkills.splice(index, 1);
    notifyUndo(t('toast.skillRemoved'), () => {
      form.coupleSkills.splice(Math.min(index, form.coupleSkills.length), 0, entry);
    });
  };

  const resetTraits = async (): Promise<void> => {
    if (!form.personalityTraits.length && !form.values.length) return;

    const ok = await confirmAction({
      title: t('traits.confirmResetTitle'),
      message: t('traits.confirmResetBody'),
      confirmLabel: t('traits.reset'),
      cancelLabel: t('common.cancel'),
      tone: 'danger'
    });
    if (!ok) return;

    form.personalityTraits = [];
    form.values = [];
    notify(t('toast.traitsReset'));
  };

  const loadExample = async (): Promise<void> => {
    if (hasContent.value && !isExample.value) {
      const ok = await confirmAction({
        title: t('onboarding.replaceTitle'),
        message: t('onboarding.replaceBody'),
        confirmLabel: t('onboarding.loadExample'),
        cancelLabel: t('common.cancel')
      });
      if (!ok) return;
    }

    const next = createExample();
    Object.assign(form, clone(next.form));
    example = next;
    isExample.value = true;
    notify(t('toast.exampleLoaded'));
  };

  const clearAll = async (): Promise<void> => {
    if (!hasContent.value && !isExample.value) return;

    const ok = await confirmAction({
      title: t('onboarding.clearTitle'),
      message: t('onboarding.clearBody'),
      confirmLabel: t('onboarding.clearCta'),
      cancelLabel: t('common.cancel'),
      tone: 'danger'
    });
    if (!ok) return;

    Object.assign(form, emptyForm());
    example = createExample();
    isExample.value = false;
    newTrait.value = '';
    newValue.value = '';
    relationshipDraft.partnerName = '';
    relationshipDraft.startDate = '';
    relationshipDraft.endDate = '';
    relationshipDraft.duration = '';
    relationshipDraft.reason = '';
    referenceDraft.name = '';
    referenceDraft.relation = '';
    referenceDraft.quote = '';
    referenceDraft.type = 'fun';
    skillDraft.name = '';
    skillDraft.level = 5;
    notify(t('toast.cleared'));
  };

  const generatePdf = async (): Promise<void> => {
    if (isExporting.value) return;

    if (!canExport.value) {
      notify(t('export.nameRequired'));
      return;
    }

    if (isExample.value) {
      const ok = await confirmAction({
        title: t('export.exampleTitle'),
        message: t('export.exampleBody'),
        confirmLabel: t('export.confirmExample'),
        cancelLabel: t('common.cancel')
      });
      if (!ok) return;
    }

    isExporting.value = true;
    pageview({ route: '/export-pdf', path: '/export-pdf' });

    try {
      await nextTick();

      const element = document.querySelector<HTMLElement>('#pdf-export-root');
      if (!element) throw new Error('Missing PDF export root');

      const { default: html2pdf } = await import('html2pdf.js');
      const filename = `love-resume-${slugify(form.fullName) || 'cv'}.pdf`;

      const opt = {
        margin: 0,
        filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: PDF_BACKGROUND, windowWidth: 794 },
        jsPDF: { orientation: 'portrait' as const, unit: 'mm' as const, format: 'a4' },
        pagebreak: { mode: ['avoid-all', 'css'] }
      };

      const rendered = html2pdf().set(opt).from(element).toCanvas();

      const canvas = (await rendered.get('canvas')) as HTMLCanvasElement;
      const pageSize = (await rendered.get('pageSize')) as { inner: { ratio: number } };
      const padded = padCanvasToFullPages(canvas, pageSize.inner.ratio);

      await rendered.set({ canvas: padded } as never).toPdf().save();
      notify(t('export.success'));
    } catch {
      notify(t('export.error'));
    } finally {
      isExporting.value = false;
    }
  };

  return {
    form,
    isExample,
    isFirstRun,
    hasContent,
    canExport,
    isExporting,
    saveStatus,
    saveLabel,
    retrySave: persist,
    toastMessage,
    toastActionLabel,
    runToastAction,
    newTrait,
    newValue,
    relationshipDraft,
    referenceDraft,
    skillDraft,
    addTrait,
    addValue,
    removeTrait,
    removeValue,
    addRelationship,
    updateRelationship,
    removeRelationship,
    addReference,
    updateReference,
    removeReference,
    addSkill,
    removeSkill,
    resetTraits,
    loadExample,
    clearAll,
    generatePdf,
    privacyLabel,
    privacyNotice,
    visibleRelationships,
    visibleReferences
  };
}
