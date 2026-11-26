import { EnquiryStatus } from "@/components/admin/enquiry-status";
import { prisma } from "@/lib/prisma";
import { formatWhen } from "@/lib/utils";

export const metadata = { title: "Enquiries" };

export default async function EnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-serif text-4xl">Enquiries</h1>
      <div className="mt-8 space-y-4">
        {enquiries.map((enquiry) => (
          <article key={enquiry.id} className="border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl">{enquiry.fullName}</h2>
                <p className="mt-1 text-sm text-mute">
                  {enquiry.email} · {enquiry.mobile}
                </p>
              </div>
              <EnquiryStatus id={enquiry.id} status={enquiry.status} />
            </div>
            <p className="mt-4 text-sm">{enquiry.destination}</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-mute">{enquiry.message}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-mute">{formatWhen(enquiry.createdAt)}</p>
          </article>
        ))}
        {!enquiries.length ? <p className="text-sm text-mute">No enquiries have been submitted.</p> : null}
      </div>
    </div>
  );
}
