'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

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
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState(tones[0].value);
  const [goal, setGoal] = useState(goals[0].value);
  const [freeUses, setFreeUses] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Simulate onboarding email collection
  const handleOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send email to Resend or your provider here
    setEmailSubmitted(true);
    setTimeout(() => setShowOnboarding(false), 1000);
  };

  // Simulate Stripe payment
  const handlePayment = () => {
    // TODO: Integrate Stripe checkout here
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
    setOutput('');
    try {
      const res = await fetch('/api/closer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, tone, goal }),
      });
      const data = await res.json();
      setOutput(data.output);
      setFreeUses(freeUses + 1);
    } catch (err) {
      setOutput('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center">
      {/* Onboarding Dialog */}
      <Dialog open={showOnboarding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to DM Closer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleOnboarding} className="flex flex-col gap-4">
            <Label htmlFor="email">Enter your email to get started:</Label>
            <Input
              id="email"
              type="email"
              required
              value={userEmail}
              onChange={e => setUserEmail(e.target.value)}
              placeholder="you@email.com"
            />
            <Button type="submit" disabled={emailSubmitted}>
              {emailSubmitted ? "Thanks! Redirecting..." : "Continue"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Paywall Dialog */}
      <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Unlimited AI Replies</DialogTitle>
          </DialogHeader>
          <p className="mb-4">You’ve used your free reply. Upgrade to Pro for unlimited access!</p>
          <Button className="w-full mb-2" onClick={handlePayment}>
            Pay $9.99/month (Stripe)
          </Button>
          <Button variant="outline" className="w-full" onClick={() => setShowPaywall(false)}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-2 drop-shadow-lg">
          Close more deals in your DMs — <span className="text-blue-400">instantly.</span>
        </h1>
        <p className="text-gray-200 text-center mb-6 max-w-xl">
          Paste your convo and let our AI craft the perfect closing message.
        </p>
      </section>

      {/* Demo Section */}
      <Card className="w-full max-w-xl mb-10 bg-white/10 backdrop-blur-2xl border-white/20">
        <CardHeader>
          <CardTitle>Try the AI DM Closer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
              className="bg-black/40 text-white"
              placeholder="Paste your DM conversation here..."
              value={input}
              onChange={e => setInput(e.target.value)}
              required
              rows={6}
            />
            <div className="flex gap-2">
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {tones.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label} Tone</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map(g => (
                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate Response"}
            </Button>
          </form>
          {output && (
            <Alert className="mt-6 bg-white/20 border-white/30 text-white">
              <AlertTitle>AI Reply:</AlertTitle>
              <AlertDescription className="whitespace-pre-line">{output}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Testimonials */}
      <section className="w-full max-w-2xl mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">What creators are saying</h2>
        <div className="flex flex-col md:flex-row gap-4">
          {testimonials.map((t, i) => (
            <Card key={i} className="flex-1 bg-white/10 border-white/20">
              <CardContent className="p-4">
                <p className="text-white mb-2">"{t.text}"</p>
                <Badge variant="secondary">{t.name}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="w-full max-w-xl mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Pricing</h2>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-4xl font-extrabold text-blue-400 mb-2">$9.99</div>
            <div className="text-white mb-2">per month, unlimited AI replies</div>
            <Button onClick={() => setShowPaywall(true)}>Upgrade Now</Button>
            <div className="text-gray-300 text-xs mt-2">7-day money-back guarantee</div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-2xl mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">FAQ</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((f, i) => (
            <Card key={i} className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="font-semibold text-white">{f.q}</div>
                <div className="text-gray-200">{f.a}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 flex flex-col items-center text-gray-400 text-sm">
        <div>Omen Studios &copy; {new Date().getFullYear()} &mdash; DM Closer</div>
        <div>
          <a href="mailto:joshomenstudios@gmail.com" className="underline ml-2">Support</a>
        </div>
      </footer>
    </div>
  );
}
