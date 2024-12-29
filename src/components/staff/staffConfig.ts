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

export const mockStaffData = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@farm.com",
    phone: "+1234567890",
    role: "admin",
    department: "production",
    startDate: "2024-01-01",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@farm.com",
    phone: "+1234567891",
    role: "manager",
    department: "health",
    startDate: "2024-02-15",
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike.w@farm.com",
    phone: "+1234567892",
    role: "worker",
    department: "maintenance",
    startDate: "2024-03-01",
  },
];