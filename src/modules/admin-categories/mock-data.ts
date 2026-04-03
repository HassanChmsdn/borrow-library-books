import type {
  AdminCategoryFormValues,
  AdminCategoryIconKey,
  AdminCategoryIconOption,
  AdminCategoryMarkerTone,
  AdminCategoryRecord,
} from "./types";

const iconToneMap: Record<AdminCategoryIconKey, AdminCategoryMarkerTone> = {
  "art-design": "danger",
  business: "info",
  fiction: "brand",
  history: "neutral",
  philosophy: "warning",
  science: "info",
  technology: "success",
  travel: "warning",
};

export const adminCategoryIconOptions: ReadonlyArray<AdminCategoryIconOption> =
  [
    {
      value: "fiction",
      label: "Fiction marker",
      helperText: "Best for literature, novels, and story-led shelves.",
    },
    {
      value: "science",
      label: "Science marker",
      helperText: "Use for research-led or academic knowledge groups.",
    },
    {
      value: "history",
      label: "History marker",
      helperText:
        "Works well for archives, biographies, and reference history.",
    },
    {
      value: "philosophy",
      label: "Philosophy marker",
      helperText: "Good for reflection, theory, and critical reading shelves.",
    },
    {
      value: "technology",
      label: "Technology marker",
      helperText: "Use for software, engineering, and systems topics.",
    },
    {
      value: "art-design",
      label: "Art and design marker",
      helperText: "Best for creative, visual, and design-oriented collections.",
    },
    {
      value: "business",
      label: "Business marker",
      helperText: "Suitable for operations, leadership, and finance topics.",
    },
    {
      value: "travel",
      label: "Travel marker",
      helperText:
        "Use for place-based guides, memoirs, and trip planning shelves.",
    },
  ];

export const adminCategoryRecords: ReadonlyArray<AdminCategoryRecord> = [
  {
    id: "fiction",
    name: "Fiction",
    description:
      "Contemporary and classic storytelling titles used heavily in the public browse flow and weekly circulation displays.",
    bookCount: 34,
    iconKey: "fiction",
    markerTone: "brand",
  },
  {
    id: "science",
    name: "Science",
    description:
      "Reference-friendly science titles with steady borrower demand from students, families, and research readers.",
    bookCount: 18,
    iconKey: "science",
    markerTone: "info",
  },
  {
    id: "history",
    name: "History",
    description:
      "Biographies, archives, and context-driven reading lists that support classroom borrowing and curated displays.",
    bookCount: 15,
    iconKey: "history",
    markerTone: "neutral",
  },
  {
    id: "philosophy",
    name: "Philosophy",
    description:
      "Theory, ethics, and reflective reading grouped for staff curation and slower long-loan circulation patterns.",
    bookCount: 11,
    iconKey: "philosophy",
    markerTone: "warning",
  },
  {
    id: "technology",
    name: "Technology",
    description:
      "Software, product, and engineering titles that frequently need fee and duration checks in admin operations.",
    bookCount: 15,
    iconKey: "technology",
    markerTone: "success",
  },
  {
    id: "art-design",
    name: "Art & Design",
    description:
      "Creative practice, visual culture, and design systems titles grouped for editorial browsing and display planning.",
    bookCount: 9,
    iconKey: "art-design",
    markerTone: "danger",
  },
];

export function getAdminCategoryDefaultValues(
  record?: AdminCategoryRecord,
): AdminCategoryFormValues {
  return {
    name: record?.name ?? "",
    description: record?.description ?? "",
    iconKey: record?.iconKey ?? "fiction",
  };
}

export function getAdminCategoryMarkerTone(
  iconKey: AdminCategoryIconKey,
): AdminCategoryMarkerTone {
  return iconToneMap[iconKey];
}

export function createAdminCategoryId(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
