"use client";
import React, { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/apollo-client";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ApolloProvider>
  );
};
