/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  Strucutre:
  				url 		=> router path
  				name 		=> name to display in sidebar
  				slug 		=> router path name
  				icon 		=> Feather Icon component/icon name
  				tag 		=> text to display on badge
  				tagColor 	=> class to apply on badge element
  				i18n 		=> Internationalization
  				submenu 	=> submenu of current item (current item will become dropdown )
  							NOTE: Submenu don't have any icon(you can add icon if u want to display)
  				isDisabled 	=> disable sidebar item/group
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Version: 1.1
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default [
  {
    url: "/admin/home",
    name: "Dashboard",
    slug: "dashboard",
    icon: "HomeIcon"
  },
  {
    url: "/admin/user-management",
    name: "User Management",
    slug: "userManagement",
    icon: "UsersIcon"
  },
  {
    url: "/admin/upload-statusreport",
    name: "Upload StatusReporter",
    slug: "uploadStatusReporter",
    icon: "UploadIcon"
  },
  {
    url: "/admin/rule-management",
    name: "Rule Management",
    slug: "ruleManagement",
    icon: "GlobeIcon"
  }
];
