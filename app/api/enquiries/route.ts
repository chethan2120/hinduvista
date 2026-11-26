import { NextResponse } from "next/server";
import { handleRouteError, jsonError, zodMessage } from "@/lib/http";
import { notifyEnquiry } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/utils";
import { enquirySchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const parsed = enquirySchema.safeParse(await request.json());
    if (!parsed.success) return jsonError(zodMessage(parsed.error));
    if (parsed.data.company) return NextResponse.json({ ok: true, whatsappUrl: null, notice: "Your enquiry has been saved." });

    const settings = await getSettings();
    const enquiry = await prisma.enquiry.create({
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        mobile: parsed.data.mobile,
        destination: parsed.data.destination,
        message: parsed.data.message,
      },
    });

    const message = [
      settings.whatsapp_preface || "Hello Hindu Vista, I sent an enquiry through the website.",
      "",
      `Name: ${enquiry.fullName}`,
      `Email: ${enquiry.email}`,
      `Mobile: ${enquiry.mobile}`,
      `Destination: ${enquiry.destination}`,
      "",
      enquiry.message,
    ].join("\n");

    try {
      await notifyEnquiry(enquiry);
    } catch (error) {
      console.error("Enquiry email failed", error);
    }

    return NextResponse.json({
      ok: true,
      whatsappUrl: whatsappLink(settings.whatsapp_number, message),
      notice: "Your enquiry has been saved for the Hindu Vista desk.",
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
