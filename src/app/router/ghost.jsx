import GhostGuard from "middleware/GhostGuard";

const ghostRoutes = {
  id: "ghost",
  Component: GhostGuard,
  children: [
    // {
    //   path: "clinic",
    //   lazy: async () => ({
    //     Component: (await import("app/pages/Clinic/index")).default,
    //   }),
    // },
  ],
};

export { ghostRoutes };
