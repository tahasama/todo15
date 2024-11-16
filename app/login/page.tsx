"use client";

import { z } from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import GithubSignIn from "@/components/GithubsignIn";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { loginWithCredentials } from "../actions/authActions";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  email: z.string().email(),
  psswrd: z.string().min(5, "psswrd must contain at least 5 characters"),
});

function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      psswrd: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email, psswrd } = data;
    try {
      const response = await loginWithCredentials({
        email,
        psswrd,
      });
      console.log("🚀 ~ handleSubmit ~ responsed:", response);
      if (!response) {
        form.setError("root", {
          message: "user not found, email or username invalid",
        });
      }
      if (response?.error) {
        form.setError("root", {
          message: response.message,
        });
      }
      // else {
      //   router.push("/");
      // }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
    }
  };

  const email = form.getValues("email");

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <fieldset
                className="flex flex-col gap-2"
                disabled={form.formState.isSubmitting}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="psswrd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>psswrd</FormLabel>
                      <FormControl>
                        <Input {...field} type="psswrd" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!!form.formState.errors.root?.message && (
                  <FormMessage>
                    {form.formState.errors.root?.message}
                  </FormMessage>
                )}
                <Button type="submit">Login</Button>
              </fieldset>
            </form>
          </Form>
        </CardContent>
        <GithubSignIn />
        <CardFooter className="flex-col gap-2">
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            Forgot psswrd?{" "}
            <Link
              href={`/psswrd-reset${
                email ? `?email=${encodeURIComponent(email)}` : ""
              }`}
              className="underline"
            >
              Reset my psswrd
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}

export default LoginPage;
