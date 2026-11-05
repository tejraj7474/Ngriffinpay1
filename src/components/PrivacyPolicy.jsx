// PrivacyPolicy.jsx
// NGriffinpay — Privacy Policy page
// Section 1: Hero — a live "Privacy Center" app: personal details encrypt themselves,
//            consent switches, cookie preferences, access / delete requests
// Section 2: "Your data's journey" — Collect → Use → Protect → Share → Your choices → Cookies,
//            a data packet travels the track (auto-plays while in view, click any stage)
// Section 3: The full policy as section cards with a sticky progress rail
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed — no extra packages needed)

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { I } from "../data";
import "./PrivacyPolicy.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content (policy wording as provided)                                */
/* ------------------------------------------------------------------ */

const LAST_UPDATED = "June 17, 2025";
const CONTACT_EMAIL = "techsupport@ngriffin.in";
const CONTACT_PHONE = "+91 9901540666";
const GRIEVANCE_EMAIL = "arun.a@ngriffin.in";

const INTRO = "At Ngriffin, we recognize the significance of privacy to our customers, and we are dedicated to safeguarding their personal information. This Privacy Policy elucidates the categories of personal information we gather, our methods of utilization and safeguarding of that information, and the options our customers have concerning the utilization of their personal information.";

// blocks: { p: "text" } | { items: [[title, text], ...] }
const SECTIONS = [
  {
    id: "gather", title: "Data We Gather", icon: "inbox",
    blocks: [
      { p: "We may gather personal data from our customers when they utilize our website or mobile application. This data might encompass, yet isn't restricted to, their name, contact details, and location coordinates. Moreover, we may acquire information regarding their utilization of our website and mobile application, such as the functionalities they engage with and the content they peruse." },
      { p: "Furthermore, we may procure personal data when our customers interact with us, for instance, when they reach out to our customer support team." },
    ],
  },
  {
    id: "use", title: "Utilization of Personal Data", icon: "gear",
    blocks: [
      { p: "We might utilize the personal data we gather from our clients to deliver, uphold, and enhance our offerings, encompassing our website and mobile app. Additionally, we might employ this data to engage with our clientele concerning their accounts or our offerings, such as informing them about website or mobile app enhancements. Some concrete instances of how we might utilize personal data include:" },
      {
        items: [
          ["Managing, upkeeping, and enhancing our website and mobile application", "We might utilize personal information to guarantee the smooth operation of our website and mobile application and to implement updates or enhancements to these platforms."],
          ["Engaging with our customers", "We may utilize personal information to reach out to our customers regarding their account or our offerings, such as notifying them about updates to our website or mobile application."],
          ["Tailoring our services for our customers", "We might utilize personal data to customize our services according to our customers' requirements and preferences, including delivering content and features that are specifically pertinent to them."],
          ["Anonymous data examination", "We may scrutinize the usage of our services and website in an anonymous manner and utilize it for product enhancements and marketing determinations."],
          ["Marketing and advertising endeavors", "We might utilize personal data to dispatch promotional content and offers to our clientele, contingent upon their explicit consent."],
          ["Third-party analytics", "We might employ external analytics tools to gather insights into and assess the performance of our website and mobile applications."],
        ],
      },
      { p: "It is crucial to emphasize that we will not utilize personal information for any other objective not delineated in the Privacy Policy without prior explicit consent from the customer." },
    ],
  },
  {
    id: "protect", title: "Safeguarding Personal Data", icon: "shield",
    blocks: [
      { p: "We prioritize safeguarding our customers' personal information and have instituted suitable technical, administrative, and physical security protocols to shield their data from unauthorized access, use, or disclosure. It is our duty to guarantee that personal data gathered is securely stored and shielded against unauthorized access, deletion, use, alteration, or disclosure. This entails employing fitting technical, administrative, and physical security precautions. Some concrete instances of these precautions include:" },
      {
        items: [
          ["Encryption", "We may encode personal information using secure algorithms to safeguard it from unauthorized access or disclosure."],
          ["Firewalls", "We may employ security barriers to help prevent unauthorized access to personal information stored on our servers."],
          ["Access restrictions", "We might restrict entry to personal data solely to those staff members, contractors, and third-party service providers who require the information for their job responsibilities and have undergone training on data protection and privacy laws."],
          ["Third-party assessment", "We might carry out routine security evaluations by independent security specialists to guarantee the safety of our systems and the safeguarding of personal data."],
          ["Incident Response", "We may have an incident response protocol in place to detect and address unauthorized access or disclosure of personal information."],
          ["Data Backup", "We may routinely archive personal information to safeguard data in the event of any system failures."],
        ],
      },
      { p: "It's also imperative to acknowledge that we will not retain personal information beyond the necessary duration dictated by the purpose for which it was collected. Once its relevance ceases, it will be securely expunged." },
      { p: "We will also ensure our customers are informed about the potential hazards of transmitting sensitive information through unsecured channels, such as email or via unencrypted file sharing systems, and will advocate for the adoption of secure communication methods." },
    ],
  },
  {
    id: "disclosure", title: "Disclosure of Personal Information", icon: "share",
    blocks: [
      { p: "We do not divulge personal information to third parties, except under legal obligations or essential circumstances to deliver our products and services to our customers. We might disclose personal information to third parties for specific purposes, such as facilitating the provision of our products and services to our customers. Some particular instances wherein we may share personal information include:" },
      {
        items: [
          ["Service Suppliers", "We might disclose personal information to third-party service suppliers who aid us in offering, upholding, and enhancing our website and mobile application, such as hosting providers and payment processors. These service suppliers are legally obligated by our policies and agreements to guarantee the safeguarding and safety of personal information."],
          ["Adherence to regulations", "We may disclose personal information in accordance with legal requirements, such as responding to a subpoena or court order."],
          ["Business transitions", "In the event of a merger, acquisition, reorganization, bankruptcy, or other analogous event, personal information may be transferred as part of the transaction."],
          ["Anonymous information", "We might disclose anonymized information, devoid of customer identification, to third parties for research, analytical, and marketing purposes."],
        ],
      },
      { p: "It is imperative to emphasize that we will not disclose personal information to third parties for their own marketing or promotional endeavors without obtaining explicit consent from our customers." },
      { p: "We will also disclose any third-party data processors and/or data controllers that we utilize for the purpose of data processing, and we will also ensure that they adhere to the laws and regulations." },
      { p: "We will also routinely assess our contracts with third-party service providers and data processors, to guarantee they are safeguarding personal information in line with our criteria and the mandates of relevant laws." },
    ],
  },
  {
    id: "choices", title: "Decision Concerning Personal Data", icon: "toggle",
    blocks: [
      { p: "Our clients may opt not to furnish us with their personal details or may request the deletion of any personal information we've gathered from them. Nonetheless, this might constrain our capacity to deliver our products and services to our clientele." },
      { p: "Some particular instances of the options accessible to our customers include:" },
      {
        items: [
          ["Disclosing or withholding personal information", "Our customers may opt to disclose personal information when utilizing our website or mobile application, or they may opt not to disclose such information. However, if they opt not to disclose certain details, they may encounter limitations in accessing specific features or services."],
          ["Decline marketing communications", `Our customers have the option to decline receiving promotional or marketing communications from us. They can exercise this choice by adhering to the unsubscribe instructions in an email or by reaching out to us at ${CONTACT_EMAIL}.`],
          ["Seeking access to personal information", "Our clients have the right to request access to their personal data held by us, and upon such requests, we will furnish them with a copy of this data, in accordance with relevant laws and regulations."],
          ["Requesting removal of personal information", "Our customers may ask for the removal of any personal information we have gathered about them. However, it's important to understand that in specific situations, we might need to retain certain personal data in compliance with Indian laws and regulations."],
        ],
      },
      { p: "We will ensure that we maintain a log of all the requests that we receive, and the action taken on the same." },
      { p: "It is crucial for us to uphold transparency and apprise our customers regarding their rights and options concerning their personal information. We will also furnish explicit and succinct guidelines on how to exercise these rights and choices." },
    ],
  },
  {
    id: "cookies", title: "Cookies", icon: "cookie",
    blocks: [
      { p: "We utilize cookies to your device to uniquely identify your browser and enhance the quality of our service. The term “cookies” pertains to small fragments of data that a website transfers to your device’s storage while you're browsing the site. We may employ both session cookies (which expire upon closing your browser) and persistent cookies (which remain on your device until manually deleted). Persistent cookies can be eliminated by following the guidance in your browser's help documentation. Opting to disable cookies may result in certain sections of Ngriffin functioning incorrectly or not at all. Ngriffin incorporates third-party tools, which might gather anonymous data about your visits to Ngriffin through cookies, as well as your interaction with Ngriffin's products and services. These third parties may utilize data from your visits to Ngriffin's offerings and other websites to tailor advertisements for Ngriffin's products and services. However, no personally identifiable information is gathered or employed in this process. Third-party entities are unaware of or unable to access Ngriffin users' personal details such as name, phone number, address, or email address. Ngriffin users can choose to refrain from sharing this data with third parties by disabling cookies, with the process varying depending on the browser. Please consult your browser's help documentation for guidance on disabling cookies." },
    ],
  },
  {
    id: "adjustments", title: "Terms and adjustments to this Privacy Policy", icon: "edit",
    blocks: [
      { p: "We reserve the right to amend this Privacy Policy at any time, and any updates will be published on this page. In the event of significant alterations in how we handle your personal data, we will notify you via email to the latest email address you've provided us and/or by prominently displaying notice of the changes on our website. These modifications will take effect either thirty (30) calendar days after we send you an email notification or thirty (30) calendar days after we post notice of the changes on our website, whichever occurs earlier. For new users of Ngriffin, these changes will be immediately effective. Please be aware that it's your responsibility to keep your personal information up to date and provide us with your most recent email address." },
      { p: "In the event that the last email address you have provided us is not valid, or for any reason is incapable of delivering to you the notice described above, our dispatch of the email containing such notice will nonetheless constitute effective notification of the changes described in the notice. In any circumstance, alterations to this Privacy Policy may impact our utilization of personal information that you provided us prior to our notification to you of the changes. If you do not wish to allow modifications in our utilization of your personal information, you must notify us before the effective date of the changes that you wish to deactivate your account with us. Continued use of Ngriffin following notification of such changes shall indicate your acknowledgment of such changes and agreement to be bound by the terms and conditions of such changes." },
    ],
  },
  {
    id: "implementation", title: "Implementation", icon: "check-doc",
    blocks: [
      { p: "We may utilize the information we gather regarding your utilization of Ngriffin (including your personal data) to examine, enforce, and implement our Terms of Use and Privacy Policy." },
    ],
  },
  {
    id: "conflict", title: "Conflict resolution", icon: "scale",
    blocks: [
      { p: `If you believe that Ngriffin has not complied with this Privacy Policy, you may write to Ngriffin at the following address: ${GRIEVANCE_EMAIL}` },
      { p: "In your email, kindly elucidate with as much detail as possible any instances where you perceive non-compliance with the Privacy Policy. We commit to promptly investigating your concerns." },
    ],
  },
  {
    id: "commencement", title: "Commencement Date", icon: "law",
    blocks: [
      { p: "Ngriffin is dedicated to safeguarding the privacy of personal data and adheres to Indian laws and regulations. These regulations encompass, among others, the Information Technology Act 2000 and the Information Technology (Reasonable security practices and procedures and sensitive personal data or information) Rules 2011." },
    ],
  },
  {
    id: "children", title: "Children's Privacy", icon: "child",
    blocks: [
      { p: "Our Service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from anyone under the age of 18. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 18 without verification of parental consent, We take steps to remove that information from Our servers." },
      { p: "If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information." },
    ],
  },
  {
    id: "links", title: "Links to Other Websites", icon: "link",
    blocks: [
      { p: "Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit." },
      { p: "We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services." },
    ],
  },
  {
    id: "changes", title: "Changes to this Privacy Policy", icon: "refresh",
    blocks: [
      { p: "We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page." },
      { p: "We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the \"Last updated\" date at the top of this Privacy Policy." },
      { p: "You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page." },
    ],
  },
];

// Section 2 — journey stages (chips use the policy's own headings)
const JOURNEY = [
  { key: "Collect", icon: "inbox", to: "gather", line: "What we may gather when you use our website or app, or talk to support.", chips: ["Name", "Contact details", "Location coordinates", "Features you use", "Support conversations"] },
  { key: "Use", icon: "gear", to: "use", line: "Only for the purposes in this policy — anything else needs your explicit consent.", chips: ["Running the website & app", "Contacting you", "Tailoring services", "Anonymous analysis", "Marketing (with consent)", "Third-party analytics"] },
  { key: "Protect", icon: "shield", to: "protect", line: "Technical, administrative and physical safeguards around your data.", chips: ["Encryption", "Firewalls", "Access restrictions", "Third-party assessment", "Incident response", "Data backup"] },
  { key: "Share", icon: "share", to: "disclosure", line: "Never for other companies' marketing without your explicit consent.", chips: ["Service suppliers", "Legal requirements", "Business transitions", "Anonymised information"] },
  { key: "Your choices", icon: "toggle", to: "choices", line: "You stay in control of what you share and what we keep.", chips: ["Share or withhold", "Unsubscribe from marketing", "Access your data", "Request removal"] },
  { key: "Cookies", icon: "cookie", to: "cookies", line: "Session and persistent cookies — you can disable them in your browser.", chips: ["Session cookies", "Persistent cookies", "Anonymous third-party tools", "Disable anytime"] },
];

const JOURNEY_TIME = 4.5;
const secId = (id) => `pvc-${id}`;
const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function Icon({ name, size = 18 }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  switch (name) {
    case "inbox": return <svg {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>;
    case "gear": return <svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
    case "shield": return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>;
    case "share": return <svg {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></svg>;
    case "toggle": return <svg {...p}><rect x="1" y="6" width="22" height="12" rx="6" /><circle cx="16" cy="12" r="3" /></svg>;
    case "cookie": return <svg {...p}><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" /><path d="M8.5 8.5h.01M16 15.5h.01M12 12h.01M11 17h.01M7 14h.01" /></svg>;
    case "edit": return <svg {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>;
    case "check-doc": return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 15l2 2 4-4" /></svg>;
    case "scale": return <svg {...p}><path d="M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z" /></svg>;
    case "law": return <svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" /><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" /></svg>;
    case "child": return <svg {...p}><circle cx="12" cy="6" r="3" /><path d="M8 22v-6l-2-3 3-3h6l3 3-2 3v6" /></svg>;
    case "link": return <svg {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
    case "refresh": return <svg {...p}><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>;
    case "lock": return <svg {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;
    case "user": return <svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></svg>;
    case "phone": return <svg {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
    case "pin": return <svg {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>;
    case "mail": return <svg {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>;
    case "download": return <svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>;
    case "trash": return <svg {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>;
    case "arrow": return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "check": return <svg {...p} strokeWidth={3}><path d="M20 6 9 17l-5-5" /></svg>;
    case "eye-off": return <svg {...p}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" /></svg>;
    case "print": return <svg {...p}><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>;
    default: return null;
  }
}

/* ------------------------------------------------------------------ */
/* Section 1 — Hero with Privacy Center mockup                          */
/* ------------------------------------------------------------------ */

const DATA_ROWS = [
  { icon: "user", label: "Name", plain: "Priya Sharma" },
  { icon: "phone", label: "Contact", plain: "+91 98450 12345" },
  { icon: "pin", label: "Location", plain: "12.9716° N, 77.5946° E" },
];
const GLYPHS = "▓▒░█#@$%&*0123456789ABCDEF";
const scramble = (s, k) => s.split("").map((ch, i) => (ch === " " ? " " : i < k ? "•" : GLYPHS[(i * 7 + k * 13) % GLYPHS.length])).join("");

function PrivacyCenter() {
  const [phase, setPhase] = useState(0); // 0 plain → 1 encrypting → 2 encrypted
  const [tick, setTick] = useState(0);
  const [marketing, setMarketing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [req, setReq] = useState(""); // "", "access", "delete"

  // encryption loop
  useEffect(() => {
    if (prefersReduced()) { setPhase(2); return undefined; }
    let t;
    if (phase === 0) t = setTimeout(() => { setPhase(1); setTick(0); }, 1800);
    else if (phase === 1) t = setTimeout(() => (tick >= 16 ? setPhase(2) : setTick((x) => x + 1)), 55);
    else t = setTimeout(() => setPhase(0), 3400);
    return () => clearTimeout(t);
  }, [phase, tick]);

  // demo: flip the marketing consent switch now and then
  useEffect(() => {
    if (prefersReduced()) return undefined;
    const id = setInterval(() => setMarketing((m) => !m), 4200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!req) return undefined;
    const t = setTimeout(() => setReq(""), 2600);
    return () => clearTimeout(t);
  }, [req]);

  const shown = (s) => (phase === 0 ? s : phase === 1 ? scramble(s, Math.floor((tick / 16) * s.length)) : s.replace(/[^ ]/g, "•"));

  return (
    <div className="pvc-app">
      <div className="pvc-app-top">
        <span className="pvc-logo"><img src={I("ngriffinpay-mark.png")} alt="" /></span>
        <b>Privacy Center</b>
        <span className={`pvc-status ${phase === 2 ? "is-on" : ""}`}><Icon name="lock" size={12} /> {phase === 2 ? "Encrypted" : phase === 1 ? "Encrypting…" : "Protecting"}</span>
      </div>

      <div className="pvc-card">
        <div className="pvc-card-h"><span>Your data</span><small>stored securely</small></div>
        {DATA_ROWS.map((r) => (
          <div className="pvc-row" key={r.label}>
            <span className="pvc-row-ic"><Icon name={r.icon} size={14} /></span>
            <span className="pvc-row-l">{r.label}</span>
            <span className={`pvc-row-v ${phase ? "is-enc" : ""}`}>{shown(r.plain)}</span>
            <span className={`pvc-row-lock ${phase === 2 ? "is-on" : ""}`}><Icon name="lock" size={11} /></span>
          </div>
        ))}
      </div>

      <div className="pvc-card">
        <div className="pvc-card-h"><span>Your choices</span><small>change anytime</small></div>
        <label className="pvc-sw">
          <span><b>Marketing emails</b><small>Only with your explicit consent</small></span>
          <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
          <i aria-hidden />
        </label>
        <label className="pvc-sw">
          <span><b>Analytics cookies</b><small>Anonymous usage data</small></span>
          <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
          <i aria-hidden />
        </label>
        <label className="pvc-sw is-locked">
          <span><b>Essential cookies</b><small>Needed for the site to work</small></span>
          <input type="checkbox" checked readOnly disabled />
          <i aria-hidden />
        </label>
      </div>

      <div className="pvc-req">
        <button type="button" onClick={() => setReq("access")}><Icon name="download" size={14} /> Access my data</button>
        <button type="button" className="danger" onClick={() => setReq("delete")}><Icon name="trash" size={14} /> Request removal</button>
      </div>
      {req && (
        <div className="pvc-toast" key={req}>
          <Icon name="check" size={12} /> {req === "access" ? "Access request logged — we'll send you a copy." : "Removal request logged — we'll confirm by email."}
        </div>
      )}
      <p className="pvc-demo-note">Illustration only — to make a request, email {CONTACT_EMAIL}</p>
    </div>
  );
}

function PolicyHero({ onRead }) {
  const rootRef = useRef(null);
  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".pvc-hero-copy > *", { y: 26, opacity: 0, stagger: 0.08, duration: 0.6 })
        .from(".pvc-shield-bg", { scale: 0.6, opacity: 0, duration: 0.8, ease: "back.out(1.6)" }, "-=0.4")
        .from(".pvc-app", { y: 60, opacity: 0, duration: 0.8 }, "-=0.55")
        .from(".pvc-card, .pvc-req", { y: 20, opacity: 0, stagger: 0.1, duration: 0.45 }, "-=0.4")
        .from(".pvc-badge", { scale: 0, opacity: 0, stagger: 0.12, duration: 0.45, ease: "back.out(2.2)" }, "-=0.2");
      gsap.to(".pvc-shield-bg", { rotation: 360, duration: 60, repeat: -1, ease: "none" });
      gsap.to(".pvc-badge.b1", { y: -8, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".pvc-badge.b2", { y: 8, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="pvc-hero" ref={rootRef}>
      <div className="pvc-hero-bg" aria-hidden><span className="pvc-blob b1" /><span className="pvc-blob b2" /><span className="pvc-grid-bg" /></div>
      <div className="pvc-container pvc-hero-grid">
        <div className="pvc-hero-copy">
          <span className="pvc-eyebrow"><Icon name="shield" size={14} /> Your privacy</span>
          <h1>Privacy <span>Policy</span></h1>
          <p className="pvc-updated">Last updated: <b>{LAST_UPDATED}</b></p>
          <p className="pvc-lead">{INTRO}</p>
          <div className="pvc-actions">
            <button type="button" className="pvc-btn" onClick={onRead}>Read the policy <Icon name="arrow" size={16} /></button>
            <a className="pvc-btn ghost" href={`mailto:${CONTACT_EMAIL}`}><Icon name="mail" size={16} /> Privacy questions</a>
          </div>
        </div>

        <div className="pvc-visual">
          <svg className="pvc-shield-bg" viewBox="0 0 200 200" aria-hidden>
            <circle cx="100" cy="100" r="96" />
            <circle cx="100" cy="100" r="74" />
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i / 24) * Math.PI * 2;
              return <circle key={i} className="dot" cx={100 + 96 * Math.cos(a)} cy={100 + 96 * Math.sin(a)} r={i % 3 ? 1.4 : 2.6} />;
            })}
          </svg>
          <PrivacyCenter />
          <div className="pvc-badge b1" aria-hidden><Icon name="law" size={14} /> IT Act 2000</div>
          <div className="pvc-badge b2" aria-hidden><Icon name="shield" size={14} /> SPDI Rules 2011</div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2 — Data journey                                            */
/* ------------------------------------------------------------------ */

function DataJourney({ onJump }) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef(null);
  const stripRef = useRef(null);

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({ trigger: rootRef.current, start: "top 75%", end: "bottom 25%", onToggle: (s) => setInView(s.isActive) });
    if (prefersReduced()) return () => st.kill();
    const ctx = gsap.context(() => {
      gsap.from(".pvc-j-head > *", { y: 22, opacity: 0, stagger: 0.08, duration: 0.55, scrollTrigger: { trigger: rootRef.current, start: "top 78%" } });
      gsap.from(".pvc-stop", { y: 20, opacity: 0, stagger: 0.07, duration: 0.45, scrollTrigger: { trigger: rootRef.current, start: "top 75%" } });
    }, rootRef);
    return () => { st.kill(); ctx.revert(); };
  }, []);

  useEffect(() => {
    if (!inView || paused || prefersReduced()) return undefined;
    const dc = gsap.delayedCall(JOURNEY_TIME, () => setActive((a) => (a + 1) % JOURNEY.length));
    return () => dc.kill();
  }, [active, inView, paused]);

  useEffect(() => {
    const card = rootRef.current?.querySelector(".pvc-j-card");
    if (card && !prefersReduced()) {
      gsap.fromTo(card, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
      gsap.fromTo(card.querySelectorAll(".pvc-chip"), { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.05, duration: 0.3, delay: 0.1, ease: "back.out(2)" });
    }
    const strip = stripRef.current;
    const stop = strip?.querySelector(".is-on");
    if (strip && stop && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: Math.max(0, stop.offsetLeft - (strip.clientWidth - stop.offsetWidth) / 2), behavior: "smooth" });
    }
  }, [active]);

  const pick = (i) => { setActive(i); setPaused(true); };
  const J = JOURNEY[active];
  const pos = (active / (JOURNEY.length - 1)) * 100;

  return (
    <section className="pvc-journey" ref={rootRef}>
      <div className="pvc-container">
        <div className="pvc-j-head">
          <span className="pvc-eyebrow dark"><Icon name="lock" size={13} /> At a glance</span>
          <h2>Your data's journey with NGriffinpay</h2>
          <p>Follow your information from the moment it reaches us — tap any stage to see what the policy says.</p>
        </div>

        <div className="pvc-track-wrap">
          <div className="pvc-track" ref={stripRef} role="tablist" aria-label="Data journey stages">
            <span className="pvc-rail" aria-hidden><i style={{ width: `${pos}%` }} /></span>
            <span className="pvc-packet" style={{ left: `${(pos * 10) / 12}%` }} aria-hidden><Icon name="lock" size={12} /></span>
            {JOURNEY.map((s, i) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`pvc-stop ${i === active ? "is-on" : ""} ${i < active ? "is-done" : ""}`}
                onClick={() => pick(i)}
              >
                <span className="pvc-stop-ic"><Icon name={s.icon} size={20} /></span>
                <span className="pvc-stop-n">0{i + 1}</span>
                <span className="pvc-stop-t">{s.key}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pvc-j-card" key={J.key}>
          <span className="pvc-j-ic"><Icon name={J.icon} size={26} /></span>
          <div className="pvc-j-body">
            <span className="pvc-j-step">Stage {active + 1} of {JOURNEY.length}</span>
            <h3>{J.key}</h3>
            <p>{J.line}</p>
            <div className="pvc-chips">{J.chips.map((c) => <span className="pvc-chip" key={c}><Icon name="check" size={10} /> {c}</span>)}</div>
          </div>
          <button type="button" className="pvc-btn sm" onClick={() => onJump(J.to)}>Read in full <Icon name="arrow" size={15} /></button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3 — Full policy                                             */
/* ------------------------------------------------------------------ */

function PolicyDoc({ docRef, jumpRef }) {
  const [active, setActive] = useState(SECTIONS[0].id);
  const [pct, setPct] = useState(0);
  const listRef = useRef(null);
  const bodyRef = useRef(null);

  const jump = (id) => {
    const el = document.getElementById(secId(id));
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: prefersReduced() ? "auto" : "smooth" });
  };
  jumpRef.current = jump;

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = bodyRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPct(Math.round(Math.min(1, Math.max(0, (window.innerHeight * 0.35 - r.top) / Math.max(1, r.height - window.innerHeight * 0.5))) * 100));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !bodyRef.current) return undefined;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.dataset.id)), { rootMargin: "-25% 0px -65% 0px" });
    bodyRef.current.querySelectorAll("[data-id]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const strip = listRef.current;
    const chip = strip?.querySelector(".is-on");
    if (!strip || !chip || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({ left: Math.max(0, chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2), behavior: "smooth" });
  }, [active]);

  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      docRef.current.querySelectorAll(".pvc-sec").forEach((el) => {
        gsap.from(el, { y: 30, opacity: 0, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
    }, docRef);
    return () => ctx.revert();
  }, [docRef]);

  const activeIdx = SECTIONS.findIndex((s) => s.id === active);

  return (
    <section className="pvc-doc" ref={docRef}>
      <div className="pvc-container pvc-doc-grid">
        <aside className="pvc-rail-nav">
          <div className="pvc-rail-h">
            <span>Policy sections</span>
            <b>{pct}%</b>
          </div>
          <ol className="pvc-rail-list" ref={listRef} style={{ "--fill": `${(activeIdx / (SECTIONS.length - 1)) * 100}%` }}>
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <button type="button" className={`${active === s.id ? "is-on" : ""} ${i < activeIdx ? "is-done" : ""}`} onClick={() => jump(s.id)}>
                  <span className="pvc-rail-dot" aria-hidden />
                  {s.title}
                </button>
              </li>
            ))}
          </ol>
          <button type="button" className="pvc-print" onClick={() => window.print()}><Icon name="print" size={14} /> Print policy</button>
        </aside>

        <div className="pvc-doc-body" ref={bodyRef}>
          {SECTIONS.map((s, i) => (
            <article key={s.id} id={secId(s.id)} data-id={s.id} className="pvc-sec">
              <header className="pvc-sec-h">
                <span className="pvc-sec-ic"><Icon name={s.icon} size={20} /></span>
                <div>
                  <small>Section {String(i + 1).padStart(2, "0")}</small>
                  <h2>{s.title}</h2>
                </div>
              </header>
              {s.blocks.map((b, k) =>
                b.items ? (
                  <div className="pvc-items" key={k}>
                    {b.items.map(([t, d]) => (
                      <div className="pvc-item" key={t}>
                        <span className="pvc-item-tick"><Icon name="check" size={10} /></span>
                        <div><b>{t}</b><p>{d}</p></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p key={k}>{b.p}</p>
                )
              )}
            </article>
          ))}

          {/* Contact */}
          <article id={secId("contact")} data-id="contact" className="pvc-sec pvc-contact">
            <header className="pvc-sec-h">
              <span className="pvc-sec-ic"><Icon name="mail" size={20} /></span>
              <div><small>Get in touch</small><h2>Contact Us</h2></div>
            </header>
            <p>If you have any questions about this Privacy Policy, You can contact us:</p>
            <div className="pvc-contact-grid">
              <a href={`mailto:${CONTACT_EMAIL}`}><Icon name="mail" size={18} /><span><small>By email</small><b>{CONTACT_EMAIL}</b></span></a>
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}><Icon name="phone" size={18} /><span><small>By phone</small><b>{CONTACT_PHONE}</b></span></a>
              <a href={`mailto:${GRIEVANCE_EMAIL}`}><Icon name="scale" size={18} /><span><small>Privacy concerns</small><b>{GRIEVANCE_EMAIL}</b></span></a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function PrivacyPolicy() {
  const docRef = useRef(null);
  const jumpRef = useRef(() => {});

  useEffect(() => { document.title = "Privacy Policy | NGriffinpay"; }, []);

  const read = () => {
    const el = docRef.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: prefersReduced() ? "auto" : "smooth" });
  };

  return (
    <main className="pvc-page">
      <PolicyHero onRead={read} />
      <DataJourney onJump={(id) => jumpRef.current(id)} />
      <PolicyDoc docRef={docRef} jumpRef={jumpRef} />
    </main>
  );
}

