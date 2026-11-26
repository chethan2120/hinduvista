import nodemailer from "nodemailer";
import { getSettings } from "@/lib/settings";

type EnquiryMail = {
  fullName: string;
  email: string;
  mobile: string;
  destination: string;
  message: string;
  createdAt: Date;
};

export async function notifyEnquiry(enquiry: EnquiryMail) {
  const settings = await getSettings();
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD;
  const to = settings.notification_email.trim();
  const from = process.env.SMTP_FROM?.trim() || user;

  if (!host || !user || !pass || !from || !to) {
    return { sent: false as const, reason: "Email provider is not configured." };
  }

  const transport = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: { user, pass },
  });

  await transport.sendMail({
    from,
    to,
    replyTo: enquiry.email,
    subject: `Hindu Vista enquiry: ${enquiry.destination}`,
    text: [
      "A new enquiry was saved on the Hindu Vista website.",
      "",
      `Name: ${enquiry.fullName}`,
      `Email: ${enquiry.email}`,
      `Mobile: ${enquiry.mobile}`,
      `Destination: ${enquiry.destination}`,
      `Received: ${enquiry.createdAt.toISOString()}`,
      "",
      enquiry.message,
    ].join("\n"),
  });

  return { sent: true as const };
}
