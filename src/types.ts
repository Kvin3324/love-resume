export type PrivacyLevel = 'public' | 'semi-private' | 'private';

export interface RelationshipEntry {
  id: string;
  partnerName: string;
  startDate: string;
  endDate: string;
  duration: string;
  reason: string;
}

export interface ReferenceEntry {
  id: string;
  name: string;
  relation: string;
  quote: string;
  type: 'fun' | 'honest' | 'poetic';
}

export type RelationshipDraft = Pick<
  RelationshipEntry,
  'partnerName' | 'startDate' | 'endDate' | 'duration' | 'reason'
>;

export type ReferenceDraft = Pick<ReferenceEntry, 'name' | 'relation' | 'quote' | 'type'>;

export interface SkillEntry {
  id: string;
  name: string;
  level: number;
}

export interface LoveResumeForm {
  fullName: string;
  role: string;
  bio: string;
  personalityTraits: string[];
  values: string[];
  privacy: PrivacyLevel;
  relationships: RelationshipEntry[];
  references: ReferenceEntry[];
  coupleSkills: SkillEntry[];
}
