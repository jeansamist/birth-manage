/**
 * Runs `prisma migrate deploy` with retry logic for transient advisory-lock timeouts.
 *
 * This is used during Vercel builds because multiple concurrent deployments can
 * briefly contend on Prisma's advisory lock and fail with `P1002`.
 */

import { spawn } from "node:child_process"

const MAX_ATTEMPTS = 3
const BACKOFF_MS = 5000

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function runMigrateDeploy(): Promise<{ code: number; output: string }> {
  return new Promise((resolve) => {
    const child = spawn("pnpm", ["prisma", "migrate", "deploy"], {
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    })

    let output = ""
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString()
      output += text
      process.stdout.write(text)
    })
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString()
      output += text
      process.stderr.write(text)
    })

    child.on("close", (code) => resolve({ code: code ?? 1, output }))
  })
}

function isAdvisoryLockTimeout(output: string): boolean {
  return output.includes("P1002") && output.includes("pg_advisory_lock")
}

async function main() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    if (attempt > 1) {
      console.log(`⏳ Retry ${attempt}/${MAX_ATTEMPTS} for prisma migrate deploy...`)
    }

    const { code, output } = await runMigrateDeploy()
    if (code === 0) {
      return
    }

    const canRetry = attempt < MAX_ATTEMPTS && isAdvisoryLockTimeout(output)
    if (!canRetry) {
      process.exit(code)
    }

    console.warn(`⚠️  Advisory lock timeout detected. Waiting ${BACKOFF_MS}ms before retry...`)
    await sleep(BACKOFF_MS)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
