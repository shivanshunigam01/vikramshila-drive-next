import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { openEnquiryDialog } from "@/components/common/EnquiryDialog";

const KB: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["ace", "gold", "scv", "city", "delivery"],
    answer:
      "Tata Ace Gold is perfect for city deliveries with great mileage, compact size, and low maintenance. Variants available in Petrol, Diesel, CNG, and EV.",
  },
  {
    keywords: ["intra", "v10", "v20", "v30", "v50", "v70", "payload"],
    answer:
      "Tata Intra series offers higher payload and comfort. V10/V20 are great for mileage; V30/V50/V70 offer more power and capacity for heavier loads.",
  },
  {
    keywords: ["winger", "magic", "passenger", "seater"],
    answer:
      "For passenger mobility, Tata Magic and Winger offer multiple seating options including 9/13/15-seater and specialized staff/school/ambulance variants.",
  },
  {
    keywords: ["yodha", "pickup", "1250", "1500", "2000", "cng"],
    answer:
      "Tata Yodha pickups come in 1250/1500/2000 kg payload options including CNG. Rugged build, strong chassis, and low cost of ownership.",
  },
  {
    keywords: [
      "407",
      "ultra",
      "lcv",
      "icv",
      "mcv",
      "lpt",
      "1518",
      "1412",
      "1618",
    ],
    answer:
      "LCV/ICV/MCV portfolio (407 Gold, Ultra T.6/T.7, Ultra 1412/1518, LPT 1109/1512/1618) covers diverse applications with strong performance and uptime.",
  },
  {
    keywords: ["finance", "loan", "emi", "down", "interest", "documents"],
    answer:
      "We offer flexible finance with low down payment, competitive interest rates, and quick approvals. Share PAN, Aadhaar, bank statements to begin.",
  },
  {
    keywords: ["service", "warranty", "maintenance", "interval", "spares"],
    answer:
      "Enjoy wide service network, genuine spares, and scheduled maintenance support. Warranty varies by model; we’ll guide you per vehicle.",
  },
  {
    keywords: ["offer", "discount", "scheme", "exchange", "bonus"],
    answer:
      "Seasonal offers and exchange bonuses may be available. Share your preferred model and location to get the latest offers.",
  },
  {
    keywords: ["test", "drive", "enquire", "contact", "call"],
    answer:
      "Tap Enquire Now to connect with our team for quotes, test drives, and availability. We respond quickly during business hours.",
  },
];

const QUICK_QUESTIONS = [
  "Which Ace is best for city deliveries?",
  "Share finance/EMI options",
  "Service intervals and warranty",
  "Available offers right now",
  "Compare Intra V30 vs V50",
  "Book a test drive",
];

interface ChatMsg {
  role: "user" | "bot";
  content: string;
}

export default function Chatbot({ inline = false }: { inline?: boolean }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "bot",
      content:
        "Hi! I’m your 24/7 assistant. Ask me about models, prices, finance, service, or tap a quick question below.",
    },
  ]);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const findAnswer = useMemo(
    () => (text: string) => {
      const s = text.toLowerCase();
      let best: { score: number; answer: string } | null = null;
      for (const item of KB) {
        let score = 0;
        for (const k of item.keywords) if (s.includes(k)) score++;
        if (score > 0 && (!best || score > best.score))
          best = { score, answer: item.answer };
      }
      return (
        best?.answer ||
        "I can help with Tata vehicles, finance, service, and offers. Ask anything or tap Enquire Now to talk to our team."
      );
    },
    []
  );

  const reply = (text: string) => {
    const answer = findAnswer(text);
    setIsTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", content: answer }]);
      setIsTyping(false);
    }, 500);
  };

  const send = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setMessages((m) => [...m, { role: "user", content: value }]);
    setInput("");
    reply(value);
  };

  return (
    <>
      {/* Floating button only if not inline */}
      {!inline && !open && (
        <div className="fixed right-4 top-24 z-50">
          <Button
            variant="accent"
            className="shadow-md"
            aria-label="Open 24/7 chat support"
            onClick={() => setOpen(true)}
          >
            <MessageCircle className="mr-2 h-4 w-4" /> Chat Support
          </Button>
        </div>
      )}

      {/* Inline button */}
      {inline && (
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          aria-label="Open chat"
        >
          <MessageCircle className="mr-2 h-4 w-4" /> Chat Support
        </Button>
      )}

      {/* Chat Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="top" className="h-[70vh] p-0">
          <div className="h-full w-full bg-background">
            <div className="border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <div>
                  <h3 className="text-base font-semibold">24/7 Chat Support</h3>
                  <p className="text-xs text-muted-foreground">
                    Ask about models, prices, finance, service and more
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setOpen(false);
                      openEnquiryDialog();
                    }}
                  >
                    Enquire Now
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close chat"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mx-auto grid h-[calc(70vh-65px)] max-w-5xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-3">
              {/* Chat window */}
              <div className="md:col-span-2 flex h-full flex-col rounded-md border bg-card">
                <div
                  ref={listRef}
                  className="flex-1 space-y-3 overflow-y-auto p-4"
                >
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex",
                        m.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                          m.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                        Typing...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t p-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") send();
                      }}
                      placeholder="Type your question..."
                      aria-label="Type your question"
                    />
                    <Button onClick={() => send()} aria-label="Send message">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick help / FAQs */}
              <aside className="hidden h-full flex-col rounded-md border bg-card p-4 md:flex">
                <h4 className="mb-2 text-sm font-medium">Quick questions</h4>
                <div className="flex flex-wrap gap-2">
                  {QUICK_QUESTIONS.map((q) => (
                    <Button
                      key={q}
                      variant="secondary"
                      size="sm"
                      onClick={() => send(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 rounded-md bg-muted p-3 text-xs text-muted-foreground">
                  Tip: You can also tap Enquire Now for a quick call-back from
                  our team.
                </div>
              </aside>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
