"use client";
import { useState } from "react";

type Msg = { id: string; from: "user" | "bot"; text: string };

export default function ChatWindow() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!text.trim()) return;
    const userMsg: Msg = { id: String(Date.now()), from: "user", text };
    setMessages((s) => [...s, userMsg]);
    setText("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, history: [] }),
      });
      const data = await res.json();
      const botText = data?.response?.text || data?.response || JSON.stringify(data?.response) || "(no reply)";
      const botMsg: Msg = { id: String(Date.now() + 1), from: "bot", text: String(botText) };
      setMessages((s) => [...s, botMsg]);
    } catch (e) {
      setMessages((s) => [...s, { id: String(Date.now()), from: "bot", text: "Error contacting server" }]);
    } finally {
      setLoading(false);
    }
  }

  async function quickBook() {
    setLoading(true);
    try {
      const res = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test User', date: new Date().toISOString(), clinic: 'General Clinic' }),
      });
      const json = await res.json();
      const botMsg: Msg = { id: String(Date.now()), from: 'bot', text: json?.booking ? `Booking confirmed: ${json.booking.id}` : 'Booking failed' };
      setMessages((s) => [...s, botMsg]);
    } catch (e) {
      setMessages((s) => [...s, { id: String(Date.now()), from: 'bot', text: 'Booking error' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow max-w-md">
      <div className="h-64 overflow-auto mb-2">
        {messages.map((m) => (
          <div key={m.id} className={m.from === 'user' ? 'text-right text-blue-700' : 'text-left text-gray-800'}>
            <div className="inline-block px-3 py-1 rounded bg-gray-100 mb-1">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Type a message" />
        <button onClick={send} disabled={loading} className="px-3 py-2 bg-blue-600 text-white rounded">Send</button>
      </div>
      <div className="mt-2 flex gap-2">
        <button onClick={quickBook} disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded">Quick Book</button>
        <button onClick={() => { setMessages([]); }} className="px-3 py-1 bg-gray-300 rounded">Clear</button>
      </div>
    </div>
  );
}
