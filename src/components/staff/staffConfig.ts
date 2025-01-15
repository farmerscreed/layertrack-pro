export const roles = {
  admin: {
    title: "Administrator",
    permissions: [
      "manage_staff",
      "manage_batches",
      "manage_production",
      "manage_feed",
      "manage_health",
      "manage_finance",
      "view_analytics",
      "manage_settings",
    ],
  },
  manager: {
    title: "Farm Manager",
    permissions: [
      "manage_batches",
      "manage_production",
      "manage_feed",
      "manage_health",
      "view_finance",
      "view_analytics",
    ],
  },
  worker: {
    title: "Farm Worker",
    permissions: [
      "view_batches",
      "record_production",
      "record_feed",
      "record_health",
    ],
  },
} as const;

export const mockStaffData = [];