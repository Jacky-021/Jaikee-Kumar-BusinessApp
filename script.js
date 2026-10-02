"use strict";

/* =========================================================
   RakeLink — script.js
   Sections: 1) DATA you can edit  2) helpers  3) navigation
             4) dashboard charts   5) consignment tracker
             6) enquiry form
   ========================================================= */

/* ---------------------------------------------------------
   1) DATA — edit these to change what the site shows
   --------------------------------------------------------- */
const CONFIG = {
  // 1. Your own email. Used by the "Send by email" backup button.
  email: "jaikee.kumar_mba25@gsv.ac.in",

  // 2. Web3Forms access key. Get it free at https://web3forms.com (type your email,
  //    the key arrives in your inbox). With a key, every enquiry is delivered
  //    straight to that inbox. Paste the key between the quotes.
  web3formsKey: "fea75d55-3631-45fd-8a90-82e22c310fd9",

  // 3. Your WhatsApp number for the "Send on WhatsApp" button:
  //    country code + number, digits only (for India: 91 then the 10 digits).
  whatsapp: "917488991657"
};

const DASHBOARD = {
  monthly: {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    values: [980, 1040, 1110, 1085, 1190, 1250]
  },
  // Share of tonnage by cargo (adds up to 100)
  mix: [
    { name: "Steel and coils", share: 32, color: "#1F4E79" },
    { name: "Cement",          share: 22, color: "#7FA7CC" },
    { name: "Coal",            share: 18, color: "#2B3440" },
    { name: "Fertiliser",      share: 12, color: "#1E8E5A" },
    { name: "Food grains",     share: 9,  color: "#F2A413" },
    { name: "Containers",      share: 7,  color: "#8E3B2B" }
  ],
  // Causes of the delayed consignments (adds up to the "Delayed" KPI)
  delays: [
    { cause: "Terminal congestion",         count: 18 },
    { cause: "Wagon shortage",              count: 12 },
    { cause: "Waterlogged track (monsoon)", count: 9 },
    { cause: "Paperwork and RR issues",     count: 6 },
    { cause: "Slow loading at siding",      count: 5 }
  ]
};

const STEPS = ["Booked", "Wagons placed", "Loaded", "In transit", "At destination terminal", "Delivered"];

// stage = index of the current step in STEPS. times[] holds one entry per completed step.
const SHIPMENTS = [
  {
    id: "TRK1001", customer: "Narmada Cement Ltd", cargo: "Cement (bagged)",
    from: "Katni, Madhya Pradesh", to: "Vadodara, Gujarat", wagons: "4 covered wagons",
    stage: 5,
    times: ["24 Sep, 10:15", "24 Sep, 16:40", "25 Sep, 11:05", "25 Sep, 14:30", "28 Sep, 06:20", "28 Sep, 15:45"],
    location: "Delivered at Vadodara goods shed", eta: "28 Sep 2026, 15:45",
    partner: "Western Railway, Vadodara Division",
    contact: { name: "Anil Mehta", phone: "+91 90000 12301" }
  },
  {
    id: "TRK1018", customer: "Kisan Agro Fertilisers", cargo: "Urea (bagged)",
    from: "Kandla, Gujarat", to: "Indore, Madhya Pradesh", wagons: "12 covered wagons",
    stage: 3,
    times: ["26 Sep, 11:00", "27 Sep, 08:30", "28 Sep, 17:10", "29 Sep, 05:45"],
    location: "Held at Ahmedabad yard", eta: "4 Oct 2026, 22:00",
    partner: "Western Railway, Ahmedabad Division",
    contact: { name: "Riya Shah", phone: "+91 90000 12318" },
    delay: { reason: "The rake is held at Ahmedabad yard because of terminal congestion", promised: "2 Oct 2026, 18:00" }
  },
  {
    id: "TRK1025", customer: "Bharat Coil Works", cargo: "Steel coils",
    from: "Jamshedpur, Jharkhand", to: "Vadodara, Gujarat", wagons: "8 steel-carrying wagons",
    stage: 3,
    times: ["27 Sep, 09:30", "28 Sep, 07:20", "29 Sep, 13:50", "30 Sep, 02:15"],
    location: "Near Nagpur Junction, Maharashtra", eta: "4 Oct 2026, 18:00",
    partner: "South East Central and Western Railway",
    contact: { name: "Imran Qureshi", phone: "+91 90000 12325" }
  },
  {
    id: "TRK1030", customer: "Sabarmati Foods", cargo: "Wheat (food grains)",
    from: "Ludhiana, Punjab", to: "Ahmedabad, Gujarat", wagons: "6 covered wagons",
    stage: 0,
    times: ["1 Oct, 16:25"],
    location: "Awaiting wagon allotment at Ludhiana", eta: "9 Oct 2026",
    partner: "Northern Railway, Ambala Division",
    contact: { name: "Neha Joshi", phone: "+91 90000 12330" }
  },
  {
    id: "TRK1042", customer: "Surya Power and Coal", cargo: "Coal",
    from: "Korba, Chhattisgarh", to: "Surat, Gujarat", wagons: "40 open wagons (BOXN)",
    stage: 3,
    times: ["28 Sep, 10:00", "29 Sep, 07:40", "30 Sep, 18:20", "1 Oct, 09:05"],
    location: "Between Bilaspur and Raipur, Chhattisgarh", eta: "5 Oct 2026, 08:00",
    partner: "South East Central Railway, Bilaspur Zone",
    contact: { name: "Vikram Desai", phone: "+91 90000 12342" }
  },
  {
    id: "TRK1055", customer: "Western Containers Pvt Ltd", cargo: "20-ft containers",
    from: "JN Port, Mumbai", to: "Dadri, Uttar Pradesh", wagons: "14 containers on flat wagons",
    stage: 4,
    times: ["29 Sep, 12:10", "29 Sep, 18:30", "30 Sep, 09:45", "30 Sep, 21:00", "2 Oct, 07:30"],
    location: "Dadri, waiting for gate-out", eta: "2 Oct 2026, 20:00",
    partner: "Indian Railways, Western Dedicated Freight Corridor",
    contact: { name: "Kavita Rao", phone: "+91 90000 12355" }
  }
];

/* ---------------------------------------------------------
   2) Helpers
   --------------------------------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const fmt = n => n.toLocaleString("en-IN");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------------------------------------------------------
   3) Navigation: mobile menu + highlight the section in view
   --------------------------------------------------------- */
(function setupNav() {
  const toggle = $(".nav-toggle");
  const nav = $("#site-nav");
  const links = $$("a", nav);

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  links.forEach(l => {
    const section = $(l.getAttribute("href"));
    if (section) observer.observe(section);
  });
})();

/* ---------------------------------------------------------
   4) Dashboard charts (drawn as SVG/HTML, no libraries)
   --------------------------------------------------------- */
function drawMonthlyChart() {
  const el = $("#chart-monthly");
  const { labels, values } = DASHBOARD.monthly;
  const W = 600, H = 290, m = { t: 26, r: 12, b: 36, l: 50 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const max = 1500, ticks = [0, 500, 1000, 1500];
  const band = iw / values.length, bw = band * 0.58;

  let svg = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Bar chart of bookings per month. Bookings rose from ${fmt(values[0])} in ${labels[0]} to ${fmt(values[values.length - 1])} in ${labels[labels.length - 1]}.">`;

  ticks.forEach(t => {
    const y = m.t + ih - (t / max) * ih;
    svg += `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${y}" y2="${y}"/>`;
    svg += `<text class="tick" x="${m.l - 8}" y="${y + 4}" text-anchor="end">${fmt(t)}</text>`;
  });

  values.forEach((v, i) => {
    const h = (v / max) * ih;
    const x = m.l + i * band + (band - bw) / 2;
    const y = m.t + ih - h;
    const cx = x + bw / 2;
    const latest = i === values.length - 1;
    svg += `<rect class="bar${latest ? " bar--now" : ""}" x="${x}" y="${y}" width="${bw}" height="${h}"><title>${labels[i]} 2026: ${fmt(v)} bookings</title></rect>`;
    svg += `<text class="val" x="${cx}" y="${y - 7}" text-anchor="middle">${fmt(v)}</text>`;
    svg += `<text class="tick" x="${cx}" y="${H - 12}" text-anchor="middle">${labels[i]}</text>`;
  });

  el.innerHTML = svg + "</svg>";
}

function drawMixChart() {
  const el = $("#chart-mix");
  const r = 62, C = 2 * Math.PI * r;
  let offset = 0;
  let rings = "";

  DASHBOARD.mix.forEach(item => {
    const len = (item.share / 100) * C;
    rings += `<circle cx="80" cy="80" r="${r}" fill="none" stroke="${item.color}" stroke-width="26" stroke-dasharray="${Math.max(len - 1.5, 0)} ${C - Math.max(len - 1.5, 0)}" stroke-dashoffset="${-offset}"/>`;
    offset += len;
  });

  const summary = DASHBOARD.mix.map(i => `${i.name} ${i.share}%`).join(", ");
  const svg = `<svg class="chart-svg" viewBox="0 0 160 160" width="150" height="150" role="img" aria-label="Donut chart of cargo mix by tonnage: ${summary}">
      <g transform="rotate(-90 80 80)">${rings}</g>
      <text class="donut-num" x="80" y="82" text-anchor="middle">${DASHBOARD.mix.length}</text>
      <text class="donut-cap" x="80" y="98" text-anchor="middle">cargo types</text>
    </svg>`;

  const legend = DASHBOARD.mix.map(i =>
    `<li><i style="background:${i.color}"></i><span>${esc(i.name)}</span><b>${i.share}%</b></li>`).join("");

  el.innerHTML = svg + `<ul class="legend">${legend}</ul>`;
}

function drawDelayChart() {
  const el = $("#chart-delay");
  const total = DASHBOARD.delays.reduce((s, d) => s + d.count, 0);
  const max = Math.max(...DASHBOARD.delays.map(d => d.count));
  $("#delay-total").textContent = total;

  el.innerHTML = `<ul class="hbar">` + DASHBOARD.delays.map(d => `
    <li>
      <span>${esc(d.cause)}</span><b>${d.count}</b>
      <span class="hbar-track"><span class="hbar-fill" style="width:${(d.count / max) * 100}%"></span></span>
    </li>`).join("") + `</ul>`;
}

drawMonthlyChart();
drawMixChart();
drawDelayChart();

/* ---------------------------------------------------------
   5) Business feature: track a consignment by ID
   --------------------------------------------------------- */
const trackForm = $("#track-form");
const trackInput = $("#track-id");
const trackOut = $("#track-result");

function statusOf(s) {
  if (s.delay) return { label: "Delayed", cls: "delayed" };
  if (s.stage === 5) return { label: "Delivered", cls: "delivered" };
  if (s.stage === 4) return { label: "At destination terminal", cls: "terminal" };
  if (s.stage === 3) return { label: "In transit", cls: "transit" };
  if (s.stage >= 1) return { label: "Loading", cls: "loading" };
  return { label: "Booked", cls: "booked" };
}

function renderResult(s) {
  const st = statusOf(s);
  const steps = STEPS.map((label, i) => {
    const cls = [i <= s.stage ? "is-done" : "", i === s.stage ? "is-current" : ""].join(" ").trim();
    const when = s.times[i] ? `<span class="when">${esc(s.times[i])}</span>` : "";
    return `<li class="${cls}"${i === s.stage ? ' aria-current="step"' : ""}>${label}${when}</li>`;
  }).join("");

  const delayNote = s.delay
    ? `<p class="delay-note"><strong>This consignment is delayed.</strong> ${esc(s.delay.reason)}. New expected arrival: ${esc(s.eta)}. Earlier promise: ${esc(s.delay.promised)}.</p>`
    : "";

  const phoneHref = s.contact.phone.replace(/\s+/g, "");
  const etaLabel = s.stage === 5 ? "Delivered on" : "Expected arrival";

  return `
    <article class="result${s.delay ? " result--delayed" : ""}">
      <div class="result-head">
        <div>
          <h3>${esc(s.id)}</h3>
          <p class="result-sub">${esc(s.customer)}, ${esc(s.cargo)}</p>
        </div>
        <span class="badge badge--${st.cls}">${st.label}</span>
      </div>
      ${delayNote}
      <ol class="timeline" aria-label="Consignment progress">${steps}</ol>
      <dl class="facts">
        <div><dt>Route</dt><dd>${esc(s.from)} to ${esc(s.to)}</dd></div>
        <div><dt>Load</dt><dd>${esc(s.wagons)}</dd></div>
        <div><dt>Current location</dt><dd>${esc(s.location)}</dd></div>
        <div><dt>${etaLabel}</dt><dd>${esc(s.eta)}</dd></div>
        <div><dt>Rail partner</dt><dd>${esc(s.partner)}</dd></div>
        <div><dt>Your contact</dt><dd>${esc(s.contact.name)}, <a class="text-link" href="tel:${phoneHref}">${esc(s.contact.phone)}</a></dd></div>
      </dl>
    </article>`;
}

function trackLookup(raw) {
  let id = String(raw).trim().toUpperCase().replace(/\s+/g, "");
  if (/^\d+$/.test(id)) id = "TRK" + id;   // allow typing just 1025
  trackInput.value = id;

  if (!id) {
    trackOut.innerHTML = `<p class="empty empty--error">Enter a consignment ID, for example TRK1025.</p>`;
    return;
  }
  const found = SHIPMENTS.find(s => s.id === id);
  trackOut.innerHTML = found
    ? renderResult(found)
    : `<p class="empty empty--error">No consignment found for <strong>${esc(id)}</strong>. Check the ID on your booking confirmation, or try ${SHIPMENTS.map(s => s.id).slice(0, 3).join(", ")}.</p>`;
}

trackForm.addEventListener("submit", e => {
  e.preventDefault();
  trackLookup(trackInput.value);
});

// Sample-ID buttons
$("#track-samples").innerHTML = SHIPMENTS.map(s => `<button class="chip" type="button" data-id="${s.id}">${s.id}</button>`).join("");
$("#track-samples").addEventListener("click", e => {
  const btn = e.target.closest("[data-id]");
  if (btn) trackLookup(btn.dataset.id);
});

// Links elsewhere on the page that open a consignment (Dashboard -> Track)
$$("[data-track]").forEach(a => a.addEventListener("click", () => trackLookup(a.dataset.track)));

/* ---------------------------------------------------------
   6) Enquiry form: validation + prefilled email
   --------------------------------------------------------- */
const enquiryForm = $("#enquiry-form");
const formStatus = $("#form-status");

// "Book this service" links pre-select the service in the form
$$("[data-service]").forEach(a => a.addEventListener("click", () => {
  $("#f-service").value = a.dataset.service;
  setTimeout(() => $("#f-name").focus({ preventScroll: true }), 400);
}));

function validateEnquiry(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";

  const email = values.email.trim();
  if (!email) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "Enter a valid email address, for example name@company.com.";

  const phone = values.phone.replace(/[\s-]/g, "");
  if (phone && !/^(\+91)?[6-9]\d{9}$/.test(phone)) errors.phone = "Enter a 10-digit Indian mobile number.";

  if (!values.service) errors.service = "Choose a service.";
  if (values.message.trim().length < 10) errors.message = "Describe the cargo, route and quantity in at least 10 characters.";
  return errors;
}

function buildEnquiryText(ref, values) {
  return [
    `Reference: ${ref}`,
    `Name: ${values.name.trim()}`,
    `Company: ${values.company.trim() || "-"}`,
    `Email: ${values.email.trim()}`,
    `Phone: ${values.phone.trim() || "-"}`,
    `Service: ${values.service}`,
    ``,
    values.message.trim()
  ].join("\n");
}

function backupButtons(ref, text) {
  const mailto = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Rail freight enquiry " + ref)}&body=${encodeURIComponent(text)}`;
  const wa = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  return `<div class="btn-row">
      <a class="btn btn-whatsapp" href="${wa}" target="_blank" rel="noopener noreferrer">Send on WhatsApp</a>
      <a class="btn btn-outline" href="${mailto}">Send by email app</a>
    </div>`;
}

function keyIsSet() {
  return CONFIG.web3formsKey && !CONFIG.web3formsKey.startsWith("PASTE_");
}

enquiryForm.addEventListener("submit", async e => {
  e.preventDefault();
  const values = Object.fromEntries(new FormData(enquiryForm).entries());
  const errors = validateEnquiry(values);

  $$("[data-error-for]", enquiryForm).forEach(span => {
    const key = span.dataset.errorFor;
    span.textContent = errors[key] || "";
    const field = enquiryForm.elements[key];
    if (field) field.setAttribute("aria-invalid", errors[key] ? "true" : "false");
  });

  const firstBad = Object.keys(errors)[0];
  if (firstBad) {
    formStatus.innerHTML = "";
    enquiryForm.elements[firstBad].focus();
    return;
  }

  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  const ref = `ENQ-${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
  const text = buildEnquiryText(ref, values);

  // No Web3Forms key yet: offer the backup options straight away.
  if (!keyIsSet()) {
    formStatus.innerHTML = `
      <div class="notice notice--warn">
        <p class="notice-title">Automatic sending is not switched on yet.</p>
        <p>Your enquiry ${ref} is ready. Send it with one of these buttons.</p>
        ${backupButtons(ref, text)}
      </div>`;
    return;
  }

  // Send for real through Web3Forms, which emails the enquiry to the key owner.
  const sendBtn = enquiryForm.querySelector('button[type="submit"]');
  const label = sendBtn.textContent;
  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";
  formStatus.innerHTML = "";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        access_key: CONFIG.web3formsKey,
        subject: `Rail freight enquiry ${ref}: ${values.service}`,
        from_name: "RakeLink website",
        reference: ref,
        name: values.name.trim(),
        company: values.company.trim() || "-",
        email: values.email.trim(),
        phone: values.phone.trim() || "-",
        service: values.service,
        message: values.message.trim()
      })
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || "Send failed");

    formStatus.innerHTML = `
      <div class="notice notice--ok">
        <p class="notice-title">Thank you. Your enquiry has been sent.</p>
        <p>Your reference is <strong>${ref}</strong>. The booking desk will reply to ${esc(values.email.trim())} within one working day.</p>
      </div>`;
    enquiryForm.reset();
  } catch (err) {
    formStatus.innerHTML = `
      <div class="notice notice--error">
        <p class="notice-title">We could not send the enquiry from this page.</p>
        <p>Check your internet connection and try again, or send the same enquiry using a button below.</p>
        ${backupButtons(ref, text)}
      </div>`;
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = label;
  }
});
