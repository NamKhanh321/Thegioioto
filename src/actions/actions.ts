"use server";

export async function loginUser(formData : FormData) {
    const payload = {
        username: formData.get("username"),
        password: formData.get("password"),
    }
    console.log(`${process.env.API_ENDPOINT}/api/auth/login`);
    const response = await fetch(`${process.env.API_ENDPOINT}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
}