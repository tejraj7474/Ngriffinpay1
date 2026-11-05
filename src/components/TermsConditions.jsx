// TermsConditions.jsx
// NGriffinpay — Terms & Conditions page
// Section 1: Hero — a realistic agreement sheet (signature draws itself, "Accepted" stamp drops in)
// Section 2: Key points at a glance — short summary cards that jump to the full clause
// Section 3: The full terms on a "paper" document with a sticky section index,
//            search-in-terms with highlights, reading progress, print button.
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed — no extra packages needed)

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { I } from "../data";
import "./TermsConditions.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content (as provided — do not edit wording here without legal review) */
/* ------------------------------------------------------------------ */

const LAST_UPDATED = ""; // e.g. "November 5, 2026" — shown in the hero & document header when filled

const PREAMBLE = {
  title: "Covenants for Utilizing the Website",
  text: "Please carefully review this Agreement and discontinue using the Services immediately if you do not agree to its terms. These Terms and Conditions govern the utilization of this Service and outline the agreement between You and Ngriffin. They delineate the rights and responsibilities of all users concerning the Service and accessing the Website (www.ngriffin.com). Your access to and use of the Service are contingent upon Your acceptance of and adherence to these Terms and Conditions. They are applicable to all visitors, users, and others who access or use the Service. By accessing or using the Service, You acknowledge Your consent to be bound by these Terms and Conditions. If You dissent from any aspect of these Terms and Conditions, You are not authorized to access the Service. You affirm that you are at least 18 years old. The Company does not allow individuals under 18 to utilize the Service. Your access to and utilization of the Service also necessitate Your acceptance of and compliance with the Company's Privacy Policy. Our Privacy Policy outlines Our practices and protocols regarding the gathering, utilization, and disclosure of Your personal information when You utilize the Application or the Website, and it elucidates Your privacy rights and the legal protections afforded to You. Please carefully review Our Privacy Policy before utilizing Our Service and Website.",
};

const SECTIONS = [
  {
    n: 1, title: "Introduction", icon: "info",
    clauses: [
      ["1.1", "Our company operates within the technology sector, specializing in the creation of software solutions aimed at streamlining work processes and enhancing user experience. Our flagship product, Simpliance, is designed to assist clients in adhering to statutory regulations mandated by law. Simpliance empowers subscribers and clients to proactively manage compliance, offering features such as dynamic compliance monitoring, comprehensive compliance reporting, a centralized repository for compliance documents, and an integrated audit tool for enhanced efficiency."],
    ],
  },
  {
    n: 2, title: "Purpose", icon: "target",
    clauses: [
      ["2.1", "Our objective is to furnish an online plug-and-play compliance application, simplifying the process of organizational compliance, thus ensuring ease in achieving regulatory adherence."],
    ],
  },
  {
    n: 3, title: "Website Utilization", icon: "globe",
    clauses: [
      ["3.1", "The Website shall exclusively serve lawful intentions."],
      ["3.2", "Utilization or entry of the Website does not grant any or all privileges to utilize or vend any of the content accessible on the Website."],
      ["3.3", "Ngriffin retains the authority to observe the conduct on its website and cease or limit website usage if any user violates the terms and conditions outlined herein."],
    ],
  },
  {
    n: 4, title: "Account Conditions", icon: "user",
    clauses: [
      ["4.1", "You must be 18 years or older to use this service."],
      ["4.2", "You are obligated to furnish your complete legal name, a functional email address, and any other necessary details for the completion of the registration procedure. Upon creating an account with us, it is imperative that you supply us with information that is precise, thorough, and up-to-date at all times. Neglecting to do so will be considered a violation of the Terms of Service, potentially leading to the immediate termination of your account on our platform."],
      ["4.3", "You recognize that you have perused, comprehended, and embraced this Agreement, and you possess the authorization to represent any individual or entity for whom you are utilizing the Services. Moreover, you are considered to have consented to this Agreement on behalf of any entity for whom you utilize the Services."],
      ["4.4", "You undertake not to reveal your password or user id to any third party. Promptly inform Us upon discovering any security breach or unauthorized access to Your account."],
      ["4.5", "You are prohibited from utilizing a username that belongs to another individual or entity, or one that is not legally obtainable for use. Additionally, refrain from selecting a username that represents a trademark or name belonging to another entity without proper authorization. Avoid selecting usernames that are offensive, vulgar, or obscene in nature."],
      ["4.6", "Ngriffin may correspond with you via email regarding your account, system updates, or other matters pertaining to your account."],
      ["4.7", "You are accountable for all content posted and activity that transpires under your account."],
    ],
  },
  {
    n: 5, title: "Payment Conditions", icon: "rupee",
    clauses: [
      ["5.1", "We will levy a fixed fee according to your account plan. The Service is charged upfront and is non-reimbursable. No reimbursements or credits will be issued for incomplete months of service or for periods when you do not utilize the Service while your account remains active. No deviations from this policy will be entertained."],
    ],
  },
  {
    n: 6, title: "Alterations to the Services", icon: "refresh",
    clauses: [
      ["6.1", "Ngriffin retains the authority to alter, suspend, or terminate the Service at any given time, for any rationale, with or without prior notification."],
    ],
  },
  {
    n: 7, title: "Abrogation and Conclusion", icon: "power",
    clauses: [
      ["7.1", "You are exclusively accountable for appropriately terminating Your account. You have the option to terminate your account at any juncture by reaching out to your designated Account Manager via email at the provided official contact information. Termination is possible at any moment, but you will continue to be responsible for all fees incurred until that point, encompassing the complete monthly charges for the month in which you ceased service. No further charges will be incurred."],
      ["7.2", "Ngriffin retains the authority to (i) alter or cease, either temporarily or permanently, the provision of the Service (or any portion thereof) and (ii) reject any and all, present and future usage of the Service, pause or terminate your account (in whole or in part), or usage of the Service and erase and discard any of your content within the Service, for any reason, including if Ngriffin deems that you have breached these Terms Of Service. Ngriffin will make every reasonable effort to directly notify you via email prior to suspending or terminating your account. Any suspected instances of fraudulent, abusive, or unlawful activity that may warrant the termination of your Service usage may be reported to the appropriate law enforcement authorities. Ngriffin shall bear no responsibility to you or any third party for any alterations, suspensions, or discontinuations of the Service."],
    ],
  },
  {
    n: 8, title: "Intellectual Property Rights and Ownership", icon: "shield",
    clauses: [
      ["8.1", "Ngriffin possesses the intellectual property rights to all safeguardable elements of the Service, encompassing, yet not restricted to, the Service's name, visual assets, user interface elements, pre-configured compliance data integrated within the Service, numerous individual functionalities, and associated documentation. You are prohibited from replicating, altering, adjusting, reproducing, disseminating, reverse engineering, decompiling, or dismantling any facet of the Service owned by Ngriffin."],
    ],
  },
  {
    n: 9, title: "Guidelines", icon: "book",
    clauses: [
      ["9.1", "Ngriffin retains and reserves all intellectual property rights of any or all content posted on the Website."],
      ["9.2", "Users may not hence employ such content in any manner that exceeds what is essential or implied in the appropriate utilization of the Service and the Website."],
      ["9.3", "Specifically, but not exclusively, Users are prohibited from duplicating, downloading, distributing (beyond specified restrictions), altering, translating, converting, releasing, transmitting, vending, sublicensing, editing, transferring/assigning to external parties, or generating derivative materials from the content accessible on the Website, nor permitting any third party to do so via the User or their device, even inadvertently."],
      ["9.4", "Where expressly stated on the Website, the User may download, copy, and/or share restricted content available through the Website for its exclusive personal and non-commercial use, on the condition that the copyright attributions and all other attributions required by Ngriffin are accurately implemented."],
    ],
  },
  {
    n: 10, title: "Hyperlinks to external sites", icon: "link",
    clauses: [
      ["10.1", "The Website may contain links to third-party websites or services that are not owned or supervised by Ngriffin."],
      ["10.2", "Ngriffin disclaims any control over, and absolves itself from any accountability for, the content, privacy policies, or practices of any third-party websites or services. Additionally, you acknowledge and consent that Ngriffin shall not be held responsible or liable, whether directly or indirectly, for any harm or detriment purportedly caused by or associated with the utilization of or dependence on any such content, products, or services accessible through any such websites or services."],
      ["10.3", "We highly recommend that you review the terms and conditions and privacy policies of any third-party websites or services that you visit."],
    ],
  },
  {
    n: 11, title: "General Provisions and Limitations", icon: "alert",
    clauses: [
      ["11.1", "Your utilization of the Service and the Website, encompassing all content, information, or functionality it encompasses, is delivered \"as is\" with no assurance or guarantees of any nature, whether expressly stated or implied, comprising but not restricted to the implicit assurances of merchantability, suitability for a specific intention, and non-infringement. You bear full responsibility and assume all risks associated with your utilization of this Service."],
      ["11.2", "You undertake not to resell, replicate, duplicate, or exploit, plagiarize, craft a derivative work of, reverse engineer, disassemble, dismantle, or decompile the Software or any portion thereof, or endeavor in any manner to uncover any source code or alter the Software in any form without the explicit written consent of Ngriffin."],
      ["11.3", "You are prohibited from utilizing the service for storing, hosting, or transmitting unsolicited email (spam) or SMS messages."],
      ["11.4", "Ngriffin will uphold commercially acceptable administrative, physical, and technical measures to safeguard the security, confidentiality, and integrity of your data."],
      ["11.5", "You are prohibited from utilizing the service to disseminate any viruses, worms, or malicious content."],
      ["11.6", "You must not allow any affiliate, User, or any other third party to gain unauthorized entry to the Software (including, but not limited to, allowing access to or utilization of the Software through another system or tool, which primarily facilitates the input of requests or transactions by individuals not authorized as Users)."],
      ["11.7", "Ngriffin provides no assurances concerning (i) your capability to utilize the Service, (ii) your contentment with the Service, (iii) the perpetual availability of the Service, without interruption, and devoid of errors, (iv) the precision of mathematical computations executed by the Service, (v) the precision of the statutes and regulations encompassed within the Service, and (vi) the rectification of glitches or inaccuracies within the Service."],
      ["11.8", "Ngriffin, its affiliates, and its sponsors disclaim any responsibility or liability for any direct, indirect, incidental, consequential, special, exemplary, punitive, or other damages resulting from or connected in any manner to your utilization of the Service and Website. Your exclusive recourse for dissatisfaction with the Service is to discontinue your use of the Service and Website."],
      ["11.9", "If any provision of the Terms of Service is deemed invalid or otherwise unenforceable, the enforceability of the remaining provisions shall not be affected thereby."],
      ["11.10", "Ngriffin reserves the right, at its discretion, to delete content and accounts that we deem, in our sole judgment, to be illegal, offensive, menacing, slanderous, derogatory, sexually explicit, indecent, or in violation of any party's intellectual property rights or the Terms of Service."],
      ["11.11", "The failure of Ngriffin to exercise any right provided for herein shall not be considered a relinquishment of any right hereunder. The Terms of Service delineate the complete agreement between you and Ngriffin concerning the Service and override any previous agreements between you and Ngriffin (including, but not limited to, prior iterations of the Terms of Service)."],
    ],
  },
  {
    n: 12, title: "Regulatory Statute", icon: "scale",
    clauses: [
      ["12.1", "These Terms of Services shall be regulated by the laws of Madurai, Tamil Nadu, India without consideration for the principles of conflicts of law. You hereby expressly consent to abide by the exclusive personal jurisdiction of the state courts of the State of Tamil Nadu for the purpose of settling any dispute pertaining to your access to or utilization of the Service."],
    ],
  },
  {
    n: 13, title: "Amendments to the Terms and Conditions", icon: "edit",
    clauses: [
      ["13.1", "Ngriffin retains the authority, at its sole discretion, to amend or substitute these Terms at any time."],
    ],
  },
  {
    n: 14, title: "Severance and Forbearance", icon: "split",
    clauses: [
      ["14.1", "**Separability** - If any clause of these Terms is deemed unenforceable or void, said clause will be modified and construed to achieve the intended purpose to the fullest extent permissible under the law, while the remaining clauses shall remain in full force and effect."],
      ["14.2", "**Renunciation** – Save as stipulated herein, the omission to exercise a right or to demand performance of an obligation under these Terms shall not impede a person’s capability to exercise such right or demand such performance at any subsequent time, nor shall the renouncement of a violation constitute a renouncement of any subsequent violation."],
    ],
  },
];

// Plain-language summary cards (a reading aid — the full clauses below always prevail)
const GLANCE = [
  { icon: "user", title: "18+ only", text: "You must be at least 18 years old to use the Service.", to: 4 },
  { icon: "lock", title: "Keep your account safe", text: "Give accurate details and never share your password or user id.", to: 4 },
  { icon: "rupee", title: "Fees are charged upfront", text: "Plan fees are paid in advance and are non-refundable.", to: 5 },
  { icon: "power", title: "Cancel any time", text: "Contact your Account Manager by email; fees apply until the month you stop.", to: 7 },
  { icon: "shield", title: "Our IP stays ours", text: "No copying, reselling or reverse engineering of the Service or content.", to: 8 },
  { icon: "scale", title: "Governing law", text: "Laws of Tamil Nadu, India; Tamil Nadu state courts have jurisdiction.", to: 12 },
];

const TOTAL_WORDS = [PREAMBLE.text, ...SECTIONS.flatMap((s) => s.clauses.map((c) => c[1]))].join(" ").split(/\s+/).length;
const READ_MIN = Math.max(1, Math.round(TOTAL_WORDS / 200));
const secId = (n) => `tnc-sec-${n}`;

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function Icon({ name, size = 18 }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  switch (name) {
    case "info": return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>;
    case "target": return <svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>;
    case "globe": return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>;
    case "user": return <svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></svg>;
    case "rupee": return <svg {...p}><path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 0 0 0-10" /></svg>;
    case "refresh": return <svg {...p}><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>;
    case "power": return <svg {...p}><path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10" /></svg>;
    case "shield": return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case "book": return <svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" /><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" /></svg>;
    case "link": return <svg {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
    case "alert": return <svg {...p}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></svg>;
    case "scale": return <svg {...p}><path d="M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z" /></svg>;
    case "edit": return <svg {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>;
    case "split": return <svg {...p}><path d="M16 3h5v5M8 3H3v5M21 3l-7 7M3 3l7 7M12 22V12" /></svg>;
    case "lock": return <svg {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;
    case "search": return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
    case "print": return <svg {...p}><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>;
    case "arrow": return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "up": return <svg {...p}><path d="M12 19V5M6 11l6-6 6 6" /></svg>;
    case "x": return <svg {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>;
    case "doc": return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></svg>;
    case "check": return <svg {...p} strokeWidth={3}><path d="M20 6 9 17l-5-5" /></svg>;
    default: return null;
  }
}

/* ---------- text with **bold** + search highlight ---------- */
function Mark({ text, q }) {
  const bolded = String(text).split("**");
  const esc = q ? q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
  const re = esc ? new RegExp(`(${esc})`, "gi") : null;
  const hl = (t, k) => (re ? t.split(re).map((part, i) => (i % 2 ? <mark key={`${k}-${i}`}>{part}</mark> : <Fragment key={`${k}-${i}`}>{part}</Fragment>)) : t);
  return bolded.map((t, i) => (i % 2 ? <strong key={i}>{hl(t, i)}</strong> : <Fragment key={i}>{hl(t, i)}</Fragment>));
}

const matches = (text, q) => !q || text.toLowerCase().includes(q.toLowerCase());

/* ------------------------------------------------------------------ */
/* Section 1 — Hero with agreement sheet                               */
/* ------------------------------------------------------------------ */

function TermsHero({ onRead, onPrint }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const sig = rootRef.current.querySelector(".tnc-sig path");
      const len = sig ? sig.getTotalLength() : 400;
      gsap.set(sig, { strokeDasharray: len, strokeDashoffset: len });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".tnc-hero-copy > *", { y: 26, opacity: 0, stagger: 0.08, duration: 0.6 })
        .from(".tnc-sheet.back", { y: 60, rotation: 0, opacity: 0, duration: 0.7 }, "-=0.4")
        .from(".tnc-sheet.front", { y: 80, rotation: 0, opacity: 0, duration: 0.8 }, "-=0.55")
        .from(".tnc-line", { scaleX: 0, transformOrigin: "0 50%", stagger: 0.03, duration: 0.35, ease: "power2.out" }, "-=0.4")
        .from(".tnc-tick", { scale: 0, stagger: 0.12, duration: 0.3, ease: "back.out(3)" }, "-=0.2")
        .to(sig, { strokeDashoffset: 0, duration: 1.4, ease: "power1.inOut" }, "-=0.1")
        .fromTo(".tnc-stamp", { scale: 2.4, opacity: 0, rotation: -40 }, { scale: 1, opacity: 1, rotation: -14, duration: 0.45, ease: "power4.in" })
        .to(".tnc-sheet.front", { x: 3, duration: 0.05, repeat: 3, yoyo: true, ease: "none" })
        .from(".tnc-float", { y: 20, opacity: 0, stagger: 0.12, duration: 0.5 }, "-=0.1");
      gsap.to(".tnc-pen", { rotation: -8, y: -6, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="tnc-hero" ref={rootRef}>
      <div className="tnc-hero-bg" aria-hidden><span className="tnc-blob b1" /><span className="tnc-blob b2" /><span className="tnc-grid-bg" /></div>
      <div className="tnc-container tnc-hero-grid">
        <div className="tnc-hero-copy">
          <span className="tnc-eyebrow"><Icon name="scale" size={14} /> Legal</span>
          <h1>Terms <span>&amp;</span> Conditions</h1>
          <p className="tnc-sub">{PREAMBLE.title}</p>
          <p className="tnc-lead">Please read these terms carefully. By accessing or using the Service and the Website, you agree to be bound by them.</p>
          <div className="tnc-chips">
            <span><Icon name="doc" size={14} /> {SECTIONS.length} sections</span>
            <span><Icon name="book" size={14} /> ~{READ_MIN} min read</span>
            {LAST_UPDATED && <span><Icon name="edit" size={14} /> Updated {LAST_UPDATED}</span>}
          </div>
          <div className="tnc-actions">
            <button type="button" className="tnc-btn" onClick={onRead}>Read the terms <Icon name="arrow" size={16} /></button>
            <button type="button" className="tnc-btn ghost" onClick={onPrint}><Icon name="print" size={16} /> Print / Save PDF</button>
          </div>
        </div>

        <div className="tnc-visual" aria-hidden>
          <div className="tnc-sheet back" />
          <div className="tnc-sheet front">
            <div className="tnc-sheet-head">
              <span className="tnc-sheet-logo"><img src={I("ngriffinpay-mark.png")} alt="" /></span>
              <div>
                <b>Service Agreement</b>
                <small>Terms &amp; Conditions</small>
              </div>
              <span className="tnc-sheet-no">No. T&amp;C/01</span>
            </div>
            {[1, 2, 3, 4].map((k) => (
              <div className="tnc-sheet-clause" key={k}>
                <span className="tnc-tick"><Icon name="check" size={9} /></span>
                <div>
                  <span className="tnc-line t" style={{ width: `${[52, 64, 46, 58][k - 1]}%` }} />
                  <span className="tnc-line" />
                  <span className="tnc-line" style={{ width: `${[88, 72, 94, 80][k - 1]}%` }} />
                </div>
              </div>
            ))}
            <div className="tnc-sign-row">
              <div className="tnc-sign">
                <svg className="tnc-sig" viewBox="0 0 200 60"><path d="M6 44c14-24 22-34 26-28s-10 30-2 30 18-32 26-30-6 26 2 26 12-18 18-18 2 16 10 14 10-12 16-12 4 10 10 10 14-8 22-10 18 2 26 0" /></svg>
                <span className="tnc-sign-line" />
                <small>Authorised signatory</small>
              </div>
              <div className="tnc-stamp">
                <span>NGRIFFIN</span>
                <b>ACCEPTED</b>
                <span>★ AGREEMENT ★</span>
              </div>
            </div>
          </div>
          <span className="tnc-pen" />
          <div className="tnc-float f1"><Icon name="user" size={14} /> <b>18+</b> users only</div>
          <div className="tnc-float f2"><Icon name="scale" size={14} /> Tamil Nadu, India</div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2 — At a glance                                             */
/* ------------------------------------------------------------------ */

function AtAGlance({ onJump }) {
  const rootRef = useRef(null);
  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".tnc-g-card", { y: 34, opacity: 0, stagger: 0.08, duration: 0.55, ease: "power3.out", scrollTrigger: { trigger: rootRef.current, start: "top 80%" } });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="tnc-glance" ref={rootRef}>
      <div className="tnc-container">
        <div className="tnc-g-head">
          <h2>Key points at a glance</h2>
          <p>A quick summary to help you find your way. The full terms below always apply.</p>
        </div>
        <div className="tnc-g-grid">
          {GLANCE.map((g) => (
            <button key={g.title} type="button" className="tnc-g-card" onClick={() => onJump(g.to)}>
              <span className="tnc-g-ic"><Icon name={g.icon} size={20} /></span>
              <b>{g.title}</b>
              <span className="tnc-g-text">{g.text}</span>
              <span className="tnc-g-link">See section {g.to} <Icon name="arrow" size={14} /></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3 — Document                                                */
/* ------------------------------------------------------------------ */

function TermsDocument({ docRef, jumpRef }) {
  const [active, setActive] = useState(0);
  const [q, setQ] = useState("");
  const [pct, setPct] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const stripRef = useRef(null);
  const paperRef = useRef(null);

  const query = q.trim();
  const preambleHit = matches(PREAMBLE.text, query) || matches(PREAMBLE.title, query);
  const hits = SECTIONS.map((s) => (query ? s.clauses.filter((c) => matches(c[1], query)).length + (matches(s.title, query) ? 1 : 0) : 1));
  const totalHits = query ? hits.reduce((a, b) => a + b, 0) + (preambleHit ? 1 : 0) : 0;

  const jump = (n) => {
    const el = document.getElementById(n === 0 ? "tnc-preamble" : secId(n));
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: y, behavior: prefersReduced() ? "auto" : "smooth" });
  };
  jumpRef.current = jump;

  // progress + back-to-top
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = paperRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const done = Math.min(1, Math.max(0, (window.innerHeight * 0.35 - r.top) / Math.max(1, r.height - window.innerHeight * 0.5)));
      setPct(Math.round(done * 100));
      setShowTop(r.top < -400);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // scrollspy
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !paperRef.current) return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.n))),
      { rootMargin: "-25% 0px -65% 0px" }
    );
    paperRef.current.querySelectorAll("[data-n]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // keep active index chip in view (mobile strip)
  useEffect(() => {
    const strip = stripRef.current;
    const chip = strip?.querySelector(".is-on");
    if (!strip || !chip || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({ left: Math.max(0, chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2), behavior: "smooth" });
  }, [active]);

  // paper entrance
  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".tnc-paper", { y: 50, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: docRef.current, start: "top 80%" } });
      gsap.from(".tnc-index", { x: -30, opacity: 0, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: docRef.current, start: "top 80%" } });
    }, docRef);
    return () => ctx.revert();
  }, [docRef]);

  return (
    <section className="tnc-doc" ref={docRef} id="tnc-terms">
      <div className="tnc-container tnc-doc-grid">
        {/* ---------- Index ---------- */}
        <aside className="tnc-index">
          <label className="tnc-search">
            <Icon name="search" size={16} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the terms…" aria-label="Search the terms" />
            {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search"><Icon name="x" size={14} /></button>}
          </label>
          {query && <p className="tnc-hits">{totalHits ? <><b>{totalHits}</b> matching {totalHits === 1 ? "part" : "parts"}</> : "No matches"}</p>}

          <div className="tnc-index-h">
            <span>Contents</span>
            <span className="tnc-pct">{pct}% read</span>
          </div>
          <div className="tnc-index-bar"><i style={{ width: `${pct}%` }} /></div>

          <ol className="tnc-index-list" ref={stripRef}>
            <li>
              <button type="button" className={`${active === 0 ? "is-on" : ""} ${query && !preambleHit ? "is-dim" : ""}`} onClick={() => jump(0)}>
                <span className="tnc-ix-n"><Icon name="doc" size={12} /></span><span className="tnc-ix-t">Covenants</span>
              </button>
            </li>
            {SECTIONS.map((s, i) => (
              <li key={s.n}>
                <button type="button" className={`${active === s.n ? "is-on" : ""} ${query && !hits[i] ? "is-dim" : ""}`} onClick={() => jump(s.n)}>
                  <span className="tnc-ix-n">{s.n}</span><span className="tnc-ix-t">{s.title}</span>
                  {query && hits[i] > 0 && <em>{hits[i]}</em>}
                </button>
              </li>
            ))}
          </ol>
        </aside>

        {/* ---------- Paper ---------- */}
        <div className="tnc-paper-wrap">
          <article className="tnc-paper" ref={paperRef}>
            <header className="tnc-paper-head">
              <span className="tnc-sheet-logo lg"><img src={I("ngriffinpay-mark.png")} alt="NGriffinpay" /></span>
              <div>
                <h2>Terms &amp; Conditions</h2>
                <small>{LAST_UPDATED ? `Last updated: ${LAST_UPDATED}` : "Agreement between You and Ngriffin"}</small>
              </div>
              <button type="button" className="tnc-print" onClick={() => window.print()}><Icon name="print" size={15} /> Print</button>
            </header>

            <div id="tnc-preamble" data-n="0" className={`tnc-preamble ${query && !preambleHit ? "is-dim" : ""}`}>
              <h3><Mark text={PREAMBLE.title} q={query} /></h3>
              <p><Mark text={PREAMBLE.text} q={query} /></p>
            </div>

            {SECTIONS.map((s, i) => (
              <section key={s.n} id={secId(s.n)} data-n={s.n} className={`tnc-sec ${query && !hits[i] ? "is-dim" : ""}`}>
                <div className="tnc-sec-h">
                  <span className="tnc-sec-n">{String(s.n).padStart(2, "0")}</span>
                  <h3><span className="tnc-sec-ic"><Icon name={s.icon} size={16} /></span><Mark text={s.title} q={query} /></h3>
                </div>
                {s.clauses.map(([n, t]) => (
                  <div key={n} id={`tnc-c-${n}`} className={`tnc-clause ${query && !matches(t, query) ? "is-dim" : ""}`}>
                    <span className="tnc-clause-n">{n}</span>
                    <p><Mark text={t} q={query} /></p>
                  </div>
                ))}
              </section>
            ))}

            <footer className="tnc-paper-foot">
              <span className="tnc-end-rule" />
              <b>End of Terms &amp; Conditions</b>
              <p>Questions about these terms? Write to us at <a href="mailto:hr@ngriffin.in">hr@ngriffin.in</a>.</p>
            </footer>
          </article>
        </div>
      </div>

      <button type="button" className={`tnc-top ${showTop ? "is-on" : ""}`} onClick={() => jump(0)} aria-label="Back to top of the terms">
        <Icon name="up" size={18} />
      </button>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TermsConditions() {
  const docRef = useRef(null);
  const jumpRef = useRef(() => {});

  useEffect(() => { document.title = "Terms & Conditions | NGriffinpay"; }, []);

  const read = () => {
    const el = docRef.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: prefersReduced() ? "auto" : "smooth" });
  };

  return (
    <main className="tnc-page">
      <TermsHero onRead={read} onPrint={() => window.print()} />
      <AtAGlance onJump={(n) => jumpRef.current(n)} />
      <TermsDocument docRef={docRef} jumpRef={jumpRef} />
    </main>
  );
}
