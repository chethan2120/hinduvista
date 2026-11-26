import { whatsappLink } from "@/lib/utils";

export function WhatsAppButton({ number, preface }: { number: string; preface: string }) {
  const chat = whatsappLink(number, preface || "Hello Hindu Vista, I would like to enquire.");
  const href = chat || "/#enquire";

  return (
    <a
      href={href}
      target={chat ? "_blank" : undefined}
      rel={chat ? "noreferrer" : undefined}
      aria-label={chat ? "WhatsApp Hindu Vista" : "Send an enquiry"}
      className="fixed bottom-5 right-5 z-50 h-14 w-14 drop-shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
        <circle cx="24" cy="24" r="24" fill="#25D366" />
        <path
          fill="#fff"
          d="M34.7 13.3A14.5 14.5 0 0 0 24.1 9 14.6 14.6 0 0 0 11.4 30.8L9.8 39l8.4-1.6A14.6 14.6 0 0 0 38.6 24a14.5 14.5 0 0 0-3.9-10.7zM24.1 35.6a12.1 12.1 0 0 1-6.2-1.7l-.4-.2-5.2 1 1-5-.3-.4a12.1 12.1 0 1 1 11.1 6.3zm6.7-9.1c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.3-.8.1s-1.5-.6-2.9-1.8c-1.1-1-1.8-2.2-2-2.6-.2-.4 0-.5.2-.8.2-.2.4-.4.5-.6.2-.2.2-.4.4-.6.1-.2 0-.5-.1-.7-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.3 3.4 1.4 3.6c.2.2 2.4 3.8 5.9 5.2 2.1.9 2.9 1 4 .8.6-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.7-.5z"
        />
      </svg>
    </a>
  );
}
