/**
 * Conditional seeder — runs only when the database has no users yet.
 * Used in the Vercel build command to safely seed production on first deploy.
 *
 *   tsx prisma/migrate-deploy-with-retry.ts && tsx prisma/seed-if-empty.ts && next build
 */

import "dotenv/config"
import { createRequire } from "module"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"
import { hashPassword } from "../lib/password"

const require = createRequire(import.meta.url)
const data = require("./seed-data.json") as SeedData

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

type Hospital = {
  id: string
  name: string
  city: string
  address: string
  phone: string
  email: string
}

type CityHall = {
  id: string
  name: string
  city: string
  address: string
  phone: string
  email: string
}

type DoctorSeed = {
  username: string
  email: string
  firstName: string
  lastName: string
  hospitalId: string
  isApproved: boolean
}

type CityHallUserSeed = {
  username: string
  email: string
  firstName: string
  lastName: string
  role: "MAIRE" | "SECRETAIRE" | "MAINTAINER"
  cityHallId: string
}

type SeedData = {
  hospitals: Hospital[]
  cityHalls: CityHall[]
  doctors: DoctorSeed[]
  cityHallUsers: CityHallUserSeed[]
}

async function main() {
  const userCount = await prisma.user.count()

  if (userCount > 0) {
    console.log(`⏭  Database already has ${userCount} user(s). Skipping seed.`)
    return
  }

  console.log("🌱  Empty database detected. Running seed…")

  const adminUsername = process.env.ADMIN_USERNAME ?? "admin"
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@1234!"
  const seedPassword = process.env.SEED_DEFAULT_PASSWORD ?? "Seed@1234!"

  const [adminHash, defaultHash] = await Promise.all([
    hashPassword(adminPassword),
    hashPassword(seedPassword),
  ])

  // ── 1. Hospitals ────────────────────────────────────────────────────────────
  console.log("🏥  Seeding hospitals…")
  await Promise.all(
    data.hospitals.map((h) =>
      prisma.hospital.upsert({ where: { id: h.id }, update: {}, create: h }),
    ),
  )
  console.log(`    → ${data.hospitals.length} hospitals`)

  // ── 2. City halls ───────────────────────────────────────────────────────────
  console.log("🏛️   Seeding city halls…")
  await Promise.all(
    data.cityHalls.map((c) =>
      prisma.cityHall.upsert({ where: { id: c.id }, update: {}, create: c }),
    ),
  )
  console.log(`    → ${data.cityHalls.length} city halls`)

  // ── 3. Admin ─────────────────────────────────────────────────────────────────
  console.log("👤  Seeding admin…")
  await prisma.user.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      password: adminHash,
      email: `${adminUsername}@birth-manage.cm`,
      firstName: "Admin",
      lastName: "Root",
      role: "ADMIN",
    },
  })

  // ── 4. Doctors ───────────────────────────────────────────────────────────────
  console.log("🩺  Seeding doctors…")
  for (const d of data.doctors) {
    const user = await prisma.user.upsert({
      where: { username: d.username },
      update: {},
      create: {
        username: d.username,
        password: defaultHash,
        email: d.email,
        firstName: d.firstName,
        lastName: d.lastName,
        role: "DOCTOR",
      },
    })

    await prisma.doctorHospitalAssignment.upsert({
      where: { userId_hospitalId: { userId: user.id, hospitalId: d.hospitalId } },
      update: {},
      create: {
        userId: user.id,
        hospitalId: d.hospitalId,
        isApproved: d.isApproved,
        approvedAt: d.isApproved ? new Date() : null,
      },
    })
  }
  const approved = data.doctors.filter((d) => d.isApproved).length
  console.log(
    `    → ${data.doctors.length} doctors (${approved} approved, ${data.doctors.length - approved} pending)`,
  )

  // ── 5. City hall users ───────────────────────────────────────────────────────
  console.log("🏛️   Seeding city hall users…")
  for (const u of data.cityHallUsers) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        username: u.username,
        password: defaultHash,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        cityHallId: u.cityHallId,
      },
    })
  }
  console.log(`    → ${data.cityHallUsers.length} city hall users`)

  console.log("")
  console.log("✅  Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
