import  { useEffect, useMemo, useRef, useState } from "react";

type ChatMsg = {
  role: "user" | "assistant" | "system";
  text: string;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

/**
 * Initializes the browser's native Web Speech API.
 * Returns null if the browser does not support it (e.g., non-Chrome/Edge browsers).
 */
function getRecognition(): any | null {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;

  const rec = new SR();
  rec.continuous = false;
  rec.interimResults = true;
  rec.lang = "en-US";
  return rec;
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 1;
  u.pitch = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

/**
 * SpeakingCoach Component
 * Provide an interactive chat interface for users to converse with an AI english speaking coach.
 * Supports native Web Speech API listening for browsers that support it, with a graceful text fallback.
 */
function SpeakingCoach() {
  const recognition = useMemo(() => getRecognition(), []);
  const [supported, setSupported] = useState(true);

  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "system",
      text: "You are an English speaking coach. Keep answers short and friendly. Ask follow-up questions.",
    },
    {
      role: "assistant",
      text: "Hi! Click Start and speak in English. I will reply and help you improve.",
    },
  ]);

  const [autoSpeak, setAutoSpeak] = useState(true);
  const lastAssistantSpokenRef = useRef<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!recognition) setSupported(false);
  }, [recognition]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addUserAndReply = async (userText: string) => {
    const userMsg: ChatMsg = { role: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5002/api/speaking-coach/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to get coach reply");
      }

      const assistantText = data.coachReply;
      const assistantMsg: ChatMsg = { role: "assistant", text: assistantText };

      setMessages((prev) => [...prev, assistantMsg]);

      if (
        autoSpeak &&
        assistantText &&
        assistantText !== lastAssistantSpokenRef.current
      ) {
        lastAssistantSpokenRef.current = assistantText;
        speak(assistantText);
      }
    } catch (error) {
      const errorMsg: ChatMsg = {
        role: "assistant",
        text: "Sorry, I could not connect to the AI coach server.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!recognition) return;

    setInterim("");
    setListening(true);

    recognition.onresult = (event: any) => {
      let full = "";
      let inter = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) full += transcript;
        else inter += transcript;
      }

      if (inter) setInterim(inter);

      if (full) {
        setInterim("");
        setListening(false);
        addUserAndReply(full);
      }
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
  };

  const stopListening = () => {
    try {
      recognition?.stop();
    } catch (err) {
      console.warn("Speech recognition stop error:", err);
    }
    setListening(false);
  };

  const sendText = () => {
    const t = textInput.trim();
    if (!t || loading) return;
    setTextInput("");
    addUserAndReply(t);
  };

  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-green-100 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500 rounded-2xl shadow-lg shadow-green-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">AI Speaking Coach</h2>
            <p className="text-gray-500 text-sm font-medium">Master English with interactive sessions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            <span className="ml-3 text-sm font-semibold text-gray-700">Auto Speak</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <button
          onClick={startListening}
          disabled={!supported || listening || loading}
          className={`group flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 ${
            listening || loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-transparent"
              : "bg-green-500 text-white shadow-lg shadow-green-100 hover:bg-green-600 hover:-translate-y-1 hover:shadow-green-200"
          }`}
        >
          <span className={`${listening ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`}>🎙️</span>
          {listening ? "Listening..." : "Start Practice"}
        </button>

        <button
          onClick={stopListening}
          disabled={!supported || !listening}
          className={`group flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 ${
            !listening
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-transparent"
              : "bg-white text-rose-500 border-2 border-rose-100 hover:bg-rose-50 hover:border-rose-200 hover:-translate-y-1 shadow-sm"
          }`}
        >
          <span className="group-hover:rotate-12 transition-transform">⏹️</span>
          Stop
        </button>

        <button
          onClick={() => {
            setMessages((prev) => prev.slice(0, 2));
            setInterim("");
          }}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold bg-white text-indigo-500 border-2 border-indigo-50 border-transparent hover:bg-indigo-50 hover:border-indigo-100 hover:-translate-y-1 shadow-sm transition-all duration-300 transform active:scale-95"
        >
          <span className="hover:rotate-180 transition-transform duration-500">🧹</span>
          Reset Chat
        </button>
      </div>

      {!supported && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-semibold">Speech recognition not supported. Please use typing or switch to Chrome/Edge.</p>
        </div>
      )}

      {listening && (
        <div className="mb-4 flex items-center gap-3 animate-fade-in">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></span>
          </div>
          <span className="text-sm font-bold text-green-600 italic">
            {interim ? `“${interim}”` : "Listening for your voice..."}
          </span>
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="bg-gray-50/50 backdrop-blur-sm border border-gray-100 rounded-[2rem] p-5 h-[28rem] overflow-y-auto mb-6 scroll-smooth space-y-4"
      >
        {messages
          .filter((m) => m.role !== "system")
          .map((m, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-2 animate-slide-up ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                m.role === "user" 
                  ? "bg-indigo-500 text-white" 
                  : "bg-green-500 text-white"
              }`}>
                {m.role === "user" ? "👤" : "🤖"}
              </div>
              <div className={`max-w-[80%] p-4 rounded-3xl shadow-sm border ${
                m.role === "user" 
                  ? "bg-indigo-600 text-white border-indigo-500 rounded-br-none" 
                  : "bg-white text-gray-700 border-gray-100 rounded-bl-none"
              }`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
        {loading && (
          <div className="flex items-end gap-2 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">🤖</div>
            <div className="bg-white border border-gray-100 p-4 rounded-3xl rounded-bl-none shadow-sm">
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative group overflow-hidden rounded-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-green-500/20">
        <input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Speak or type your message here..."
          disabled={loading}
          className={`w-full pl-6 pr-24 py-5 rounded-2xl border-2 transition-all outline-none font-medium ${
            loading 
              ? "bg-gray-50 border-gray-100 cursor-not-allowed text-gray-400" 
              : "bg-white border-green-50 text-gray-700 hover:border-green-100 focus:border-green-500"
          }`}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendText();
          }}
        />
        <button
          onClick={sendText}
          disabled={loading || !textInput.trim()}
          className={`absolute right-2 top-2 bottom-2 px-6 rounded-xl font-bold transition-all duration-300 ${
            loading || !textInput.trim()
              ? "bg-gray-100 text-gray-300"
              : "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-100 active:scale-95"
          }`}
        >
          Send
        </button>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
          System Ready: Low Latency
        </div>
        <div>OPTIMIZED FOR CHROME / EDGE</div>
      </div>
    </div>
  );
}

export default SpeakingCoach;