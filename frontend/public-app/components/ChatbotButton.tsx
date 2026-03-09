"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function ChatbotButton() {
  return (
    <Link
      href="/chatbox"
      aria-label="Open chatbot"
      className="fixed right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#0E9488] text-white shadow-2xl shadow-teal-500/40 transition-all hover:scale-110 active:scale-95"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 6rem)" }}
    >
      <MessageSquare size={24} />
    </Link>
  );
}
