'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

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
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState(tones[0].value);
  const [goal, setGoal] = useState(goals[0].value);
  const [freeUses, setFreeUses] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Simulate onboarding email collection
  const handleOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubmitted(true);
    setTimeout(() => setShowOnboarding(false), 1000);
  };

  // Simulate Stripe payment
  const handlePayment = () => {
    setShowPaywall(false);
    setFreeUses(99); // Unlock unlimited
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (freeUses >= 1) {
      setShowPaywall(true);
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/closer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, tone, goal }),
      });
      const data = await res.json();
      setOutput(data.output);
      setFreeUses(freeUses + 1);
    } catch (err) {
      setOutput("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col items-center px-4">
      {/* Onboarding Dialog */}
      <Dialog open={showOnboarding}>
        <DialogContent>
          <div className="max-w-sm mx-auto rounded-2xl shadow-xl">
            <DialogHeader>
              <DialogTitle>
                <span className="text-2xl font-bold">Welcome to DM Closer</span>
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleOnboarding} className="flex flex-col gap-4 mt-2">
              <Label htmlFor="email" className="text-base">Enter your email to get started:</Label>
              <Input
                id="email"
                type="email"
                required
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                placeholder="you@email.com"
                className="h-12 text-lg"
              />
              <Button type="submit" disabled={emailSubmitted} className="h-12 text-lg font-semibold">
                {emailSubmitted ? "Thanks! Redirecting..." : "Continue"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Paywall Dialog */}
      <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
        <DialogContent>
          <div className="max-w-sm mx-auto rounded-2xl shadow-xl">
            <DialogHeader>
              <DialogTitle>
                <span className="text-2xl font-bold">Unlock Unlimited AI Replies</span>
              </DialogTitle>
            </DialogHeader>
            <p className="mb-4 text-gray-300">You’ve used your free reply. Upgrade to Pro for unlimited access!</p>
            <Button className="w-full mb-2 h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors" onClick={handlePayment}>
              Pay $9.99/month (Stripe)
            </Button>
            <Button variant="outline" className="w-full h-12 text-lg font-semibold" onClick={() => setShowPaywall(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center pt-20 pb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center mb-4 tracking-tight drop-shadow-xl leading-tight">
          Close more deals in your DMs — <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">instantly.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 text-center mb-8 max-w-2xl font-medium">
          Paste your convo and let our AI craft the perfect closing message. Designed for creators, closers, and anyone who wants to win more deals.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Button size="lg" className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors shadow-lg">
            Try Free
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-white/30 text-white hover:bg-white/10 transition-colors">
            See Pricing
          </Button>
        </div>
      </section>

      {/* Demo Section */}
      <Card className="w-full max-w-2xl mb-16 bg-white/5 backdrop-blur-2xl border-0 shadow-2xl rounded-3xl">
        <CardHeader>
          <CardTitle>
            <span className="text-2xl font-bold text-white">Try the AI DM Closer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Textarea
              className="bg-black/40 text-white text-lg rounded-xl min-h-[120px]"
              placeholder="Paste your DM conversation here..."
              value={input}
              onChange={e => setInput(e.target.value)}
              required
              rows={6}
            />
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="rounded-lg bg-white/10 text-white border-white/20">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {tones.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label} Tone</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger className="rounded-lg bg-white/10 text-white border-white/20">
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map(g => (
                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading} className="h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors rounded-xl shadow-md">
              {loading ? "Generating..." : "Generate Response"}
            </Button>
          </form>
          {output && (
            <div className="mt-8 bg-white/10 border-0 text-white rounded-xl shadow-md p-4">
              <AlertTitle className="font-bold">AI Reply:</AlertTitle>
              <AlertDescription className="whitespace-pre-line text-lg">{output}</AlertDescription>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Testimonials */}
      <section className="w-full max-w-4xl mb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">What creators are saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-white/5 border-0 rounded-2xl shadow-lg">
              <CardContent>
                <div className="p-6 flex flex-col items-start gap-4">
                  <p className="text-white text-lg font-medium">"{t.text}"</p>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-base font-semibold shadow">{t.name}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="w-full max-w-2xl mb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Pricing</h2>
        <Card className="bg-white/5 border-0 rounded-2xl shadow-xl">
          <CardContent>
            <div className="p-10 flex flex-col items-center gap-4">
              <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">$9.99</div>
              <div className="text-white text-lg mb-2">per month, unlimited AI replies</div>
              <Button onClick={() => setShowPaywall(true)} className="h-12 px-8 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors rounded-xl shadow-md">
                Upgrade Now
              </Button>
              <div className="text-gray-300 text-xs mt-2">7-day money-back guarantee</div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-3xl mb-20">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">FAQ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((f, i) => (
            <Card key={i} className="bg-white/5 border-0 rounded-2xl shadow-md">
              <CardContent>
                <div className="p-6 flex flex-col gap-2">
                  <div className="font-semibold text-white text-lg">{f.q}</div>
                  <div className="text-gray-300 text-base">{f.a}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-10 flex flex-col items-center text-gray-400 text-base border-t border-white/10 mt-auto">
        <div className="mb-2">Omen Studios &copy; {new Date().getFullYear()} &mdash; DM Closer</div>
        <div>
          <a href="mailto:joshomenstudios@gmail.com" className="underline ml-2 hover:text-blue-400 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}
