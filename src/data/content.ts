/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExperienceCategory, GalleryItem, StoryItem } from '../types';
import theWeddingShowImg from '../assets/images/the_wedding_show_1790767339554.jpg';
import summerEditionBannerImg from '../assets/images/summer_edition_banner_1790770101633.jpg';
import season2SehriBannerImg from '../assets/images/season_2_sehri_banner_1790770541419.jpg';
import dhakaSplendorBannerImg from '../assets/images/dhaka_splendor_banner_1790770764936.jpg';

export const OFFICIAL_INFO = {
  name: 'Dhaka Night Market',
  intro: 'Bangladesh’s first-ever Night Market experience!',
  introPlain: 'Bangladesh’s first-ever Night Market experience!',
  introPlainBn: 'বাংলাদেশের সর্বপ্রথম নাইট মার্কেট অভিজ্ঞতা!',
  phone: '01755-673845',
  email: 'dhakanightmarket@gmail.com',
  address: 'Dhaka, Bangladesh',
  facebook: 'https://www.facebook.com/dhakanightmarket/',
  instagram: 'https://www.instagram.com/dhakanightmarket/',
};

export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  {
    id: 'food-drinks',
    title: 'Food & Drinks',
    titleBn: 'খাবার ও পানীয়',
    shortDescription:
      'Gourmet street eats, bespoke bakery delights, artisan coffee, festive Ramadan and Sehri dishes, and premier culinary brands serving fresh beneath the evening sky.',
    shortDescriptionBn:
      'ঐতিহ্যবাহী ও আধুনিক স্ট্রিট ফুড, বেকারি ডেলিকেসি, স্পেশালিটি কফি ও সেহরি ফুড চত্বরের অতুলনীয় স্বাদ।',
    statusText: 'Curation Underway for Upcoming Edition',
    statusTextBn: 'আসন্ন প্রদর্শনী উপলক্ষ্যে কিউরেশন চলমান',
    iconName: 'UtensilsCrossed',
  },
  {
    id: 'shopping',
    title: 'Shopping',
    titleBn: 'শপিং ও ফ্যাশন',
    shortDescription:
      'Curated bridal wear, gold and diamond jewelry ateliers, designer pret-a-porter, modest wear, handloom silks, and accessories from leading lifestyle creators.',
    shortDescriptionBn:
      'এক্সক্লুসিভ ব্রাইডাল পোশাক, স্বর্ণ ও হীরার অলঙ্কার, ট্রেন্ডি ফ্যাশন এবং দেশীয় ঐতিহ্যবাহী শাড়ি ও পোশাকের সমাহার।',
    statusText: 'Designer Brands List Releasing Soon',
    statusTextBn: 'ডিজাইনার ব্র্যান্ডের তালিকা শীঘ্রই প্রকাশ পাবে',
    iconName: 'ShoppingBag',
  },
  {
    id: 'music-entertainment',
    title: 'Music & Entertainment',
    titleBn: 'মিউজিক ও বিনোদন',
    shortDescription:
      'Acoustic evening sessions, stand-up comedy specials, celebrity appearances, influencer collaborations, and festive cultural performances.',
    shortDescriptionBn:
      'লাইভ অ্যাকোস্টিক মিউজিক, স্ট্যান্ড-আপ কমেডি শো, তারকাদের উপস্থিতি ও মনোমুগ্ধকর সাংস্কৃতিক পরিবেশনা।',
    statusText: 'Artist Lineup to be Announced',
    statusTextBn: 'শিল্পীদের লাইন-আপ শীঘ্রই ঘোষিত হবে',
    iconName: 'Music',
  },
  {
    id: 'cultural-activities',
    title: 'Cultural Activities',
    titleBn: 'সাংস্কৃতিক কার্যক্রম',
    shortDescription:
      'Handcrafted pottery, mehendi artisans, live portrait painters, Bengali calligraphy showcases, and heritage art pavilion installations.',
    shortDescriptionBn:
      'ঐতিহ্যবাহী কারুশিল্প, লাইভ আর্ট, মেহেন্দি আর্ট এবং দেশীয় সাংস্কৃতিক ঐতিহ্যের বর্ণিল উপস্থাপনা।',
    statusText: 'Artisan Pavilion Participating',
    statusTextBn: 'আর্টিসান প্যাভিলিয়ন প্রস্তুত হচ্ছে',
    iconName: 'Sparkles',
  },
  {
    id: 'family-activities',
    title: 'Family Activities',
    titleBn: 'পারিবারিক বিনোদন ও কিডস জোন',
    shortDescription:
      'Secure air-conditioned venues, dedicated kids play zones, interactive games, photo booths, and a comfortable celebratory night out for families.',
    shortDescriptionBn:
      'নিরাপদ ও শীতাতপ নিয়ন্ত্রিত পরিবেশ, বাচ্চাদের জন্য বিশেষ খেলার জোন, ফটো বুথ এবং পরিবারের সাথে সময় কাটানোর আনন্দ।',
    statusText: 'Family Amenities Confirmed',
    statusTextBn: 'পারিবারিক সুবিধা ও নিরাপত্তা ব্যবস্থা সুনিশ্চিত',
    iconName: 'Users',
  },
  {
    id: 'local-featured-brands',
    title: 'Local & Featured Brands',
    titleBn: 'স্থানীয় ও প্রিমিয়াম ব্র্যান্ডস',
    shortDescription:
      'Empowering homegrown Bangladeshi innovators, artisanal craft collectives, and renowned national retail institutions.',
    shortDescriptionBn:
      'বাংলাদেশের প্রতিশ্রুতিশীল উদ্যোক্তা ও শীর্ষস্থানীয় প্রতিষ্ঠিত ব্র্যান্ডগুলোর বিশেষ মেলা।',
    statusText: 'Vendor Allocations in Progress',
    statusTextBn: 'ভেন্ডর বুথ বরাদ্দ কার্যক্রম প্রক্রিয়াধীন',
    iconName: 'Award',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gallery-wedding-2026',
    title: 'The Wedding Show Poster – October 9–10, 2026',
    titleBn: 'ওয়েডিং শো পোস্টার – ৯–১০ অক্টোবর ২০২৬',
    category: 'bridal',
    year: '2026',
    event: 'The Wedding Show @ Sheraton Banani',
    placeholderLabel: '[Official Event Artwork - The Wedding Show]',
    imageUrl: theWeddingShowImg,
    aspectRatio: '16:9',
  },
  {
    id: 'gallery-summer-edit-2026',
    title: 'Eastern Bank PLC. Presents Summer Edition 2026',
    titleBn: 'ইস্টার্ন ব্যাংক পিএলসি প্রেজেন্টস সামার এডিশন ২০২৬',
    category: 'event',
    year: '2026',
    event: 'Summer Edit @ Sheraton Banani',
    placeholderLabel: '[Official Poster - Summer Edition 2026]',
    imageUrl: summerEditionBannerImg,
    aspectRatio: '16:9',
  },
  {
    id: 'gallery-sehri-season-2',
    title: 'UCB Presents Dhaka Night Market Season 2 – Sehri Edition',
    titleBn: 'ইউসিবি প্রেজেন্টস ঢাকা নাইট মার্কেট সিজন ২ – সেহরি এডিশন',
    category: 'food',
    year: '2026',
    event: 'Season 2 @ UCC Airport',
    placeholderLabel: '[Official Poster - Season 2 Sehri Foodcourt]',
    imageUrl: season2SehriBannerImg,
    aspectRatio: '16:9',
  },
  {
    id: 'gallery-dhaka-splendor-2',
    title: 'Dhaka Splendor 2.0 – Grand Lifestyle Expo of the Year',
    titleBn: 'ঢাকা স্প্লেন্ডার ২.০ – গ্র্যান্ড লাইফস্টাইল এক্সপো',
    category: 'crowd',
    year: '2024',
    event: 'Dhaka Splendor @ Banani Field',
    placeholderLabel: '[Official Poster - Dhaka Splendor 2.0]',
    imageUrl: dhakaSplendorBannerImg,
    aspectRatio: '16:9',
  },
  {
    id: 'gallery-bridal-couture-1',
    title: 'Exclusive Gold & Diamond Jewelry Pavilion',
    titleBn: 'স্বর্ণ ও ডায়মন্ড জুয়েলারি প্যাভিলিয়ন',
    category: 'bridal',
    year: '2026',
    event: 'The Wedding Show',
    placeholderLabel: '[Gold & Diamond Jewelry Exhibition Display]',
    aspectRatio: '4:3',
  },
  {
    id: 'gallery-ballroom-ambience',
    title: 'Grand Ballroom Atmosphere at Sheraton Banani',
    titleBn: 'শেরাটন বনানীর গ্র্যান্ড বলরুমের আলোকসজ্জা',
    category: 'event',
    year: '2026',
    event: 'Sheraton Banani Showcases',
    placeholderLabel: '[Five-Star Ballroom Lighting & Stalls]',
    aspectRatio: '16:9',
  },
  {
    id: 'gallery-ramadan-foodcourt',
    title: 'Midnight Culinary Delights & Sehri Courtyard',
    titleBn: 'মধ্যরাতের রসনাবিলাস ও সেহরি ফুডকোর্ট',
    category: 'food',
    year: '2026',
    event: 'Season 2 Ramadan Edition',
    placeholderLabel: '[Ramadan & Sehri Gourmet Food Stalls]',
    aspectRatio: '4:3',
  },
  {
    id: 'gallery-teaser-video',
    title: 'Official Event Highlight Reel & Teaser',
    titleBn: 'অফিসিয়াল ইভেন্ট হাইলাইটস ও ভিডিও রিল',
    category: 'video',
    year: '2026',
    event: 'Dhaka Night Market Official Teaser',
    placeholderLabel: '[Dhaka Night Market Video Highlight Reel]',
    isVideo: true,
    aspectRatio: '16:9',
  },
];

export const STORIES: StoryItem[] = [
  {
    id: 'story-wedding-show-announcement',
    title:
      'Dhaka Night Market Announces "Wedding & Lifestyle Exhibition" for October 9–10, 2026',
    titleBn:
      '৯–১০ অক্টোবর ২০২৬ অনুষ্ঠিত হতে যাচ্ছে "ওয়েডিং অ্যান্ড লাইফস্টাইল এক্সিবিশন"',
    date: 'October 1, 2026',
    dateBn: '১ অক্টোবর ২০২৬',
    category: 'announcement',
    summary:
      'Dhaka Night Market is scheduled to return to the Grand Ballroom at Sheraton Banani for a two-day bridal and lifestyle showcase featuring House of Bengal with free entry for all guests.',
    summaryBn:
      'শেরাটন বনানীর গ্র্যান্ড বলরুমে দুই দিনব্যাপী ওয়েডিং অ্যান্ড লাইফস্টাইল এক্সিবিশন অনুষ্ঠিত হবে, যেখানে সবার জন্য প্রবেশ ফ্রি থাকবে।',
    isOfficialAnnouncement: true,
  },
  {
    id: 'story-summer-edit-success',
    title:
      'Summer Edit at Sheraton Banani Welcomed Over 15,000 Visitors Across 2 Nights',
    titleBn:
      'শেরাটন বনানীতে সামার এডিটে দুই রাতে ১৫,০০০+ দর্শনার্থীর স্বতঃস্ফূর্ত অংশগ্রহণ',
    date: 'May 25, 2026',
    dateBn: '২৫ মে ২০২৬',
    category: 'highlights',
    summary:
      'Presented by Eastern Bank PLC., the Summer Edit established Bangladesh’s first dedicated summer night market with 100+ lifestyle labels and 15+ food brands running past midnight.',
    summaryBn:
      'ইস্টার্ন ব্যাংক পিএলসির পৃষ্ঠপোষকতায় অনুষ্ঠিত এই আয়োজনে ১০০টিরও বেশি লাইফস্টাইল ব্র্যান্ড এবং ১৫টির বেশি ফুড ব্র্যান্ড অংশ নেয়।',
  },
  {
    id: 'story-sehri-nights-recap',
    title:
      'Season 2 Brought 30,000+ Visitors for 3 Atmospheric Nights Running Until Sehri',
    titleBn:
      'সিজন ২ এর সেহরি নাইটসে ৩০,০০০ এর অধিক দর্শনার্থী ভোর পর্যন্ত উদযাপন করেন',
    date: 'March 10, 2026',
    dateBn: '১০ মার্চ ২০২৬',
    category: 'highlights',
    summary:
      'UCB presents Dhaka Night Market Season 2 transformed the United Convention Centre (Airport) into an illuminated festive sanctuary with 150+ brands and a curated Sehri foodcourt.',
    summaryBn:
      'ইউসিসিতে অনুষ্ঠিত সিজন ২-এ রমাদানের আনন্দ ও সেহরির খাবার নিয়ে এক অবিস্মরণীয় মিলনমেলা অনুষ্ঠিত হয়।',
  },
  {
    id: 'story-vendor-empowerment',
    title:
      'Empowering Dhaka’s Creative Artisans: How Night Markets Foster Homegrown Labels',
    titleBn:
      'দেশীয় উদ্যোক্তা ও ক্রিয়েটিভ কারিগরদের প্ল্যাটফর্ম দিচ্ছে ঢাকা নাইট মার্কেট',
    date: 'January 18, 2026',
    dateBn: '১৮ জানুয়ারি ২০২৬',
    category: 'vendor',
    summary:
      'A deep dive into how Dhaka Night Market provides independent artisans direct access to thousands of evening shoppers in luxury five-star settings.',
    summaryBn:
      'উদ্যোক্তারা কীভাবে ৫-তারকা বলরুমের অভিজাত পরিবেশে হাজারো প্রিমিয়াম ক্রেতার সাথে সরাসরি সংযোগ স্থাপন করছেন।',
  },
];
