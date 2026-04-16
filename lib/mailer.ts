import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface MailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export async function sendMail(options: MailOptions) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    ...options,
  })
}

// ─── User notification helpers ────────────────────────────────────────────────

export async function notifyUserAccountCreated(user: {
  email: string
  firstName: string
  username: string
  role: string
}) {
  return sendMail({
    to: user.email,
    subject: "Votre compte a été créé — Gestion des Actes de Naissance",
    html: `
      <p>Bonjour ${user.firstName},</p>
      <p>Votre compte a été créé avec succès sur la plateforme de gestion des actes de naissance.</p>
      <ul>
        <li><strong>Nom d'utilisateur :</strong> ${user.username}</li>
        <li><strong>Rôle :</strong> ${user.role}</li>
      </ul>
      <p>Vous pouvez vous connecter sur la plateforme dès que votre accès est activé.</p>
    `,
  })
}

export async function notifyDoctorApproved(user: {
  email: string
  firstName: string
  hospitalName: string
}) {
  return sendMail({
    to: user.email,
    subject: "Accès approuvé — Gestion des Actes de Naissance",
    html: `
      <p>Bonjour Dr. ${user.firstName},</p>
      <p>Votre demande d'accès à <strong>${user.hospitalName}</strong> a été approuvée.</p>
      <p>Vous pouvez désormais vous connecter à la plateforme.</p>
    `,
  })
}
