export default {
  sidebarItems(state) {
    const items = [
      {
        url: "/user/home",
        name: "Home",
        icon: "HomeIcon"
      },
      {
        url: "/user/team-management",
        name: "Team Management",
        icon: "UsersIcon"
      },
      {
        url: "/user/helpdesk-ticket",
        name: "HelpDesk Ticket",
        icon: "Share2Icon"
      },
      {
        url: "/user/add-wizard",
        name: "Add Wizard",
        icon: "PackageIcon"
      },
      {
        url: "/user/archer-management",
        name: "Archer Management",
        slug: "archer-management",
        icon: "CloudIcon"
      },
      {
        url: "/user/chat",
        name: "Chat",
        slug: "chat",
        icon: "MessageSquareIcon",
        tag: "21",
        tagColor: "danger"
      },
      {
        header: "Archers"
      }
    ];
    for (const archer of state.archers) {
      items.push({
        url: null,
        name: archer.name,
        icon: "AwardIcon",
        id: archer._id,
        submenu: [
          {
            url: "/user/device-management/" + archer._id,
            name: "Devices"
          },
          {
            url: "/user/instance-management/" + archer._id,
            name: "Instances"
          },
          {
            url: "/user/configuration-information/" + archer._id,
            name: "Configuration Information"
          },
          {
            url: "/user/error-logs/" + archer._id,
            name: "Error Logs"
          },
          {
            url: "/user/statistics/" + archer._id,
            name: "Statistics"
          },
          {
            url: "/user/support-ticket/" + archer._id,
            name: "Support Ticket"
          },
          {
            url: "/user/configuration-report/" + archer._id,
            name: "Configuration Report"
          }
        ]
      });
    }
    return items;
  }
};
