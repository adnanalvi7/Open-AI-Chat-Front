import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Bounce, ToastContainer } from "react-toastify";
import { AuthProvider } from "./src/context/Auth";

const queryClient = new QueryClient();

const theme: MantineThemeOverride = {
  primaryColor: "blue",
  components: {
    Button: { defaultProps: { size: "md" } },
    TextInput: { defaultProps: { size: "md" } },
  },
};

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        <AuthProvider>{children}</AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
