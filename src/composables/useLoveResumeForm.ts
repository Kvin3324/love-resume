import { computed, onScopeDispose, reactive, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { i18next } from '../i18n';
import type {
  LoveResumeForm,
  ReferenceDraft,
  RelationshipDraft,
  SkillEntry
} from '../types';

const randomId = (): string => crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);

const SKILL_LEVELS = [8, 9, 9, 7];
const PDF_BACKDROP = '#020617';

const arraysEqual = (a: string[], b: string[]): boolean =>
  a.length === b.length && a.every((item, index) => item === b[index]);

export function useLoveResumeForm() {
  const { t } = useTranslation();

  // Localized example data — rebuilt for the active language.
  const buildSeed = () => ({
    traits: t('seed.traits', { returnObjects: true }) as unknown as string[],
    values: t('seed.values', { returnObjects: true }) as unknown as string[],
    relationship: {
      partnerName: t('seed.relationship.partnerName'),
      duration: t('seed.relationship.duration'),
      reason: t('seed.relationship.reason')
    },
    reference: {
      name: t('seed.reference.name'),
      relation: t('seed.reference.relation'),
      quote: t('seed.reference.quote')
    },
    skills: t('seed.skills', { returnObjects: true }) as unknown as string[]
  });

  let seed = buildSeed();

  // Stable ids so we can retranslate the seed entries later without losing edits.
  const relationshipSeedId = randomId();
  const referenceSeedId = randomId();
  const skillSeedIds = seed.skills.map(() => randomId());

  const form = reactive<LoveResumeForm>({
    fullName: '',
    role: '',
    bio: '',
    personalityTraits: [...seed.traits],
    values: [...seed.values],
    privacy: 'link-only',
    relationships: [
      {
        id: relationshipSeedId,
        partnerName: seed.relationship.partnerName,
        startDate: '2022-02',
        endDate: '2023-06',
        duration: seed.relationship.duration,
        reason: seed.relationship.reason
      }
    ],
    references: [
      {
        id: referenceSeedId,
        name: seed.reference.name,
        relation: seed.reference.relation,
        quote: seed.reference.quote,
        type: 'fun'
      }
    ],
    coupleSkills: seed.skills.map((name, index) => ({
      id: skillSeedIds[index],
      name,
      level: SKILL_LEVELS[index] ?? 5
    }))
  });

  // When the language changes, retranslate example entries the user hasn't edited.
  const retranslateSeed = (): void => {
    const prev = seed;
    const next = buildSeed();

    if (arraysEqual(form.personalityTraits, prev.traits)) {
      form.personalityTraits = [...next.traits];
    }
    if (arraysEqual(form.values, prev.values)) {
      form.values = [...next.values];
    }

    const relationship = form.relationships.find((entry) => entry.id === relationshipSeedId);
    if (
      relationship &&
      relationship.partnerName === prev.relationship.partnerName &&
      relationship.duration === prev.relationship.duration &&
      relationship.reason === prev.relationship.reason
    ) {
      relationship.partnerName = next.relationship.partnerName;
      relationship.duration = next.relationship.duration;
      relationship.reason = next.relationship.reason;
    }

    const reference = form.references.find((entry) => entry.id === referenceSeedId);
    if (
      reference &&
      reference.name === prev.reference.name &&
      reference.relation === prev.reference.relation &&
      reference.quote === prev.reference.quote
    ) {
      reference.name = next.reference.name;
      reference.relation = next.reference.relation;
      reference.quote = next.reference.quote;
    }

    skillSeedIds.forEach((id, index) => {
      const skill = form.coupleSkills.find((entry) => entry.id === id);
      if (skill && skill.name === prev.skills[index]) {
        skill.name = next.skills[index];
      }
    });

    seed = next;
  };

  i18next.on('languageChanged', retranslateSeed);
  onScopeDispose(() => i18next.off('languageChanged', retranslateSeed));

  const newTrait = ref('');
  const newValue = ref('');

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

  const addTrait = (): void => {
    const trait = newTrait.value.trim();
    if (trait && !form.personalityTraits.includes(trait)) {
      form.personalityTraits.push(trait);
      newTrait.value = '';
    }
  };

  const addValue = (): void => {
    const value = newValue.value.trim();
    if (value && !form.values.includes(value)) {
      form.values.push(value);
      newValue.value = '';
    }
  };

  const removeTrait = (trait: string): void => {
    form.personalityTraits = form.personalityTraits.filter((item) => item !== trait);
  };

  const removeValue = (value: string): void => {
    form.values = form.values.filter((item) => item !== value);
  };

  const addRelationship = (): void => {
    const partnerName = relationshipDraft.partnerName.trim();
    if (!partnerName) {
      return;
    }

    form.relationships.push({
      id: randomId(),
      partnerName,
      startDate: relationshipDraft.startDate,
      endDate: relationshipDraft.endDate,
      duration: relationshipDraft.duration.trim() || t('relationships.defaultDuration'),
      reason: relationshipDraft.reason.trim() || t('relationships.defaultReason')
    });

    relationshipDraft.partnerName = '';
    relationshipDraft.startDate = '';
    relationshipDraft.endDate = '';
    relationshipDraft.duration = '';
    relationshipDraft.reason = '';
  };

  const updateRelationship = (id: string, patch: RelationshipDraft): void => {
    const entry = form.relationships.find((item) => item.id === id);
    const partnerName = patch.partnerName.trim();
    if (!entry || !partnerName) {
      return;
    }

    entry.partnerName = partnerName;
    entry.startDate = patch.startDate;
    entry.endDate = patch.endDate;
    entry.duration = patch.duration.trim() || t('relationships.defaultDuration');
    entry.reason = patch.reason.trim() || t('relationships.defaultReason');
  };

  const removeRelationship = (id: string): void => {
    const index = form.relationships.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      form.relationships.splice(index, 1);
    }
  };

  const addReference = (): void => {
    const name = referenceDraft.name.trim();
    const quote = referenceDraft.quote.trim();
    if (!name || !quote) {
      return;
    }

    form.references.push({
      id: randomId(),
      name,
      relation: referenceDraft.relation.trim() || t('references.defaultRelation'),
      quote,
      type: referenceDraft.type
    });

    referenceDraft.name = '';
    referenceDraft.relation = '';
    referenceDraft.quote = '';
    referenceDraft.type = 'fun';
  };

  const updateReference = (id: string, patch: ReferenceDraft): void => {
    const entry = form.references.find((item) => item.id === id);
    const name = patch.name.trim();
    const quote = patch.quote.trim();
    if (!entry || !name || !quote) {
      return;
    }

    entry.name = name;
    entry.relation = patch.relation.trim() || t('references.defaultRelation');
    entry.quote = quote;
    entry.type = patch.type;
  };

  const removeReference = (id: string): void => {
    const index = form.references.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      form.references.splice(index, 1);
    }
  };

  const addSkill = (): void => {
    const name = skillDraft.name.trim();
    if (!name) {
      return;
    }

    form.coupleSkills.push({
      id: randomId(),
      name,
      level: skillDraft.level
    });

    skillDraft.name = '';
    skillDraft.level = 5;
  };

  const removeSkill = (id: string): void => {
    const index = form.coupleSkills.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      form.coupleSkills.splice(index, 1);
    }
  };

  const resetTraits = (): void => {
    form.personalityTraits = [];
    form.values = [];
  };

  const padCanvasToFullPages = (canvas: HTMLCanvasElement, pageRatio: number): HTMLCanvasElement => {
    const pageHeight = Math.floor(canvas.width * pageRatio);
    const fullHeight = Math.max(1, Math.ceil(canvas.height / pageHeight)) * pageHeight;
    if (fullHeight === canvas.height) {
      return canvas;
    }

    const padded = document.createElement('canvas');
    padded.width = canvas.width;
    padded.height = fullHeight;

    const context = padded.getContext('2d');
    if (!context) {
      return canvas;
    }

    context.fillStyle = PDF_BACKDROP;
    context.fillRect(0, 0, padded.width, padded.height);
    context.drawImage(canvas, 0, 0);

    return padded;
  };

  const generatePdf = async (): Promise<void> => {
    const element = document.querySelector<HTMLElement>('#pdf-export-root');
    if (!element) return;

    const { default: html2pdf } = await import('html2pdf.js');

    const opt = {
      margin: 0,
      filename: `love-resume-${form.fullName || 'cv'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: PDF_BACKDROP, windowWidth: 794 },
      jsPDF: { orientation: 'portrait' as const, unit: 'mm' as const, format: 'a4' },
      pagebreak: { mode: ['avoid-all', 'css'] }
    };

    const rendered = html2pdf().set(opt).from(element).toCanvas();
    const canvas = (await rendered.get('canvas')) as HTMLCanvasElement;
    const pageSize = (await rendered.get('pageSize')) as { inner: { ratio: number } };
    const padded = padCanvasToFullPages(canvas, pageSize.inner.ratio);

    await rendered.set({ canvas: padded } as never).toPdf().save();
  };

  const privacyLabel = computed<string>(() => {
    switch (form.privacy) {
      case 'public':
        return t('privacy.public');
      case 'semi-private':
        return t('privacy.semiPrivate');
      case 'link-only':
        return t('privacy.linkOnly');
      default:
        return t('privacy.unknown');
    }
  });

  const totalSkill = computed<number>(() => form.coupleSkills.reduce((sum, skill) => sum + skill.level, 0));

  const skillSegments = computed(() => {
    const colors = ['#8b5cf6', '#22c55e', '#38bdf8', '#f472b6'];
    let offset = 0;

    return form.coupleSkills.map((skill, index) => {
      const ratio = totalSkill.value > 0 ? skill.level / totalSkill.value : 0;
      const segment = {
        name: skill.name,
        label: `${Math.round(ratio * 100)}%`,
        color: colors[index % colors.length],
        ratio,
        offset: 276.5 * -offset
      };

      offset += ratio;
      return segment;
    });
  });

  return {
    form,
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
    generatePdf,
    privacyLabel,
    skillSegments
  };
}
