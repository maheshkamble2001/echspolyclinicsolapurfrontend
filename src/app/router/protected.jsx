// Import Dependencies
import { Navigate } from "react-router";

// Local Imports
import { AppLayout } from "app/layouts/AppLayout";
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";
import RoleGuard from "middleware/RoleGuard";

// ----------------------------------------------------------------------

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/clinic" replace />
        },
        {
          path: "clinic",
          lazy: async () => ({
            Component: (await import("app/pages/Clinic/index")).default,
          }),
        },
        {
          path: "doctors",
          lazy: async () => {
            const CurrentPage = (await import("app/pages/doctors/index"))
              .default;

            return {
              Component: () => (
                <RoleGuard userAllowRole={200000}>
                  <CurrentPage />
                </RoleGuard>
              ),
            };
          },

        },

      ],
    },

    {
      children: [
        {
          path: "settings",
          lazy: async () => ({
            Component: DynamicLayout,
          }),
          children: [
            {
              index: true,
              element: <Navigate to="/settings/general" />,
            },
            {
              path: "general",
              lazy: async () => ({
                Component: (await import("app/pages/settings/sections/General"))
                  .default,
              }),
            },
            {
              path: "appearance",
              lazy: async () => ({
                Component: (
                  await import("app/pages/settings/sections/Appearance")
                ).default,
              }),
            },
          ],
        },
      ],
    },
  ],


};

// full page

export { protectedRoutes };
