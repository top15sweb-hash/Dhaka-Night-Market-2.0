/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId =
  | 'home'
  | 'events'
  | 'experience'
  | 'gallery'
  | 'vendors'
  | 'partners'
  | 'stories'
  | 'about'
  | 'contact';

export type Language = 'en' | 'bn';

export interface EventDetail {
  id: string;
  name: string;
  nameBn?: string;
  dates: string;
  datesBn?: string;
  startDateIso?: string;
  endDateIso?: string;
  time: string;
  timeBn?: string;
  location: string;
  locationBn?: string;
  admission: string;
  admissionBn?: string;
  theme: string;
  themeBn?: string;
  offerings: {
    en: string[];
    bn: string[];
  };
  status: 'upcoming' | 'ongoing' | 'previous';
  imageUrl?: string;
  imagePlaceholderText?: string;
  notes?: string;
  notesBn?: string;
  mapUrl?: string;
  facebookEventUrl?: string;
  footfall?: string;
  brandCount?: string;
  foodBrandCount?: string;
  stats?: string;
  statsBn?: string;
}

export type EnquiryType = 'visitor' | 'vendor' | 'partner' | 'media';
export type EnquiryStatus = 'new' | 'contacted' | 'approved' | 'archived';

export interface EnquiryRecord {
  id: string;
  type: 'vendor' | 'partner' | 'contact' | string;
  title?: string;
  businessOrOrg: string;
  contactName: string;
  phone: string;
  email: string;
  categoryOrType: string;
  preferredEventOrDetails?: string;
  notesOrMessage: string;
  submittedAt: string;
  status: EnquiryStatus;
  sentToMail: string;
}

export interface FormSubmissionState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  year: string;
  event: string;
  placeholderLabel: string;
  imageUrl?: string;
  isVideo?: boolean;
  aspectRatio: '16:9' | '4:3' | '1:1' | '3:4';
}

export interface StoryItem {
  id: string;
  title: string;
  titleBn: string;
  date: string;
  dateBn: string;
  category: string;
  summary: string;
  summaryBn: string;
  isOfficialAnnouncement?: boolean;
  imageUrl?: string;
}

export interface ExperienceCategory {
  id: string;
  title: string;
  titleBn: string;
  shortDescription: string;
  shortDescriptionBn: string;
  statusText: string;
  statusTextBn: string;
  iconName: string;
}
