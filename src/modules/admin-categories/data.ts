import { BookCopy, ChartPie, FolderKanban, Sparkles } from "lucide-react";

import type {
  AdminCategoriesMetric,
  AdminCategoryPlanningItem,
  AdminCategoryRecord,
} from "./types";

export const adminCategoriesMetrics: ReadonlyArray<AdminCategoriesMetric> = [
  {
    label: "Categories",
    value: "8",
    supportingText: "Active across public and admin flows",
    icon: FolderKanban,
  },
  {
    label: "Titles grouped",
    value: "126",
    supportingText: "Shared taxonomy across branches",
    icon: BookCopy,
  },
  {
    label: "Top demand",
    value: "Fiction",
    supportingText: "Highest request volume this month",
    icon: ChartPie,
  },
  {
    label: "Planning tasks",
    value: "5",
    supportingText: "Category curation reviews scheduled",
    icon: Sparkles,
  },
];

export const adminCategoriesRecords: ReadonlyArray<AdminCategoryRecord> = [
  {
    id: "fiction",
    name: "Fiction",
    shelfCode: "FIC",
    titles: "34 titles",
    activeLoans: "41 active loans",
    averageFee: "$2.50 cash",
    curationNote:
      "Lead category for monthly circulation with strong branch depth.",
    statusLabel: "Expanding",
    statusTone: "success",
  },
  {
    id: "science",
    name: "Science",
    shelfCode: "SCI",
    titles: "18 titles",
    activeLoans: "16 active loans",
    averageFee: "$3.50 cash",
    curationNote:
      "Borrowing stays steady, but premium reference titles need clearer branch allocation.",
    statusLabel: "Balanced",
    statusTone: "info",
  },
  {
    id: "technology",
    name: "Technology",
    shelfCode: "TEC",
    titles: "15 titles",
    activeLoans: "22 active loans",
    averageFee: "Free",
    curationNote:
      "High repeat borrowing, especially for Clean Code and systems titles.",
    statusLabel: "Watchlist",
    statusTone: "warning",
  },
  {
    id: "travel",
    name: "Travel",
    shelfCode: "TRA",
    titles: "9 titles",
    activeLoans: "6 active loans",
    averageFee: "$1.50 cash",
    curationNote: "Healthy shelf balance and no immediate expansion pressure.",
    statusLabel: "Healthy",
    statusTone: "success",
  },
];

export const adminCategoriesPlanningItems: ReadonlyArray<AdminCategoryPlanningItem> =
  [
    {
      id: "plan-fiction-refresh",
      title: "Refresh fiction feature shelf",
      description:
        "Rotate two high-demand fiction titles into the front-of-house display for the weekend rush.",
      dueLabel: "Due Friday",
    },
    {
      id: "plan-science-balance",
      title: "Rebalance science reference copies",
      description:
        "Move one science copy from Downtown to Hamra to reduce weekend hold pressure.",
      dueLabel: "Due tomorrow",
    },
    {
      id: "plan-design-audit",
      title: "Audit art and design shelf labels",
      description:
        "Confirm title grouping and visual merchandising labels before the spring update.",
      dueLabel: "Due next week",
    },
  ];
