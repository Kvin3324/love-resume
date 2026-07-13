import { computed, reactive, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import html2pdf from 'html2pdf.js';
import type { LoveResumeForm, RelationshipEntry, ReferenceEntry } from '../types';

const randomId = (): string => crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);

export function useLoveResumeForm() {
  const { t } = useTranslation();

  const form = reactive<LoveResumeForm>({
    fullName: '',
    role: '',
    bio: '',
    personalityTraits: ['Empathique', 'Authentique', 'Curieux'],
    values: ['Confiance', 'Humour', 'Honnêteté'],
    privacy: 'link-only',
    relationships: [
      {
        id: randomId(),
        partnerName: 'Sophie',
        startDate: '2022-02',
        endDate: '2023-06',
        duration: '1 an 4 mois',
        reason: 'Distance'
      }
    ],
    references: [
      {
        id: randomId(),
        name: 'Lina',
        relation: 'Ex',
        quote: 'Toujours là pour écouter et rigoler, même quand la vie est plus sérieuse.',
        type: 'fun'
      }
    ],
    coupleSkills: [
      { id: randomId(), name: 'Communication', level: 8 },
      { id: randomId(), name: 'Écoute', level: 9 },
      { id: randomId(), name: 'Loyauté', level: 9 },
      { id: randomId(), name: 'Spontanéité', level: 7 }
    ]
  });

  const newTrait = ref('');
  const newValue = ref('');

  const relationshipDraft = reactive<Pick<RelationshipEntry, 'partnerName' | 'startDate' | 'endDate' | 'duration' | 'reason'>>({
    partnerName: '',
    startDate: '',
    endDate: '',
    duration: '',
    reason: ''
  });

  const referenceDraft = reactive<Pick<ReferenceEntry, 'name' | 'relation' | 'quote' | 'type'>>({
    name: '',
    relation: '',
    quote: '',
    type: 'fun'
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

  const removeReference = (id: string): void => {
    const index = form.references.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      form.references.splice(index, 1);
    }
  };

  const resetTraits = (): void => {
    form.personalityTraits = [];
    form.values = [];
  };

  const generatePdf = (): void => {
    const element = document.querySelector('#pdf-export-root');
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `love-resume-${form.fullName || 'cv'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: '#020617', windowWidth: 794 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      pagebreak: { mode: ['avoid-all', 'css'] }
    };

    html2pdf().set(opt).from(element).save();
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
    addTrait,
    addValue,
    removeTrait,
    removeValue,
    addRelationship,
    removeRelationship,
    addReference,
    removeReference,
    resetTraits,
    generatePdf,
    privacyLabel,
    skillSegments
  };
}
