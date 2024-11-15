"use client";

import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formSchema } from "@/lib/zod";
import Link from "next/link";
import { addUser } from "../actions/authActions";

const Register = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      psswrd: "",
      confirmPsswrd: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const { message } = await addUser({
      email: data.email,
      psswrd: data.psswrd,
      confirmPsswrd: data.confirmPsswrd,
    });

    form.setError(message?.includes("psswrd") ? "confirmPsswrd" : "email", {
      message: message,
    });
  };

  return (
    <main className="grid place-content-center min-h-screen">
      {form.formState.isSubmitSuccessful ? (
        <Card className="min-w-80">
          <CardHeader>
            <CardTitle>User Created</CardTitle>
            <CardDescription>
              {` if you haven't been redirected automatically click`}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid place-content-center">
            <Button>
              <Link href={"/"}>Go to home page</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="min-w-80">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create your new account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <fieldset
                  className="flex flex-col gap-3"
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
                        <FormMessage className="" />
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
                        <FormMessage className="" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPsswrd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm psswrd</FormLabel>
                        <FormControl>
                          <Input {...field} type="psswrd" />
                        </FormControl>
                        <FormMessage className="" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-2">
                    {form.formState.isSubmitting
                      ? "Registering..."
                      : "Register"}
                  </Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default Register;
