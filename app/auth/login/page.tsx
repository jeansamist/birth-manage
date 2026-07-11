import { LoginForm } from "./_components/login-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-10">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <LoginForm />
    </div>
  )
}
