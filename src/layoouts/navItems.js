export const navItems = {
  COMMON: [
    { label: "Home", to: "/" },
    { label: "Notifications", to: "/notifications" },
    { label: "Notice Board", to: "/notice-board" },
  ],

  // ================= PATIENT =================
  PATIENT: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Doctors", to: "/doctors" },
    { label: "Appointments", to: "/appointment" },
    { label: "Live Consultations", to: "/consultations" },
    { label: "Prescriptions", to: "/prescriptions" },
    { label: "Reports", to: "/reports" },
    { label: "Documents", to: "/documents" },
    { label: "Bills", to: "/bills" },
  ],

  // ================= DOCTOR =================
  DOCTOR: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Appointments", to: "/appointment" },
    { label: "Patients", to: "/patients" },
    { label: "Live Consultations", to: "/consultations" },
    { label: "Diagnosis", to: "/diagnosis" },
    { label: "Prescriptions", to: "/prescriptions" },
    { label: "Reports", to: "/reports" },
    { label: "Documents", to: "/documents" },
  ],

  // ================= ADMIN =================
  ADMIN: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Users", to: "/admin/users" },
    { label: "Doctors", to: "/doctors" },
    { label: "Appointments", to: "/admin/appointments" },
    { label: "Payments", to: "/admin/payments" },
    { label: "Reports", to: "/admin/reports" },
  ],

  PUBLIC: [
    { label: "Home", to: "/" },
    { label: "Login", to: "/login" },
    { label: "Registration", to: "/registration" },
  ],
};

export const getNavByRole = (role) => [
  ...navItems.COMMON,
  ...(navItems[role] || navItems.PUBLIC),
  { label: "Settings", to: "/setting/account" },
];
