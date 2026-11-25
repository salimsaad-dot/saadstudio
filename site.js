// Saad Studio · page behaviour
const WHATSAPP = "233577428684";
const WA_TEXT = "Hi Saad Studio 👋 I'd like a website for my business.";

const WORK = [
  { img: "devef", title: "De-Vef Beauty", kind: "Hair salon · North Legon", line: "Customers see which chairs are free and book a time. The booking arrives on WhatsApp.", url: "https://salimsaad-dot.github.io/devef-/v2/" },
  { img: "devef-owner", title: "De-Vef owner page", kind: "Private bookings board", line: "Every chair, every booking. Confirm on WhatsApp with one tap and add walk-ins.", url: "https://salimsaad-dot.github.io/devef-/v2/bookings.html" },
  { img: "pammy", title: "Pammy's Lux", kind: "Skincare shop · Kasoa", line: "Lotions, scrubs and sets with prices. Customers fill a bag and order on WhatsApp.", url: "https://salimsaad-dot.github.io/pammyslux/" },
  { img: "pammy-owner", title: "Pammy's owner page", kind: "Products from the phone", line: "Add a product with a photo, change a price or mark it sold out in seconds.", url: "https://salimsaad-dot.github.io/pammyslux/admin.html" },
  { img: "bwoy", title: "90's Bwoy Clothing", kind: "Thrift fashion · North Legon", line: "Tees, jackets and sneakers by size, with pre-orders and WhatsApp checkout.", url: "https://salimsaad-dot.github.io/deens/" },
  { img: "kimex", title: "Kimexdolls", kind: "Wig installs · North Legon", line: "The full price list, and booking for installs, wigging and revamps on WhatsApp.", url: "https://salimsaad-dot.github.io/kimexdolls/" },
  { img: "kimex-owner", title: "Kimexdolls order board", kind: "Private order tracker", line: "Orders from received to collected, deposits and balances, and a one-tap 'your wig is ready' message.", url: "https://salimsaad-dot.github.io/kimexdolls/admin.html" },
  { img: "invite", title: "Naming ceremony invitation", kind: "Digital invitation", line: "Guests tap the seal to open it, see the details and RSVP. Shared as one link.", url: "https://salim-outdooring-demo.netlify.app/" },
  { img: "showroom", title: "Car showroom", kind: "Car dealership concept", line: "Brand new, foreign-used and Ghana-used cars with filters, prices and a quick finder.", url: "https://salimsaad-dot.github.io/showroom/" },
  { img: "showroom-car", title: "Car page", kind: "Car dealership concept", line: "Photos, a monthly instalment estimate, WhatsApp enquiry and test-drive booking.", url: "https://salimsaad-dot.github.io/showroom/?car=s-x5-2021" },
];

const $ = (id) => document.getElementById(id);

/* WhatsApp links */
const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WA_TEXT)}`;
document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = waUrl; a.target = "_blank"; a.rel = "noopener";
});

/* Header border once scrolled */
const hd = document.querySelector(".hd");
const onHd = () => hd.classList.toggle("scrolled", scrollY > 10);
onHd(); addEventListener("scroll", onHd, { passive: true });

/* Work ring */
const ring = $("ring");
const N = WORK.length, STEP = 360 / N;
ring.innerHTML = WORK.map((w, i) => `
  <li class="card" data-i="${i}">
    <a href="${w.url}" target="_blank" rel="noopener" aria-label="${w.title}: ${w.kind} (opens the site)">
      <img src="work/${w.img}.jpg" alt="${w.title} on a phone" width="520" height="780" ${i > 3 && i < N - 2 ? 'loading="lazy"' : ""} decoding="async" />
    </a>
  </li>`).join("");
const cards = [...ring.children];
const section = $("work");
const motion = document.documentElement.classList.contains("motion");

let cur = 0, target = 0, R = 0, front = -1, raf = 0;

const layout = () => {
  const w = cards[0].offsetWidth;
  R = Math.round((w / 2) / Math.tan(Math.PI / N) + w * 0.18);
  cards.forEach((c, i) => { c.style.transform = `rotateY(${i * STEP}deg) translateZ(${R}px)`; });
};

const showCaption = (i) => {
  if (i === front) return;
  front = i;
  const w = WORK[i];
  $("capKind").textContent = w.kind;
  $("capTitle").textContent = w.title;
  $("capLine").textContent = w.line;
  $("capLink").href = w.url;
  $("count").textContent = `${String(i + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
  cards.forEach((c, k) => c.classList.toggle("is-front", k === i));
};

const draw = () => {
  ring.style.transform = `translateZ(${-R}px) rotateX(-4deg) rotateY(${cur}deg)`;
  cards.forEach((c, i) => {
    let a = ((i * STEP + cur) % 360 + 540) % 360 - 180; // -180..180, 0 = facing you
    c.style.setProperty("--dim", Math.min(0.72, Math.abs(a) / 150).toFixed(3));
  });
  showCaption(((Math.round(-cur / STEP) % N) + N) % N);
};

const progress = () => {
  const r = section.getBoundingClientRect();
  const span = section.offsetHeight - innerHeight;
  return Math.min(1, Math.max(0, -r.top / span));
};

const tick = () => {
  cur += (target - cur) * 0.1;
  if (Math.abs(target - cur) < 0.02) cur = target;
  draw();
  raf = cur !== target ? requestAnimationFrame(tick) : 0;
};
const go = () => { if (!raf) raf = requestAnimationFrame(tick); };

// Scroll position that puts card i at the front
const scrollToCard = (i) => {
  const span = section.offsetHeight - innerHeight;
  const top = section.getBoundingClientRect().top + scrollY;
  scrollTo({ top: top + (i / (N - 1)) * span, behavior: "smooth" });
};

if (motion && window.CSS && CSS.supports("transform-style", "preserve-3d")) {
  section.classList.add("is-3d");
  layout();
  const onScroll = () => {
    target = -progress() * STEP * (N - 1); go();
    const r = section.getBoundingClientRect();
    document.body.classList.toggle("in-work", r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.5);
  };
  onScroll(); cur = target; draw();
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", () => { layout(); onScroll(); draw(); });
  $("prev").addEventListener("click", () => scrollToCard(Math.max(0, front - 1)));
  $("next").addEventListener("click", () => scrollToCard(Math.min(N - 1, front + 1)));
  // Keyboard: tabbing to a card brings it to the front
  cards.forEach((c, i) => c.querySelector("a").addEventListener("focus", () => scrollToCard(i)));
}

$("year").textContent = new Date().getFullYear();
