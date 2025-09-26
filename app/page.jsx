"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Shield, Phone, Mail, FileText, Send, X } from "lucide-react";
import Script from "next/script";

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold">{title}</h3>
          <button aria-label="Close" onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-5 prose max-w-none">{children}</div>
      </div>
    </div>
  );
}

export default function Page() {
  const [openPolicy, setOpenPolicy] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [openDisclosure, setOpenDisclosure] = useState(false);
  const [openDNS, setOpenDNS] = useState(false);
  const [consent, setConsent] = useState(false);
  const [formState, setFormState] = useState({ firstName: "", lastName: "", email: "", phone: "", zip: "" });
  const [submitMsg, setSubmitMsg] = useState("");

  const CONTACT = {
    PHONE: "949-842-2484",
    EMAIL: "support@gomejorinsurance.com",
    ADDRESS: "6281 Austin St",
    CITY: "Rego Park",
    STATE: "NY",
    ZIP: "11374",
  };

  const CONSENT_TEXT = `By clicking "Get My Quote" you consent to The Mejor Communications, LLC and Power Group Partners ("Go Mejor Insurance") contacting you by live agents, automated dialers, artificial/prerecorded voice, and SMS/MMS text at the number and email you provided, even if it is on a Do-Not-Call list. Message/data rates may apply. Consent is not a condition of purchase. You also agree to our Privacy Policy and Terms. You authorize Go Mejor Insurance and its Providers to contact you about products and services that may include insurance, financial services, and related offers. You may opt-out at any time by replying STOP or emailing ${CONTACT.EMAIL}.`;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!consent) { setSubmitMsg("Please check the consent box to proceed."); return; }
    const payload = {
      ...formState,
      consentChecked: consent,
      consentText: CONSENT_TEXT,
      timestamp: new Date().toISOString(),
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    };
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitMsg("Thanks! We received your request. A licensed specialist may contact you shortly.");
        setFormState({ firstName: "", lastName: "", email: "", phone: "", zip: "" });
        setConsent(false);
      } else {
        const { error } = await res.json();
        setSubmitMsg(error || "There was an issue submitting your request. Please try again.");
      }
    } catch (err) {
      setSubmitMsg("Network error. Please try again.");
    }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Go Mejor Insurance',
    url: 'https://gomejorinsurance.com/',
    telephone: CONTACT.PHONE,
    email: CONTACT.EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.ADDRESS,
      addressLocality: CONTACT.CITY,
      addressRegion: CONTACT.STATE,
      postalCode: CONTACT.ZIP,
      addressCountry: 'US',
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Script id="org-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            <span className="text-xl font-bold">Go Mejor Insurance</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#why" className="hover:underline">Why Us</a>
            <a href="#how" className="hover:underline">How it Works</a>
            <a href="#contact" className="hover:underline">Contact</a>
            <button onClick={() => setOpenPolicy(true)} className="hover:underline">Privacy</button>
            <button onClick={() => setOpenTerms(true)} className="hover:underline">Terms</button>
          </nav>
        </div>
      </header>

      {/* Hero + Form */}
      <section className="bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-8 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:.4}} className="text-4xl md:text-5xl font-extrabold leading-tight">
              Fast, No-Obligation Quotes
            </motion.h1>
            <p className="mt-4 text-gray-700 text-lg">
              Get matched with a licensed specialist. Simple form. Clear consent. No surprises.
            </p>
            <ul className="mt-6 space-y-2 text-gray-800">
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 mt-0.5"/> Transparent TCPA disclosures</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 mt-0.5"/> 1-to-1 brand, domain, and entity consistency</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 mt-0.5"/> Opt-out any time — reply STOP</li>
            </ul>
          </div>

          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:.1, duration:.4}} className="bg-white shadow-xl rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Tell us about you</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
              <div className="grid md:grid-cols-2 gap-3">
                <input required value={formState.firstName} onChange={e=>setFormState(s=>({...s, firstName:e.target.value}))} placeholder="First name" className="border rounded-xl px-3 py-2"/>
                <input required value={formState.lastName} onChange={e=>setFormState(s=>({...s, lastName:e.target.value}))} placeholder="Last name" className="border rounded-xl px-3 py-2"/>
              </div>
              <input type="email" required value={formState.email} onChange={e=>setFormState(s=>({...s, email:e.target.value}))} placeholder="Email" className="border rounded-xl px-3 py-2"/>
              <input type="tel" required value={formState.phone} onChange={e=>setFormState(s=>({...s, phone:e.target.value}))} placeholder="Phone" className="border rounded-xl px-3 py-2"/>
              <input required value={formState.zip} onChange={e=>setFormState(s=>({...s, zip:e.target.value}))} placeholder="ZIP code" className="border rounded-xl px-3 py-2"/>

              <div className="bg-gray-50 border rounded-xl p-3 text-sm text-gray-700">
                <p>
                  By providing my information below and clicking <strong>Get My Quote</strong>, I agree to the <button type="button" onClick={()=>setOpenPolicy(true)} className="underline">Privacy Policy</button> and <button type="button" onClick={()=>setOpenTerms(true)} className="underline">Terms</button>, and I provide my <strong>express written consent</strong> for The Mejor Communications, LLC and Power Group Partners ("Go Mejor Insurance") and its Providers to contact me at the number and email I provide using live agents, autodialers, artificial/prerecorded voice, and SMS/MMS. Msg/data rates may apply. Consent not required to buy goods/services. I can opt out anytime by replying STOP or emailing {CONTACT.EMAIL}.
                </p>
              </div>

              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1"/>
                <span>I have read and agree and I provide my express written consent as described above.</span>
              </label>

              <button className="mt-1 inline-flex items-center justify-center gap-2 bg-black text-white rounded-xl px-4 py-3 disabled:opacity-60" disabled={!consent}>
                <Send className="w-4 h-4"/> Get My Quote
              </button>
              {submitMsg && <p className="text-sm text-gray-700">{submitMsg}</p>}

              <p className="text-xs text-gray-500">
                You are on <strong>gomejorinsurance.com</strong> operated by <strong>The Mejor Communications, LLC and Power Group Partners</strong> ("Go Mejor Insurance"). This page and all linked policies use the same legal entity and brand name (1:1 requirement).
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Why / How / Contact */}
      <section id="why" className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          {["Clear consent & opt-out","Licensed partner network","Fast matching"].map((t,i)=> (
            <div key={i} className="bg-white rounded-2xl p-6 shadow">
              <h3 className="font-bold text-lg mb-2">{t}</h3>
              <p className="text-gray-700">We prioritize compliance and transparency so you know what you are agreeing to and how to opt out at any time.</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          {["Tell us a bit about you","We match you with a specialist","Get your options"].map((t,i)=> (
            <div key={i} className="rounded-2xl p-6 border">
              <h3 className="font-bold text-lg mb-2">{t}</h3>
              <p className="text-gray-700">Simple steps. No-obligation. We or our Providers may reach out by phone, email, or text.</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          <div className="flex gap-3 items-start"><Phone className="w-5 h-5"/><div><div className="font-semibold">Phone</div><div>{CONTACT.PHONE}</div></div></div>
          <div className="flex gap-3 items-start"><Mail className="w-5 h-5"/><div><div className="font-semibold">Email</div><div>{CONTACT.EMAIL}</div></div></div>
          <div className="flex gap-3 items-start"><FileText className="w-5 h-5"/><div><div className="font-semibold">Address</div><div>{CONTACT.ADDRESS}, {CONTACT.CITY}, {CONTACT.STATE} {CONTACT.ZIP}</div></div></div>
        </div>
      </section>

      <footer className="bg-black text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-sm grid md:grid-cols-2 gap-6">
          <div>
            <div className="font-bold">Go Mejor Insurance</div>
            <div>Operated by The Mejor Communications, LLC and Power Group Partners</div>
            <div>© {new Date().getFullYear()} gomejorinsurance.com — All rights reserved.</div>
          </div>
          <div className="flex gap-4 md:justify-end">
            <button onClick={()=>setOpenDisclosure(true)} className="underline">TCPA Disclosure</button>
            <button onClick={()=>setOpenPolicy(true)} className="underline">Privacy</button>
            <button onClick={()=>setOpenTerms(true)} className="underline">Terms</button>
            <button onClick={()=>setOpenDNS(true)} className="underline">Do Not Sell/Share</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Modal open={openDisclosure} onClose={()=>setOpenDisclosure(false)} title="TCPA Disclosure">
        <p>
          By submitting your information on gomejorinsurance.com, you provide your express written consent for The Mejor Communications, LLC and Power Group Partners ("Go Mejor Insurance") and our Providers to contact you at the phone number and email you provide using live agents, automatic telephone dialing systems, artificial/prerecorded voice, and SMS/MMS text messages. Message and data rates may apply. Consent is not a condition to purchase any goods or services. You may revoke consent at any time by replying STOP to any text or by contacting {CONTACT.EMAIL}.
        </p>
      </Modal>

      <Modal open={openPolicy} onClose={()=>setOpenPolicy(false)} title="Privacy Policy">
        <p>
          This website is owned and operated by The Mejor Communications, LLC and Power Group Partners ("Go Mejor Insurance"). We collect the information you provide (such as name, email, phone, and ZIP) to connect you with our Providers and to contact you as described in the TCPA Disclosure. We also collect technical data such as IP address, user-agent, and page URL for security and compliance logging.
        </p>
        <p>
          We may share your information with Providers to deliver quotes and related services. For more details about categories of information, retention, your rights, and how to exercise them, contact {CONTACT.EMAIL}.
        </p>
      </Modal>

      <Modal open={openTerms} onClose={()=>setOpenTerms(false)} title="Terms of Use">
        <p>
          By using gomejorinsurance.com you agree to these Terms. We are an information and lead-matching service; we do not provide insurance or financial products directly. No guarantees are made regarding availability, eligibility, or pricing. Your use of this site is governed by U.S. law. Disputes may be resolved by binding arbitration where permitted. Do not use this site if you do not agree with these Terms.
        </p>
      </Modal>

      <Modal open={openDNS} onClose={()=>setOpenDNS(false)} title="Do Not Sell or Share My Personal Information">
        <p>
          To exercise your privacy choices, email {CONTACT.EMAIL} with the subject line "Do Not Sell or Share" and include your full name, email, and phone number so we can locate your record. We will process your request as required by applicable law.
        </p>
      </Modal>
    </div>
  );
}
