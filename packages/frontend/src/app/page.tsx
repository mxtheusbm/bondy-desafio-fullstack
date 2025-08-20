"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Bem vindo, {user?.name}!</CardTitle>
          <CardDescription>{user?.company}</CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => logout()}>
              Sair
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p>Email: {user?.email}</p>
            <div>Senha: {user?.password}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
