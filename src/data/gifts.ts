export type Gift = {
  slug: string;
  recipientName: string;
  title: string;
  subtitle: string;
  intro: string; // Used for the paragraph below title
  heroImage: string;
  whatsIncludedTitle: string;
  whatsIncludedItems: string[];
  extraSectionTitle?: string;
  extraSectionItems?: string[];
  isChristmas?: boolean; // New flag for Christmas styling
};

export const gifts: Gift[] = [
  {
    slug: 'brother', // Keeping slug as 'brother' for now to avoid breaking existing links unless requested, but changing recipient name
    recipientName: 'Conor',
    title: 'INTRO TO OUTDOOR ROCK CLIMBING – MOURNE MOUNTAINS',
    subtitle: '', 
    intro:
      'A full-day guided outdoor climbing experience for beginners or indoor climbers ready for real rock. Scenic cliffs, fresh air, real adventure. A proper day out in one of Northern Ireland’s most stunning locations.',
    heroImage: '/mournes-climb.svg',
    whatsIncludedTitle: 'What’s Included',
    whatsIncludedItems: [
      'Fitting a climbing harness & equipment overview',
      'Introduction to the <strong>belay system</strong>',
      '<strong>Full day of outdoor climbing</strong>',
      'Stunning <strong>Mourne Mountains location</strong>',
    ],
    extraSectionTitle: 'Suggested 2026 Dates',
    extraSectionItems: [
      'Sunday 8th March 2026',
      'Sunday 12th April 2026',
    ],
    isChristmas: true,
  },
];

export function getGiftBySlug(slug: string): Gift | undefined {
  return gifts.find((gift) => gift.slug.toLowerCase() === slug.toLowerCase());
}
