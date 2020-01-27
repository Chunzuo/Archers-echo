const route = {
  // =============================================================================
  // USER ROUTES
  // =============================================================================
  path: "",
  component: () => import("../layouts/main/Main.vue"),
  children: [
    {
      path: "/user/home",
      name: "user-home",
      component: () => import("@/views/user/home/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/archer-management",
      name: "archer-management",
      component: () => import("@/views/user/archer-management/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/device-management/:id",
      name: "device-management",
      component: () => import("@/views/user/device-management/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/device-detail/:id",
      name: "device-detail",
      component: () => import("@/views/user/device-detail/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/instance-management/:id",
      name: "instance-management",
      component: () => import("@/views/user/instance-management/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/instance-detail/:database",
      name: "instance-detail",
      component: () => import("@/views/user/instance-detail/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/configuration-information/:id",
      name: "configuration-information",
      component: () =>
        import("@/views/user/configuration-information/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/error-logs/:id",
      name: "error-logs",
      component: () => import("@/views/user/error-logs/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/statistics/:id",
      name: "/statistics",
      component: () => import("@/views/user/statistics/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/support-ticket/:id",
      name: "support-ticket",
      component: () => import("@/views/user/support-ticket/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/configuration-report/:id",
      name: "configuration-report",
      component: () => import("@/views/user/configuration-report/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/team-management",
      name: "team-management",
      component: () => import("@/views/user/team-management/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/add-team",
      name: "add-team",
      component: () => import("@/views/user/team-management/AddTeam.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/edit-team/:id",
      name: "edit-team",
      component: () => import("@/views/user/team-management/EditTeam.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/detail-team/:id",
      name: "detail-team",
      component: () => import("@/views/user/team-management/DetailTeam.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/helpdesk-ticket",
      name: "helpdesk-ticket",
      component: () => import("@/views/user/helpdesk-ticket/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/add-helpdesk-ticket",
      name: "add-helpdesk-ticket",
      component: () => import("@/views/user/helpdesk-ticket/AddHelpDesk.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/helpdesk-ticket/detail/:id",
      name: "helpdesk-ticket-detail",
      component: () =>
        import("@/views/user/helpdesk-ticket/HelpDeskDetail.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/helpdesk-ticket/edit/:id",
      name: "helpdesk-ticket-edit",
      component: () => import("@/views/user/helpdesk-ticket/HelpDeskEdit.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/add-wizard",
      name: "add-wizard",
      component: () => import("@/views/user/add-wizard/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/profile",
      name: "profile",
      component: () => import("@/views/user/profile/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/notification",
      name: "notification",
      component: () => import("@/views/user/notification/Index.vue"),
      meta: { rule: "isUser" }
    },
    {
      path: "/user/chat",
      name: "chat",
      component: () => import("@/views/user/chat/Chat.vue"),
      meta: { rule: "isUser" }
    }
  ]
};

export default route;
