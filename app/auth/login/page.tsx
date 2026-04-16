import { prisma } from "@/lib/prisma"
import { LoginForm } from "./_components/login-form"

export default async function LoginPage() {
  const [hospitals, cityHalls] = await Promise.all([
    prisma.hospital.findMany({
      where: { isActive: true },
      select: { id: true, name: true, city: true },
      orderBy: { name: "asc" },
    }),
    prisma.cityHall.findMany({
      where: { isActive: true },
      select: { id: true, name: true, city: true },
      orderBy: { name: "asc" },
    }),
  ])

  return <LoginForm hospitals={hospitals} cityHalls={cityHalls} />
}
