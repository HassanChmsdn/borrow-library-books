import {
  BookCopy,
  Clock3,
  PackageOpen,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface AdminMetric {
  label: string;
  value: string;
  supportingText: string;
  icon: LucideIcon;
}

export interface AdminQueueItem {
  title: string;
  description: string;
  meta: string;
  status: string;
}

export interface AdminStatusItem {
  title: string;
  description: string;
  tone: "success" | "warning" | "danger" | "info";
}

export const adminMetrics: ReadonlyArray<AdminMetric> = [
  {
    label: "Active loans",
    value: "128",
    supportingText: "+12 from last week",
    icon: BookCopy,
  },
  {
    label: "Borrow requests",
    value: "14",
    supportingText: "6 require review today",
    icon: Clock3,
  },
  {
    label: "Inventory alerts",
    value: "7",
    supportingText: "Low-stock or unavailable titles",
    icon: PackageOpen,
  },
  {
    label: "Active members",
    value: "342",
    supportingText: "18 new signups this month",
    icon: Users,
  },
];

export const borrowRequestQueue: ReadonlyArray<AdminQueueItem> = [
  {
    title: "Reserve Clean Code",
    description: "Requested by Sara Chehab",
    meta: "Queued 18 minutes ago",
    status: "Needs assignment",
  },
  {
    title: "Renew The Great Gatsby",
    description: "Requested by Karim Youssef",
    meta: "Due tomorrow",
    status: "Eligible",
  },
  {
    title: "Pickup reminder for Sapiens",
    description: "Requested by Noor Haddad",
    meta: "Hold expires in 4 hours",
    status: "Send reminder",
  },
];

export const inventoryNotes: ReadonlyArray<AdminStatusItem> = [
  {
    title: "Meditations",
    description:
      "All copies are currently checked out. Consider adding one more copy to the downtown branch.",
    tone: "danger",
  },
  {
    title: "Into the Wild",
    description:
      "Travel shelf is performing well with all copies available and no outstanding returns.",
    tone: "success",
  },
  {
    title: "Thinking, Fast and Slow",
    description:
      "Borrowing demand is rising. Keep an eye on the wait list this week.",
    tone: "warning",
  },
];

export const memberSignals: ReadonlyArray<AdminQueueItem> = [
  {
    title: "Downtown Reading Room",
    description: "Highest pickup volume this week",
    meta: "48 completed handoffs",
    status: "Healthy",
  },
  {
    title: "Community plan members",
    description: "Most requested category: Fiction",
    meta: "64 open loans",
    status: "Stable",
  },
  {
    title: "Notification opt-ins",
    description:
      "Email and SMS reminders are enabled for 78% of active members",
    meta: "Improves return compliance",
    status: "Opportunity",
  },
];
