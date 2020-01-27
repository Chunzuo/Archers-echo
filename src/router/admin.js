const route = {
  path: "",
  component: () => import("../layouts/main/Main.vue"),
  children: [
    {
      path: "/admin/home",
      name: "admin-dashboard",
      component: () => import("@/views/admin/dashboard/Index.vue"),
      meta: { rule: "isAdmin" }
    },
    {
      path: "/admin/user-management",
      name: "admin-user-management",
      component: () => import("@/views/admin/user-management/Index.vue"),
      meta: { rule: "isAdmin" }
    },
    {
      path: "/admin/upload-statusreport",
      name: "admin-upload-statusreport",
      component: () => import("@/views/admin/upload/Index.vue"),
      meta: { rule: "isAdmin" }
    },
    {
      path: "/admin/notification",
      name: "admin-notification",
      component: () => import("@/views/admin/notification/Index.vue"),
      meta: { rule: "isAdmin" }
    },
    {
      path: "/admin/rule-management",
      name: "admin-rule-management",
      component: () => import("@/views/admin/rule-management/Index.vue"),
      meta: { rule: "isAdmin" }
    }
  ]
};

export default route;
