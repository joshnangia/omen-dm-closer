"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const tones = [
  { label: "Friendly", value: "friendly" },
  { label: "Urgent", value: "urgent" },
  { label: "Luxury", value: "luxury" },
  { label: "Casual", value: "casual" },
];

const goals = [
  { label: "Book a Call", value: "book_call" },
  { label: "Close Sale", value: "close_sale" },
  { label: "Handle Objection", value: "handle_objection" },
];

const testimonials = [
  {
    name: "Sarah L.",
    text: "I closed $2,000 in sales in 2 days using DM Closer. The AI replies are fire!",
  },
  {
    name: "Mike D.",
    text: "I was skeptical, but this tool got me paid instantly. 10/10 recommend.",
  },
];

const faqs = [
  {
    q: "How does DM Closer work?",
    a: "Paste your DM convo, pick your goal, and our AI crafts the perfect closing message.",
  },
  {
    q: "Is my data private?",
    a: "Yes! We never store your conversations.",
  },
  {
    q: "What if I don’t close a deal?",
    a: "We offer a 7-day money-back guarantee if you don’t close a deal.",
  },
];

export default function Home() {
  // Personal AI step
  const [step, setStep] = useState(0);
  const [insta, setInsta] = useState("");
  const [desc, setDesc] = useState("");

  // Demo/AI
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState(tones[0].value);
  const [goal, setGoal] = useState(goals[0].value);
  const [showPaywall, setShowPaywall] = useState(false);
  const [freeTried, setFreeTried] = useState(false);

  // Free try logic using localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setFreeTried(localStorage.getItem("dmcloser_free_try") === "1");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (freeTried) {
      setShowPaywall(true);
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/closer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, tone, goal, insta, desc }),
      });
      const data = await res.json();
      setOutput(data.output);
      setFreeTried(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("dmcloser_free_try", "1");
      }
    } catch (err) {
      setOutput("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handlePayment = () => {
    setShowPaywall(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("dmcloser_free_try", "paid");
    }
    setFreeTried(false); // Unlock unlimited
  };

  // Pills for tone/goal
  const PillGroup = ({ options, value, onChange }: { options: { label: string, value: string }[], value: string, onChange: (v: string) => void }) => (
    <div className="flex gap-2 flex-wrap">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={`px-4 py-2 rounded-full font-semibold transition-all text-sm border
            ${value === opt.value
              ? "bg-black text-white border-black"
              : "bg-white text-black border-gray-300 hover:bg-gray-100"}
          `}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center px-2 sm:px-4 relative overflow-x-hidden">
      {/* Paywall Dialog */}
      <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
        <DialogContent>
          <div className="max-w-sm mx-auto rounded-xl shadow-xl bg-white border border-gray-200 p-6">
            <DialogHeader>
              <DialogTitle>
                <span className="text-2xl font-bold text-black">Unlock Unlimited AI Replies</span>
              </DialogTitle>
            </DialogHeader>
            <p className="mb-4 text-gray-700">You’ve used your free reply. Upgrade to Pro for unlimited access!</p>
            <Button className="w-full mb-2 h-12 text-lg font-semibold bg-black text-white hover:bg-gray-900 transition-colors" onClick={handlePayment}>
              Pay $9.99/month (Stripe)
            </Button>
            <Button
              className="w-full h-12 text-lg font-semibold border border-gray-300 bg-white text-black hover:bg-gray-100"
              onClick={() => setShowPaywall(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center pt-16 pb-8 z-10">
        <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-3xl shadow-2xl p-7 flex flex-col items-center animate-fade-in">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl font-extrabold text-black tracking-tight">DM Closer</span>
            <span className="w-3 h-3 rounded-full bg-black"></span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-black text-center mb-3 tracking-tight leading-tight">
            Close more deals in your DMs
            <br />
            <span className="text-gray-500">instantly.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-700 text-center mb-6 max-w-xs font-medium">
            Paste your convo and let our AI craft the perfect closing message. Designed for creators, closers, and anyone who wants to win more deals.
          </p>
          <Button className="h-12 px-8 text-lg font-bold bg-black text-white hover:bg-gray-900 transition-colors shadow-lg" onClick={() => setStep(1)}>
            Try Free
          </Button>
        </div>
      </section>

      {/* Personal AI Section */}
      {step === 1 && (
        <Card className="w-full max-w-md mb-10 bg-white border border-gray-200 shadow-2xl rounded-3xl animate-fade-in-up z-10">
          <CardHeader>
            <CardTitle>
              <span className="text-2xl font-bold text-black flex items-center gap-2">
                <span className="inline-block w-6 h-6 rounded-full bg-black flex items-center justify-center mr-2">
                  <svg className="w-4 h-4" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" /></svg>
                </span>
                Personalize your AI
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-5" onSubmit={e => { e.preventDefault(); setStep(2); }}>
              <Input
                className="bg-white text-black text-lg rounded-xl border border-gray-300"
                placeholder="Your Instagram handle (e.g. @yourname)"
                value={insta}
                onChange={e => setInsta(e.target.value)}
                required
              />
              <Textarea
                className="bg-white text-black text-lg rounded-xl min-h-[60px] border border-gray-300"
                placeholder="Describe yourself and what you sell/do"
                value={desc}
                onChange={e => setDesc(e.target.value)}
                required
                rows={3}
              />
              <Button type="submit" className="h-12 text-lg font-semibold bg-black text-white hover:bg-gray-900 transition-colors rounded-xl shadow-md">
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Demo Section */}
      {step === 2 && (
        <Card className="w-full max-w-md mb-10 bg-white border border-gray-200 shadow-2xl rounded-3xl animate-fade-in-up z-10">
          <CardHeader>
            <CardTitle>
              <span className="text-2xl font-bold text-black">Try the AI DM Closer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Textarea
                className="bg-white text-black text-lg rounded-xl min-h-[100px] border border-gray-300"
                placeholder="Paste your DM conversation here..."
                value={input}
                onChange={e => setInput(e.target.value)}
                required
                rows={5}
                disabled={freeTried}
              />
              <div>
                <div className="mb-2 text-black font-semibold">Tone</div>
                <PillGroup options={tones} value={tone} onChange={setTone} />
              </div>
              <div>
                <div className="mb-2 text-black font-semibold">Goal</div>
                <PillGroup options={goals} value={goal} onChange={setGoal} />
              </div>
              <Button type="submit" disabled={loading || freeTried} className="h-12 text-lg font-semibold bg-black text-white hover:bg-gray-900 transition-colors rounded-xl shadow-md">
                {freeTried ? "Free try used" : loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full border-2 border-black border-t-transparent w-5 h-5"></span>
                    Generating...
                  </span>
                ) : "Generate Response"}
              </Button>
            </form>
            {output && (
              <div className="mt-7 bg-gray-100 border-0 text-black rounded-xl shadow-md p-4 animate-fade-in">
                <AlertTitle>
                  <span className="font-bold">AI Reply:</span>
                </AlertTitle>
                <AlertDescription>
                  <span className="whitespace-pre-line text-lg">{output}</span>
                </AlertDescription>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* How It Works Section */}
      <section className="w-full max-w-3xl mb-12 animate-fade-in-up flex flex-col md:flex-row items-center gap-8 z-10">
        {/* Steps */}
        <div className="flex-1 flex flex-col gap-6">
          {[{
            title: "Personalize your AI",
            desc: "Tell us your Instagram and what you do. Your AI adapts to you.",
          }, {
            title: "Paste your DM & pick your goal",
            desc: "Drop in your convo, choose your tone and goal.",
          }, {
            title: "Get your perfect reply",
            desc: "AI crafts a closing message that fits you and your prospect.",
          }].map((step, i) => (
            <div key={i} className={`relative bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex items-start gap-4 transition-all duration-500 ${i === 0 ? 'animate-step-in' : ''}`}> 
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-black flex items-center justify-center text-2xl font-extrabold text-white shadow-lg">{i+1}</div>
              <div>
                <div className="text-lg font-bold text-black mb-1">{step.title}</div>
                <div className="text-gray-700 text-base">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Animated Visual (placeholder SVG) */}
        <div className="flex-1 flex justify-center items-center w-full md:w-auto mt-8 md:mt-0">
          <svg className="w-64 h-64 animate-svg-bounce" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="128" cy="128" rx="100" ry="60" fill="#e5e7eb" />
            <ellipse cx="128" cy="128" rx="60" ry="100" fill="#f3f4f6" opacity="0.5" />
            <circle cx="128" cy="128" r="40" fill="#d1d5db" fillOpacity="0.15" />
            <rect x="88" y="88" width="80" height="40" rx="12" fill="#f3f4f6" fillOpacity="0.2" />
            <rect x="108" y="140" width="40" height="20" rx="8" fill="#f3f4f6" fillOpacity="0.2" />
          </svg>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full max-w-md mb-10 animate-fade-in-up z-10">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">What creators are saying</h2>
        <div className="flex flex-col gap-5">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-white border border-gray-200 rounded-2xl shadow-lg">
              <CardContent>
                <div className="p-5 flex flex-col items-start gap-3">
                  <p className="text-black text-base font-medium">"{t.text}"</p>
                  <Badge className="bg-black text-white px-4 py-2 text-base font-semibold shadow">{t.name}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="w-full max-w-md mb-10 animate-fade-in-up z-10">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">Pricing</h2>
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-xl">
          <CardContent>
            <div className="p-8 flex flex-col items-center gap-3">
              <div className="text-4xl font-extrabold text-black mb-1">$9.99</div>
              <div className="text-black text-base mb-1">per month, unlimited AI replies</div>
              <Button onClick={() => setShowPaywall(true)} className="h-12 px-8 text-lg font-bold bg-black text-white hover:bg-gray-900 transition-colors rounded-xl shadow-md">
                Upgrade Now
              </Button>
              <div className="text-gray-700 text-xs mt-1">7-day money-back guarantee</div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-md mb-20 animate-fade-in-up z-10">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">FAQ</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((f, i) => (
            <Card key={i} className="bg-white border border-gray-200 rounded-2xl shadow-md">
              <CardContent>
                <div className="p-5 flex flex-col gap-1">
                  <div className="font-semibold text-black text-base">{f.q}</div>
                  <div className="text-gray-700 text-sm">{f.a}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 flex flex-col items-center text-gray-500 text-sm border-t border-gray-200 mt-auto animate-fade-in-up z-10">
        <div className="mb-1">Omen Studios &copy; {new Date().getFullYear()} &mdash; DM Closer</div>
        <div>
          <a href="mailto:joshomenstudios@gmail.com" className="underline ml-2 hover:text-black transition-colors">Support</a>
        </div>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(0.4,0,0.2,1);
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-svg-bounce {
          animation: svgBounce 2.5s infinite alternate cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes svgBounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-16px) scale(1.04); }
        }
        .animate-step-in {
          animation: stepIn 1.2s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes stepIn {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
