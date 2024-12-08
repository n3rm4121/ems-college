'use client'

import { signIn } from "@/auth"

export function SignIn() {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const target = e.currentTarget
        const email = target.email.value
        const password = target.password.value
        console.log(email, password)
        const result: { error?: string } = await signIn("credentials", { email, password })
        console.log(result)
        if (result.error) {
            alert(result.error)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email
                <input name="email" type="email" />
            </label>
            <label>
                Password
                <input name="password" type="password" />
            </label>
            <button type="submit">Sign In</button>
        </form>
    )


}