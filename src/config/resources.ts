export const resources = [
  // ... outros recursos
  {
    name: "users",
    options: {
      route: "users",
    },
    list: "/users",
    create: "/users/create",
    edit: "/users/edit/:id",
    show: "/users/show/:id",
    meta: {
      canDelete: true,
      canCreate: ({ roles }: { roles: string[] }) => roles.includes("admin"),
    },
  },
];