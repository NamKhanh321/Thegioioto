"use server";

import { redirect } from "next/navigation";
type RegisterFormState = {
  error?: string | null;
  username: string | null;
  password: string | null;
  name: string | null;
};

export async function registerUser(previousState: RegisterFormState, formData : FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const payload = {
        username: username,
        password: password,
        name: name,
        role: "customer",
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    
    if(!response.ok)
    {
        const data = await response.json();
        console.log(data);
        return {
            error: data.msg,
            username,
            password, // You might want to clear this for security
            name,
        };
    }
    redirect('/login');
}