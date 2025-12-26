import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Timer,
  Workflow,
  Layers,
  LayoutPanelTop,
  Palette,
  Wand2,
  Mail,
} from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CURRENCIES = [
  { key: "USD", symbol: "$", rateToUSD: 1 },
  { key: "EUR", symbol: "€", rateToUSD: 1.08 },
  { key: "CZK", symbol: "Kč", rateToUSD: 0.044 },
];

const DIRECTIONS = [
  {
    id: "logo",
    label: "Logo",
    items: 4,
    rangeUSD: [350, 5250],
    popularUSD: 2800,
    icon: Palette,
  },
  {
    id: "logo-guide",
    label: "Logo & guide",
    items: 3,
    rangeUSD: [1750, 7350],
    popularUSD: 4200,
    icon: Layers,
  },
  {
    id: "guidelines",
    label: "Guidelines",
    items: 3,
    rangeUSD: [700, 3150],
    popularUSD: 1900,
    icon: ShieldCheck,
  },
  {
    id: "brand-book",
    label: "Brand book",
    items: 3,
    rangeUSD: [3850, 12250],
    popularUSD: 7000,
    icon: Workflow,
  },
  {
    id: "ui-kit",
    label: "UI kit",
    items: 3,
    rangeUSD: [700, 4900],
    popularUSD: 2600,
    icon: LayoutPanelTop,
  },
  {
    id: "web-design",
    label: "Web design",
    items: 4,
    rangeUSD: [1750, 14700],
    popularUSD: 4200,
    icon: LayoutPanelTop,
  },
  {
    id: "presentation",
    label: "Presentation",
    items: 1,
    rangeUSD: [360, 3600],
    popularUSD: 950,
    icon: Wand2,
  },
  {
    id: "social",
    label: "Social media",
    items: 1,
    rangeUSD: [525, 4200],
    popularUSD: 1200,
    icon: Sparkles,
  },
];

const PACKAGES = {
  logo: [
    { id: "essential", label: "Essential", baseUSD: 350, days: [3, 5] },
    { id: "standard", label: "Standard", baseUSD: 2800, days: [7, 12], popular: true },
    { id: "pro", label: "Pro", baseUSD: 5250, days: [12, 18] },
  ],
  "logo-guide": [
    { id: "essential", label: "Essential", baseUSD: 1750, days: [7, 10] },
    { id: "standard", label: "Standard", baseUSD: 4200, days: [10, 16], popular: true },
    { id: "pro", label: "Pro", baseUSD: 7350, days: [16, 24] },
  ],
  guidelines: [
    { id: "essential", label: "Essential", baseUSD: 700, days: [4, 7] },
    { id: "standard", label: "Standard", baseUSD: 1900, days: [7, 10], popular: true },
    { id: "pro", label: "Pro", baseUSD: 3150, days: [10, 14] },
  ],
  "brand-book": [
    { id: "essential", label: "Essential", baseUSD: 3850, days: [10, 14] },
    { id: "standard", label: "Standard", baseUSD: 7000, days: [14, 21], popular: true },
    { id: "pro", label: "Pro", baseUSD: 12250, days: [21, 35] },
  ],
  "ui-kit": [
    { id: "essential", label: "Essential", baseUSD: 700, days: [5, 7] },
    { id: "standard", label: "Standard", baseUSD: 2600, days: [7, 12], popular: true },
    { id: "pro", label: "Pro", baseUSD: 4900, days: [12, 18] },
  ],
  "web-design": [
    { id: "essential", label: "Essential", baseUSD: 1750, days: [7, 12] },
    { id: "standard", label: "Standard", baseUSD: 4200, days: [12, 20], popular: true },
    { id: "pro", label: "Pro", baseUSD: 14700, days: [25, 45] },
  ],
  presentation: [
    { id: "essential", label: "Essential", baseUSD: 360, days: [3, 5] },
    { id: "standard", label: "Standard", baseUSD: 950, days: [5, 8], popular: true },
    { id: "pro", label: "Pro", baseUSD: 3600, days: [8, 14] },
  ],
  social: [
    { id: "essential", label: "Essential", baseUSD: 525, days: [2, 4] },
    { id: "standard", label: "Standard", baseUSD: 1200, days: [4, 7], popular: true },
    { id: "pro", label: "Pro", baseUSD: 4200, days: [7, 12] },
  ],
};

const TIMELINES = [
  { id: "standard", label: "Standard timeline", multiplier: 1, hint: "Balanced scope and speed" },
  { id: "rush", label: "Rush", multiplier: 1.25, hint: "Priority execution" },
  { id: "flex", label: "Flexible", multiplier: 0.95, hint: "More flexibility on dates" },
];

const ADDONS = [
  { id: "revisions", label: "Extra revision round", usd: 250 },
  { id: "handoff", label: "Handoff session", usd: 180 },
  { id: "support", label: "Post-launch support", usd: 400 },
  { id: "assets", label: "Social templates pack", usd: 220 },
];

function formatMoney(amountUSD, currencyKey) {
  const c = CURRENCIES.find((x) => x.key === currencyKey) || CURRENCIES[0];
  const value = amountUSD / c.rateToUSD;
  const rounded = currencyKey === "CZK" ? Math.round(value) : Math.round(value);
  return `${c.symbol}${rounded.toLocaleString()}`;
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Pill({ children, tone = "neutral" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs",
        tone === "neutral" && "bg-white/70 text-slate-700",
        tone === "popular" && "bg-orange-50 text-orange-700 border-orange-200",
        tone === "accent" && "bg-blue-50 text-blue-700 border-blue-200"
      )}
    >
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, subtitle, align = "left" }) {
  return (
    <div className={cn("mb-6", align === "center" ? "text-center" : "text-left")}>
      {eyebrow ? (
        <div className={cn("mb-2 text-xs font-medium tracking-wide text-slate-500")}>{eyebrow}</div>
      ) : null}
      <h2 className={cn("text-2xl md:text-3xl font-semibold text-slate-900")}>{title}</h2>
      {subtitle ? <p className="mt-2 text-sm md:text-base text-slate-600">{subtitle}</p> : null}
    </div>
  );
}

function Stat({ value, label, sub }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="text-xl font-semibold text-slate-900">{value}</div>
        <div className="mt-1 text-sm text-slate-600">{label}</div>
        {sub ? <div className="mt-2 text-xs text-slate-500">{sub}</div> : null}
      </CardContent>
    </Card>
  );
}

function CaseCard({ title, tags, desc }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
      <div className="h-40 bg-gradient-to-b from-slate-100 to-slate-50" />
      <CardContent className="p-5">
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Pill key={t} tone="neutral">
              {t}
            </Pill>
          ))}
        </div>
        <div className="mt-3 text-base font-semibold text-slate-900">{title}</div>
        <div className="mt-1 text-sm text-slate-600">{desc}</div>
        <div className="mt-4">
          <Button variant="outline" className="rounded-full">
            View case <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ServiceCard({ icon: Icon, title, bullets }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center">
                <Icon className="h-4 w-4 text-slate-700" />
              </div>
              <div className="text-base font-semibold text-slate-900">{title}</div>
            </div>
          </div>
          <Pill tone="accent">Popular</Pill>
        </div>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 text-slate-400" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center gap-2">
          <Button className="rounded-full" onClick={() => scrollToId("pricing")}>Calculate</Button>
          <Button variant="outline" className="rounded-full">Learn more</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PricingCard({ direction, currency, onCalculate }) {
  const [min, max] = direction.rangeUSD;
  const Icon = direction.icon;
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <Pill tone="neutral">{direction.label}</Pill>
          <div className="text-xs text-slate-500">{direction.items} items</div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center">
            <Icon className="h-4 w-4 text-slate-700" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Indicative</div>
            <div className="text-lg font-semibold text-slate-900">
              {formatMoney(min, currency)} — {formatMoney(max, currency)}
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-500">Final quote depends on scope and timeline.</div>
        <div className="mt-4">
          <Button className="rounded-full" onClick={() => onCalculate(direction.id)}>Calculate project</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CalculatorDialog({ open, onOpenChange, initialDirectionId = "logo", currency }) {
  const [directionId, setDirectionId] = useState(initialDirectionId);
  const [packageId, setPackageId] = useState("standard");
  const [timelineId, setTimelineId] = useState("standard");
  const [addons, setAddons] = useState([]);
  const [step, setStep] = useState(1);

  React.useEffect(() => {
    if (open) {
      setDirectionId(initialDirectionId);
      setPackageId("standard");
      setTimelineId("standard");
      setAddons([]);
      setStep(1);
    }
  }, [open, initialDirectionId]);

  const direction = useMemo(() => DIRECTIONS.find((d) => d.id === directionId) || DIRECTIONS[0], [directionId]);
  const packages = PACKAGES[directionId] || PACKAGES.logo;
  const selectedPackage = packages.find((p) => p.id === packageId) || packages[1];
  const timeline = TIMELINES.find((t) => t.id === timelineId) || TIMELINES[0];

  const addonsSum = addons.reduce((sum, id) => sum + (ADDONS.find((a) => a.id === id)?.usd || 0), 0);
  const totalUSD = Math.round((selectedPackage.baseUSD + addonsSum) * timeline.multiplier);
  const days = selectedPackage.days;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Project calculator</DialogTitle>
          <DialogDescription>Indicative estimate. Final quote is confirmed after brief and scope alignment.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-[1fr_320px]">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">Step {step}/4</div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    disabled={step === 1}
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                  >
                    Back
                  </Button>
                  <Button
                    className="rounded-full"
                    onClick={() => setStep((s) => Math.min(4, s + 1))}
                    disabled={step === 4}
                  >
                    Next
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                {step === 1 ? (
                  <div>
                    <div className="text-sm font-medium text-slate-900">Choose direction</div>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {DIRECTIONS.slice(0, 6).map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setDirectionId(d.id)}
                          className={cn(
                            "text-left rounded-2xl border p-4 transition-colors",
                            d.id === directionId
                              ? "border-blue-300 bg-blue-50"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-slate-900">{d.label}</div>
                            {d.id === directionId ? <Pill tone="accent">Selected</Pill> : <Pill>Option</Pill>}
                          </div>
                          <div className="mt-2 text-xs text-slate-500">
                            Indicative {formatMoney(d.rangeUSD[0], currency)} — {formatMoney(d.rangeUSD[1], currency)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div>
                    <div className="text-sm font-medium text-slate-900">Choose package</div>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {packages.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setPackageId(p.id)}
                          className={cn(
                            "text-left rounded-2xl border p-4 transition-colors",
                            p.id === packageId
                              ? "border-blue-300 bg-blue-50"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-slate-900">{p.label}</div>
                            {p.popular ? <Pill tone="popular">Popular</Pill> : <Pill>Tier</Pill>}
                          </div>
                          <div className="mt-2 text-xs text-slate-500">From {formatMoney(p.baseUSD, currency)}</div>
                          <div className="mt-2 text-xs text-slate-500">Timeline: {p.days[0]}–{p.days[1]} days</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div>
                    <div className="text-sm font-medium text-slate-900">Timeline</div>
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      {TIMELINES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTimelineId(t.id)}
                          className={cn(
                            "text-left rounded-2xl border p-4 transition-colors",
                            t.id === timelineId
                              ? "border-blue-300 bg-blue-50"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-slate-900">{t.label}</div>
                            <Pill tone={t.id === "rush" ? "popular" : t.id === "flex" ? "neutral" : "accent"}>
                              ×{t.multiplier}
                            </Pill>
                          </div>
                          <div className="mt-2 text-xs text-slate-500">{t.hint}</div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-6">
                      <div className="text-sm font-medium text-slate-900">Add-ons</div>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ADDONS.map((a) => {
                          const checked = addons.includes(a.id);
                          return (
                            <button
                              key={a.id}
                              onClick={() =>
                                setAddons((prev) =>
                                  prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id]
                                )
                              }
                              className={cn(
                                "text-left rounded-2xl border p-4 transition-colors",
                                checked
                                  ? "border-blue-300 bg-blue-50"
                                  : "border-slate-200 bg-white hover:bg-slate-50"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-slate-900">{a.label}</div>
                                <Pill tone={checked ? "accent" : "neutral"}>{checked ? "Added" : formatMoney(a.usd, currency)}</Pill>
                              </div>
                              <div className="mt-2 text-xs text-slate-500">Optional</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}

                {step === 4 ? (
                  <div>
                    <div className="text-sm font-medium text-slate-900">Request a proposal</div>
                    <div className="mt-3 grid gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input placeholder="Name" />
                        <Input placeholder="Email" />
                      </div>
                      <Input placeholder="Project link (optional)" />
                      <Textarea placeholder="Short brief (goals, scope, deadline)" className="min-h-[110px]" />
                      <div className="flex flex-wrap gap-2">
                        <Button className="rounded-full">Send request</Button>
                        <Button variant="outline" className="rounded-full">
                          Book a call <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="ghost" className="rounded-full text-slate-600">
                          <Mail className="mr-2 h-4 w-4" /> Email instead
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <Pill tone="popular">Estimate</Pill>
                  <div className="text-xs text-slate-500">{currency}</div>
                </div>
                <div className="mt-3 text-sm text-slate-600">{direction.label} · {selectedPackage.label}</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{formatMoney(totalUSD, currency)}</div>
                <div className="mt-2 text-xs text-slate-500">Timeline: {Math.round(days[0] / timeline.multiplier)}–{Math.round(days[1] / timeline.multiplier)} working days</div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Includes</div>
                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-slate-400" /> Scope alignment</li>
                    <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-slate-400" /> Design + delivery files</li>
                    <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-slate-400" /> Clean handoff</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-slate-700" />
                  <div className="text-sm font-medium text-slate-900">Design support</div>
                </div>
                <div className="mt-2 text-xs text-slate-500">Optional post-launch support is available for all projects.</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function HomePreview() {
  const [currency, setCurrency] = useState("USD");
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcInitialDirection, setCalcInitialDirection] = useState("logo");

  const popular = useMemo(() => {
    const logo = DIRECTIONS.find((d) => d.id === "logo");
    const web = DIRECTIONS.find((d) => d.id === "web-design");
    const ui = DIRECTIONS.find((d) => d.id === "ui-kit");
    return [logo, web, ui].filter(Boolean);
  }, []);

  function openCalculator(directionId) {
    setCalcInitialDirection(directionId);
    setCalcOpen(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-baseline gap-3">
              <div className="text-sm font-semibold">Prakhova Studios</div>
              <div className="text-xs text-slate-500">Brand & product design</div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" className="rounded-full" onClick={() => scrollToId("work")}>Work</Button>
              <Button variant="ghost" className="rounded-full" onClick={() => scrollToId("services")}>Services</Button>
              <Button variant="ghost" className="rounded-full" onClick={() => scrollToId("pricing")}>Pricing</Button>
              <Button variant="ghost" className="rounded-full" onClick={() => scrollToId("process")}>Process</Button>
              <Button variant="outline" className="rounded-full" onClick={() => scrollToId("pricing")}>Pricing overview</Button>
              <Button className="rounded-full" onClick={() => openCalculator("web-design")}>
                Calculate project
              </Button>
            </div>
            <div className="md:hidden">
              <Button className="rounded-full" size="sm" onClick={() => openCalculator("web-design")}>
                Calculate
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-10">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Brand identity and product design for tech teams
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-600 max-w-xl">
              Logos, visual systems, UI kits, and marketing assets — with a clear process, predictable timelines,
              and clean handoff.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button className="rounded-full" onClick={() => openCalculator("web-design")}>
                Get an estimate <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => scrollToId("work")}>
                View work
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Pill tone="neutral"><Timer className="mr-1.5 h-3.5 w-3.5" /> Reply in 24–48h</Pill>
              <Pill tone="neutral"><Workflow className="mr-1.5 h-3.5 w-3.5" /> Clear stages</Pill>
              <Pill tone="neutral"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Post-launch support</Pill>
              <Pill tone="neutral"><Layers className="mr-1.5 h-3.5 w-3.5" /> Developer-ready handoff</Pill>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span><strong className="text-slate-900">Indicative estimate</strong> — final quote is confirmed after brief and scope alignment.</span>
            </div>
          </div>

          {/* Popular card */}
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Pill tone="popular">Popular</Pill>
                <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setCurrency(c.key)}
                      className={cn(
                        "px-3 py-1 text-xs rounded-full transition-colors",
                        currency === c.key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {c.key}
                    </button>
                  ))}
                </div>
              </div>
              <CardTitle className="text-base mt-3">Typical starting points</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="space-y-3">
                {popular.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => openCalculator(d.id)}
                    className="w-full text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-slate-900">{d.label}</div>
                      <div className="text-sm font-semibold text-slate-900">{formatMoney(d.popularUSD, currency)}</div>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Standard package</div>
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <Button variant="outline" className="w-full rounded-full" onClick={() => scrollToId("pricing")}>
                  Pricing overview <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trusted by */}
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-xs text-slate-500">Trusted by teams and founders</div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              "Zeta — product UI",
              "KUKA — brand assets",
              "Disqus — design support",
              "EarX — web design",
              "Studio A — identity",
              "Fintech B — UI kit",
            ].map((x) => (
              <div
                key={x}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600"
              >
                {x}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Work */}
      <div id="work" className="mx-auto max-w-6xl px-4 pb-14">
        <SectionTitle
          eyebrow="Selected"
          title="Featured work"
          subtitle="A small selection of projects with clear deliverables and clean handoff."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <CaseCard
            title="Fintech dashboard redesign"
            tags={["Product UI", "Design system", "Handoff"]}
            desc="Refined information hierarchy and built reusable components for faster shipping."
          />
          <CaseCard
            title="Brand identity for a Web3 protocol"
            tags={["Logo", "Visual system", "Brand book"]}
            desc="A bold, corporate-ready identity with a strong symbol and consistent rules."
          />
          <CaseCard
            title="Launch visuals and marketing pack"
            tags={["Motion", "Social", "3D"]}
            desc="A coherent asset pack for launch: templates, motion snippets, and visual rhythm."
          />
        </div>
      </div>

      {/* Services */}
      <div id="services" className="mx-auto max-w-6xl px-4 pb-14">
        <SectionTitle
          eyebrow="Services"
          title="What I build"
          subtitle="Focused offerings that cover the most common founder and product needs."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <ServiceCard
            icon={Palette}
            title="Brand identity"
            bullets={["Logo system (primary + variants)", "Color and type direction", "Usage rules and assets", "Delivery files for product and marketing"]}
          />
          <ServiceCard
            icon={LayoutPanelTop}
            title="UI kit and design system"
            bullets={["Component library", "Layout and spacing rules", "States and interactions", "Developer-ready specs"]}
          />
          <ServiceCard
            icon={Layers}
            title="Brand book"
            bullets={["Identity rules", "Typography and colors", "Composition and imagery", "Templates and examples"]}
          />
          <ServiceCard
            icon={Wand2}
            title="Motion and launch assets"
            bullets={["Micro-animations", "Social templates", "Short promo visuals", "Consistent motion language"]}
          />
        </div>
      </div>

      {/* Process */}
      <div id="process" className="mx-auto max-w-6xl px-4 pb-14">
        <SectionTitle
          eyebrow="Process"
          title="How it works"
          subtitle="Clear stages, fixed checkpoints, and predictable delivery."
        />
        <div className="grid gap-4 md:grid-cols-5">
          {[
            { t: "Brief", d: "Goals, scope, constraints" },
            { t: "Direction", d: "Research and positioning" },
            { t: "Concepts", d: "Core options to choose from" },
            { t: "Refinement", d: "Iterations + rules" },
            { t: "Delivery", d: "Files + handoff + support" },
          ].map((s) => (
            <Card key={s.t} className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="text-sm font-semibold text-slate-900">{s.t}</div>
                <div className="mt-2 text-xs text-slate-500">{s.d}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing preview */}
      <div id="pricing" className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <SectionTitle
            eyebrow="Pricing"
            title="Pricing preview"
            subtitle="Quick orientation by direction. Build the exact estimate in the calculator."
          />
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-500">Currency</div>
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">
              {CURRENCIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCurrency(c.key)}
                  className={cn(
                    "px-3 py-1 text-xs rounded-full transition-colors",
                    currency === c.key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {c.key}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {DIRECTIONS.slice(0, 6).map((d) => (
            <PricingCard
              key={d.id}
              direction={d}
              currency={currency}
              onCalculate={(id) => openCalculator(id)}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Button className="rounded-full" onClick={() => openCalculator("web-design")}>
            Calculate project online <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => scrollToId("faq")}>FAQ</Button>
          <div className="text-xs text-slate-500">Final quote is confirmed after brief and scope alignment.</div>
        </div>
      </div>

      {/* Numbers */}
      <div className="mx-auto max-w-6xl px-4 pb-14">
        <SectionTitle
          eyebrow="Proof"
          title="Numbers speak louder than words"
          subtitle="Use numbers that you can confidently defend. If you don’t want to show metrics, keep this block smaller."
        />
        <div className="grid gap-4 md:grid-cols-4">
          <Stat value="7+ years" label="Experience" sub="Across brand and product work" />
          <Stat value="500+ projects" label="Delivered" sub="Logos to full systems" />
          <Stat value="Fast reply" label="24–48h" sub="On new inquiries" />
          <Stat value="Clean handoff" label="Dev-ready" sub="Components and specs" />
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" className="mx-auto max-w-6xl px-4 pb-14">
        <SectionTitle
          eyebrow="FAQ"
          title="Common questions"
          subtitle="Short answers that remove friction before a request."
        />
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="a1">
                <AccordionTrigger className="px-4">Is the estimate final?</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-600">
                  The calculator provides an indicative estimate. The final quote is confirmed after a brief and scope alignment.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="a2">
                <AccordionTrigger className="px-4">How many revision rounds are included?</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-600">
                  It depends on the package. You can add an extra revision round as an add-on.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="a3">
                <AccordionTrigger className="px-4">What do you need from me to start?</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-600">
                  A short brief: goals, target audience, competitors (optional), and any constraints. If you don’t have it, we can build it together.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="a4">
                <AccordionTrigger className="px-4">Do you support development?</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-600">
                  Yes. I can join handoff calls, prepare specs, and support implementation as needed.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Final CTA */}
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-2xl font-semibold">Ready to scope your project?</div>
              <div className="mt-2 text-sm text-slate-600">Get an estimate online or send a short brief — I reply within 24–48h.</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="rounded-full" onClick={() => openCalculator("web-design")}>
                Get an estimate <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="rounded-full">
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div>
              <div className="text-sm font-semibold">Prakhova Studios</div>
              <div className="mt-2 text-xs text-slate-500">Brand identity · UI kits · Web design</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <div className="font-medium">Explore</div>
                <button className="text-slate-600 hover:text-slate-900" onClick={() => scrollToId("work")}>Work</button>
                <button className="text-slate-600 hover:text-slate-900" onClick={() => scrollToId("services")}>Services</button>
                <button className="text-slate-600 hover:text-slate-900" onClick={() => scrollToId("pricing")}>Pricing</button>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Company</div>
                <div className="text-slate-600">Prague, EU</div>
                <div className="text-slate-600">Support available</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Contact</div>
                <div className="text-slate-600">hello@prakhova.studio</div>
                <div className="text-slate-600">Telegram: @prakhova</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CalculatorDialog
        open={calcOpen}
        onOpenChange={setCalcOpen}
        initialDirectionId={calcInitialDirection}
        currency={currency}
      />
    </div>
  );
}
