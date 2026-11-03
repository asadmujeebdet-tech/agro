import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

// ---- EDIT YOUR SHOP DETAILS HERE ----
const shop = {
  name: "Kisan Care Center",
  tagline: "Trusted crop protection, right at your village market.",
  phone: "923008038009", // WhatsApp number (+92 300 8038009)
  mapUrl: "https://maps.app.goo.gl/yrrzq8PGNeKmUYYJA",
  lat: 30.2606453, lng: 71.7718178, // used for the map in the footer
  email: "waqas.ahmed@gmail.com",
  // ---- CREDIBILITY: fill in your real details ----
  license: "ENTER-YOUR-LICENSE-NUMBER",
  dealerOf: ["Jaffer Agro"], // brands you are an authorized dealer of
  address: "Multan, Punjab, Pakistan",
  hours: "Mon - Sun 10am - 6pm",
};

// ---- EDIT YOUR PRODUCTS HERE ----
const P = (id,brand,cat,color,pack,name,nameUr,ingredient,ingredientUr,image)=>({
  id,brand,category:cat,color,pack,name,nameUr,
  crops:"See product label",cropsUr:"فصلوں کی تفصیل لیبل پر دیکھیں",
  use:`Active ingredient: ${ingredient}.`,
  useUr:`فعال اجزا: ${ingredientUr}۔`,
  image:image.startsWith("/products/") ? image : `https://www.kissanghar.pk/assets/img/product/${image}`,
});
const I="Insecticide",F="Fungicide",H="Herbicide";
const products = [
  // Representative product names and package images from public Kissan Ghar listings; these are not a live inventory.
  P(1,"Bayer",I,"#e0a526","100 g","Lasenta 40 WG","لیسنٹا 40 ڈبلیو جی","Fipronil + Imidacloprid","فپرونل اور امیڈاکلوپرڈ","/products/p1.jpg"),
  P(2,"Bayer",F,"#2f7d8f","200 ml","Sparkle","اسپارکل","Azoxystrobin + Difenoconazole","ایزوکسِسٹرابِن اور ڈائی فینوکونازول","/products/p2.jpg"),
  P(3,"Bayer",F,"#6d9b2f","1 kg","Sulphur 80 WDG","سلفر 80 ڈبلیو ڈی جی","Sulphur","سلفر","/products/p3.jpg"),
  P(4,"Bayer",F,"#4aa3b5","600 ml","Infinito 68.76 SC","انفینیٹو 68.76 ایس سی","Fluopicolide + Propamocarb hydrochloride","فلوپیکولائیڈ اور پروپاموکارب ہائیڈروکلورائیڈ","/products/p4.jpg"),
  P(5,"Bayer",I,"#b5475f","240 ml","Decis Super 100 EC","ڈیسیس سپر 100 ای سی","Deltamethrin","ڈیلٹامیتھرین","/products/p5.jpg"),
  P(6,"Bayer",H,"#8a5fb5","500 ml","Challenge","چیلنج","Aclonifen","ایکلونیفن","/products/p6.jpg"),
  P(7,"Syngenta",I,"#c9a227","1 L","Karate 2.5 EC","کراٹے 2.5 ای سی","Lambda-cyhalothrin","لیمبڈا سائہیلوتھرین","/products/p7.jpg"),
  P(8,"Syngenta",H,"#e07a3f","400 ml","Primextra Gold","پرائمیکسٹرا گولڈ","Atrazine + S-metolachlor","ایٹرازین اور ایس میٹولا کلور","/products/p8.jpg"),
  P(10,"FMC",F,"#c0577a","120 ml","Soduku 42 SC","سوڈوکو 42 ایس سی","Chlorothalonil + Tebuconazole","کلوروتھالونل اور ٹیبوکونازول","07361720250221603.jpg"),
];

app.get("/api/shop", (_, res) => res.json(shop));
const withImg = (p) => ({ ...p });
app.get("/api/products", (req, res) => {
  const { category, brand, q } = req.query;
  let list = products;
  if (category && category !== "All") list = list.filter((p) => p.category === category);
  if (brand && brand !== "All") list = list.filter((p) => p.brand === brand);
  if (q) list = list.filter((p) => (p.name + p.crops + p.nameUr).toLowerCase().includes(String(q).toLowerCase()));
  res.json(list.map(withImg));
});

// Customer enquiries are saved to enquiries.json
app.post("/api/enquiry", (req, res) => {
  const { name, phone, message } = req.body || {};
  if (!name || !phone || !message) return res.status(400).json({ error: "Please fill in name, phone and message." });
  const file = path.join(__dirname, "enquiries.json");
  const all = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
  all.push({ name, phone, message, at: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(all, null, 2));
  res.json({ ok: true });
});

// Serve the built React app in production
const dist = path.join(__dirname, "../client/dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_, res) => res.sendFile(path.join(dist, "index.html")));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
