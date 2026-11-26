import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function zodMessage(error: ZodError) {
  return error.issues[0]?.message || "Check the form and try again.";
}

export function handleRouteError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return jsonError("That value is already in use.");
  }
  console.error(error);
  return jsonError("Something went wrong.", 500);
}
