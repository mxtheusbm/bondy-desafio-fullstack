"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { useAuth } from "@/contexts/auth";
import { LOGIN_MUTATION } from "@/graphql/mutations/login";
import { LoginResponse, LoginVariables } from "@/graphql/types/login-mutation";
import { LoginFormSchema } from "@/schemas/login";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export default function Login() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [loginMutation, { loading }] = useMutation<
    LoginResponse,
    LoginVariables
  >(LOGIN_MUTATION, {
    onCompleted: (data) => {
      toast.success("Login realizado com sucesso!");
      login(data.login.token, data.login.user);
      router.push("/");
    },
    onError: (error) => {
      toast.error("Erro ao realizar login, tente novamente.");
      console.error("Login error:", error);
    },
  });

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof LoginFormSchema>) => {
    loginMutation({
      variables: {
        email: data.email,
        password: data.password,
      },
    });
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-screen w-full flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Entrar na sua conta</CardTitle>
              <CardDescription>
                Digite seu e-mail abaixo para acessar sua conta
              </CardDescription>
              <CardAction>
                <Button variant="link">Não tenho conta</Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@teste.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="******"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  );
}
