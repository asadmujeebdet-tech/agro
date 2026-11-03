import { useEffect, useRef, useState } from "react";

const CATS = ["All", "Insecticide", "Fungicide", "Herbicide"];
const UR_CAT = { All: "تمام", Insecticide: "کیڑے مار دوا", Fungicide: "پھپھوندی کش دوا", Herbicide: "جڑی بوٹی مار دوا" };
const UR_BRAND = { All: "تمام برانڈ", Bayer: "بائر", Syngenta: "سنگینٹا", FMC: "ایف ایم سی" };

const T = {
  en: {
    products: "Products", visit: "Visit us", ask: "Ask us", browse: "Browse the shelf", shelf: "Our shelf",
    search: "Search product or crop", none: "No product found. Try another name or call the shop.",
    tap: "Tap for details", crops: "Crops", pack: "Pack", brand: "Brand", use: "What it does",
    safety: "Safety", close: "Close", wa: "For More Details",
    auth: "Authorized Dealer", homeDelivery: "Home Delivery Available", contact: "Contact", timing: "Opening hours", email: "Email",
    safetyList: ["Read the label before use.", "Wear gloves, mask and full sleeves while spraying.", "Do not spray against the wind. Keep children and animals away.", "Ask us for the right dose for your acre."],
    askTitle: "Ask about a pest or a crop problem", name: "Your name", phone: "Phone number", msg: "Which crop, and what problem do you see?", send: "Send question",
    visitTitle: "Visit the shop", map: "Open in Google Maps", chat: "Chat on WhatsApp",
  },
  ur: {
    products: "مصنوعات", visit: "دکان پر آئیں", ask: "سوال پوچھیں", browse: "مصنوعات دیکھیں", shelf: "مصنوعات",
    search: "دوا یا فصل کا نام لکھیں", none: "کوئی دوا نہیں ملی۔ دوسرا نام لکھیں یا دکان پر فون کریں۔",
    tap: "تفصیل کے لیے دبائیں", crops: "فصلیں", pack: "پیکنگ", brand: "برانڈ", use: "یہ کیا کرتی ہے",
    safety: "حفاظتی ہدایات", close: "بند کریں", wa: "مزید تفصیلات کے لیے",
    auth: "مجاز ڈیلر", homeDelivery: "گھر تک ترسیل دستیاب ہے", contact: "رابطہ", timing: "اوقاتِ کار", email: "ای میل",
    safetyList: ["استعمال سے پہلے لیبل ضرور پڑھیں۔", "سپرے کے دوران دستانے، ماسک اور پورے بازو کے کپڑے پہنیں۔", "ہوا کے مخالف سپرے نہ کریں۔ بچوں اور جانوروں کو دور رکھیں۔", "اپنے ایکڑ کے لیے صحیح مقدار ہم سے پوچھیں۔"],
    askTitle: "فصل یا کیڑوں کے مسئلے کے بارے میں پوچھیں", name: "آپ کا نام", phone: "فون نمبر", msg: "کون سی فصل ہے اور کیا مسئلہ درپیش ہے؟", send: "سوال بھیجیں",
    visitTitle: "دکان پر تشریف لائیں", map: "گوگل میپس پر دیکھیں", chat: "واٹس ایپ پر رابطہ کریں",
  },
};

const Icon = ({ d, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const ICONS = {
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
  clock: "M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  delivery: "M3 5h11v12H3zM14 9h4l3 4v4h-7M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
};

function WhatsAppIcon() {
  return (
    <svg className="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#25d366" />
      <path d="M7.1 18.1 8 15.5a7 7 0 1 1 2.4 2.2l-3.3.4Zm3.5-2.1.5.3a5.4 5.4 0 1 0-1.8-1.6l.3.5-.5 1.4 1.5-.6Zm-1.2-5.8c.1-.3.3-.4.5-.4h.3c.1 0 .3 0 .4.3l.5 1.1c.1.2.1.3 0 .5l-.4.5c-.1.1-.2.2-.1.4.2.3.5.7.9 1 .5.4.9.5 1.1.6.2.1.3 0 .4-.1l.5-.6c.1-.2.3-.2.5-.1l1 .5c.2.1.3.2.3.3 0 .2-.1.8-.5 1.1-.3.3-.8.5-1.3.4-.5-.1-1.2-.3-2-.7-1.1-.6-1.8-1.5-2-1.8-.2-.3-.8-1.1-.8-1.8 0-.7.4-1.1.7-1.2Z" fill="#fff" />
    </svg>
  );
}

/* Real photo if the file exists in client/public/products, else the 3D bottle */
function Art({ p, lang }) {
  const [ok, setOk] = useState(true);
  return ok ? (
    <img className="photo" src={p.image} alt={lang === "ur" ? p.nameUr : p.name} loading="lazy" onError={() => setOk(false)} />
  ) : (
    <Bottle color={p.color} label={p.category[0]} />
  );
}

function Bottle({ color, label }) {
  return (
    <div className="bottle" style={{ "--c": color }}>
      <div className="cap" />
      <div className="body">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="face" style={{ transform: `rotateY(${i * 90}deg) translateZ(34px)` }}>
            {i % 2 === 0 && <span>{label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function LangSwitch({ lang, setLang }) {
  return (
    <div className="lang" role="group" aria-label="Language">
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>English</button>
      <button className={lang === "ur" ? "on urdu" : "urdu"} onClick={() => setLang("ur")}>اردو</button>
    </div>
  );
}

function Hero({ shop, products, lang, setLang }) {
  const t = T[lang];
  const [rot, setRot] = useState({ x: -8, y: 0 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setRot({ x: -8 + ((e.clientY - r.top) / r.height - 0.5) * -20, y: ((e.clientX - r.left) / r.width - 0.5) * 40 });
  };
  const items = products.slice(0, 6);
  return (
    <header className="hero" onMouseMove={onMove}>
      <nav>
        <b>{shop?.name}</b>
        <a href="#shelf">{t.products}</a>
        <a href="#visit">{t.visit}</a>
        <a href="#enquiry">{t.ask}</a>
        <LangSwitch lang={lang} setLang={setLang} />
      </nav>
      <div className="hero-grid">
        <div>
          <h1>{shop?.name || "Kisan Care Center"}</h1>
          <p className="lead">{lang === "ur" ? "آپ کی فصل کے تحفظ کے لیے، آپ کی مقامی منڈی میں قابلِ اعتماد رہنمائی۔" : shop?.tagline}</p>
          <a className="btn" href="#shelf">{t.browse}</a>
        </div>
        <div className="stage" aria-hidden="true">
          <div className="ring" style={{ transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}>
            <div className="spin">
              {items.map((p, i) => (
                <div key={p.id} className="slot" style={{ transform: `rotateY(${(360 / items.length) * i}deg) translateZ(clamp(100px, 35vw, 210px))` }}>
                  <div className="hero-product"><Art p={p} lang={lang} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="floor" />
        </div>
      </div>
    </header>
  );
}

function Card({ p, lang, onOpen }) {
  const ref = useRef(null);
  const t = T[lang];
  const tilt = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(700px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateZ(10px)`;
  };
  const reset = () => (ref.current.style.transform = "");
  return (
    <button ref={ref} className="card" onMouseMove={tilt} onMouseLeave={reset} onClick={() => onOpen(p)}>
      <div className="card-art">
        <Art p={p} lang={lang} />
      </div>
      <h3 className={lang === "ur" ? "urdu" : ""} dir={lang === "ur" ? "rtl" : "ltr"}>{lang === "ur" ? p.nameUr : p.name}</h3>
      <p className={"meta " + (lang === "ur" ? "urdu" : "")} dir={lang === "ur" ? "rtl" : "ltr"}>{lang === "ur" ? UR_CAT[p.category] : p.category} · <bdi dir="ltr">{p.pack}</bdi></p>
      <span className={"tap " + (lang === "ur" ? "urdu" : "")}>{t.tap}</span>
    </button>
  );
}

function Modal({ p, lang, setLang, phone, onClose }) {
  const t = T[lang];
  const ur = lang === "ur";
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  const wa = `https://wa.me/${phone}?text=${encodeURIComponent(`${p.name} (${p.pack})`)}`;
  const cls = ur ? "urdu" : "";
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose} aria-label={t.close}>×</button>
        <LangSwitch lang={lang} setLang={setLang} />
        <div className="modal-art">
          <Art p={p} lang={lang} />
        </div>
        <div dir={ur ? "rtl" : "ltr"} className={cls + " modal-text"}>
          <h2>{ur ? p.nameUr : p.name}</h2>
          <p className="meta">{ur ? UR_CAT[p.category] : p.category}</p>
          <dl>
            <dt>{t.brand}</dt><dd>{ur ? UR_BRAND[p.brand] : p.brand}</dd>
            <dt>{t.pack}</dt><dd>{p.pack}</dd>
            <dt>{t.crops}</dt><dd>{ur ? p.cropsUr : p.crops}</dd>
          </dl>
          <h4>{t.use}</h4>
          <p>{ur ? p.useUr : p.use}</p>
          <h4>{t.safety}</h4>
          <ul>{t.safetyList.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        <div className={"actions " + cls}>
          <a className="btn small whatsapp-cta" href={wa} target="_blank" rel="noreferrer"><WhatsAppIcon />{t.wa}</a>
        </div>
      </div>
    </div>
  );
}

function Enquiry({ lang, phone }) {
  const t = T[lang];
  const [f, setF] = useState({ name: "", phone: "", message: "" });
  const submit = (e) => {
    e.preventDefault();
    const message = `Name: ${f.name}\nPhone: ${f.phone}\nInquiry: ${f.message}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const cls = lang === "ur" ? "urdu" : "";
  return (
    <section id="enquiry" className="wrap" dir={lang === "ur" ? "rtl" : "ltr"}>
      <h2 className={cls}>{t.askTitle}</h2>
      <form className={"form " + cls} onSubmit={submit}>
        <input type="text" placeholder={t.name} value={f.name} onChange={on("name")} required />
        <input type="tel" placeholder={t.phone} value={f.phone} onChange={on("phone")} required />
        <textarea rows="4" placeholder={t.msg} value={f.message} onChange={on("message")} required />
        <button className="btn" type="submit" disabled={!phone}>{t.send}</button>
      </form>
    </section>
  );
}

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const [shop, setShop] = useState(null);
  const [all, setAll] = useState([]);
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const t = T[lang];
  const ur = lang === "ur";

  useEffect(() => {
    try { localStorage.setItem("lang", lang); } catch {}
    document.documentElement.lang = lang === "ur" ? "ur" : "en";
  }, [lang]);
  useEffect(() => {
    fetch("/api/shop").then((r) => r.json()).then(setShop).catch(() => {});
    fetch("/api/products").then((r) => r.json()).then(setAll).catch(() => {});
  }, []);
  useEffect(() => {
    fetch(`/api/products?category=${cat}&q=${encodeURIComponent(q)}`).then((r) => r.json()).then(setProducts).catch(() => {});
  }, [cat, q]);

  return (
    <>
      <Hero shop={shop} products={all} lang={lang} setLang={setLang} />
      <div className={"trust " + (ur ? "urdu" : "")} dir={ur ? "rtl" : "ltr"}>
        <Icon d={ICONS.shield} size={28} />
        <strong>{t.auth}</strong>
        <Icon d={ICONS.delivery} size={25} />
        <strong>{t.homeDelivery}</strong>
        <span><b>Dealer License</b> No: {shop?.license}</span>
      </div>
      <section id="shelf" className="wrap">
        <h2 className={ur ? "urdu" : ""}>{t.shelf}</h2>
        <div className="tools">
          <div className="filter-groups">
            <div className="tabs">
              {CATS.map((c) => (
                <button key={c} className={(c === cat ? "on " : "") + (ur ? "urdu" : "")} onClick={() => setCat(c)}>{ur ? UR_CAT[c] : c}</button>
              ))}
            </div>
          </div>
          <input className={"tools-search " + (ur ? "urdu" : "")} placeholder={t.search} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="grid">
          {products.map((p) => <Card key={p.id} p={p} lang={lang} onOpen={setOpen} />)}
          {!products.length && <p className={ur ? "urdu" : ""}>{t.none}</p>}
        </div>
      </section>
      <Enquiry lang={lang} phone={shop?.phone} />
      <footer id="visit" className="visit">
        <div className="visit-grid">
          <div dir={ur ? "rtl" : "ltr"} className="contact">
            <h2 className={ur ? "urdu" : ""}>{t.visitTitle}</h2>
            <div className="auth-badge"><Icon d={ICONS.shield} size={30} /><div><b className={ur ? "urdu" : ""}>{t.auth}</b><small><strong>Dealer License</strong> No: {shop?.license}</small></div></div>
            <ul className="info">
              <li><Icon d={ICONS.pin} /><span>{ur ? "سٹی مارکیٹ، ملتان روڈ، خانیوال، پنجاب، پاکستان" : shop?.address}</span></li>
              <li><Icon d={ICONS.phone} /><a dir="ltr" href="tel:+923008038009">+92 300 8038009</a></li>
              <li><Icon d={ICONS.clock} /><span>{ur ? "پیر تا اتوار: صبح 10 بجے سے شام 6 بجے تک" : shop?.hours}</span></li>
              <li><Icon d={ICONS.mail} /><a dir="ltr" href={`mailto:${shop?.email}`}>{shop?.email}</a></li>
            </ul>
            <div className="row">
              <a className={"btn " + (ur ? "urdu" : "")} href={shop?.mapUrl} target="_blank" rel="noreferrer">{t.map}</a>
              <a className={"btn " + (ur ? "urdu" : "")} href={`https://wa.me/${shop?.phone}`} target="_blank" rel="noreferrer">{t.chat}</a>
            </div>
          </div>
          <div className="map">
            {shop && <iframe title="Shop location" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${shop.lat},${shop.lng}&z=15&output=embed`} />}
          </div>
        </div>
      </footer>
      {open && <Modal p={open} lang={lang} setLang={setLang} phone={shop?.phone} onClose={() => setOpen(null)} />}
    </>
  );
}
