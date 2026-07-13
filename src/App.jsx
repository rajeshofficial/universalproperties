import React, { useEffect, useMemo, useState } from "react";

const Arrow = () => <span aria-hidden="true">→</span>;

const Icon = ({ name, size = 24 }) => {
  const paths = {
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.1 9.88a16 16 0 0 0 6 6l1.25-1.25a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.9Z" />,
    award: <><circle cx="12" cy="8" r="6" /><path d="m8.5 13-1.4 8 4.9-3 4.9 3-1.4-8" /></>,
    trend: <><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
    building: <><path d="M4 21V5h11v16M15 9h5v12M8 9h3M8 13h3M8 17h3" /></>,
    users: <><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2M16 3.1a4 4 0 0 1 0 7.8M22 21v-2a4 4 0 0 0-3-3.9" /></>,
    pin: <><path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
    expand: <><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" /></>,
    home: <><path d="m3 10 9-8 9 8v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M9 22V12h6v10" /></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-9 5.7a2 2 0 0 1-2 0L2 7" /></>,
    message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.7-5A8 8 0 1 1 21 15Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
    key: <><circle cx="8" cy="15" r="5" /><path d="m12 11 8-8M17 6l2 2" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V4h8v3M3 12h18" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const stats = [
  ["award", "30+", "Years of Experience"],
  ["trend", "1,200+", "Projects Completed"],
  ["building", "10K+", "Properties Sold"],
  ["users", "9,900+", "Happy Clients"],
];

const properties = [
  { tag: "Apartment", name: "Skyline Residency", place: "Rohini, Delhi", area: "161 gaz", type: "Apartment", price: "₹ 1.85 Cr", image: "/assets/apartment.jpg" },
  { tag: "Villa", name: "Eldeco County Villa", place: "Sonipat, Haryana", area: "244 gaz", type: "Villa", price: "₹ 2.40 Cr", image: "/assets/villa.jpg" },
  { tag: "Commercial", name: "Cyber Heights Tower", place: "Cyber City, Gurgaon", area: "344 gaz", type: "Commercial", price: "₹ 5.20 Cr", image: "/assets/commercial.jpg" },
  { tag: "Apartment", name: "Noida Greens Residency", place: "Sector 78, Noida", area: "147 gaz", type: "Apartment", price: "₹ 1.65 Cr", image: "/assets/noida.jpg" },
  { tag: "Villa", name: "The Palms Villa", place: "Greater Noida", area: "311 gaz", type: "Villa", price: "₹ 3.10 Cr", image: "/assets/villa-pool.jpg" },
  { tag: "Penthouse", name: "Capital Penthouse", place: "Central Delhi", area: "400 gaz", type: "Penthouse", price: "₹ 7.95 Cr", image: "/assets/penthouse.jpg" },
];

const testimonials = [
  { quote: "Prashant ji guided us through every step of buying our first home. Their finance advisory saved us lakhs on the home loan.", name: "Rajesh Sharma", role: "Home Buyer, Rohini" },
  { quote: "Universal Group helped me build a property portfolio across NCR. Honest, professional and always available.", name: "Anita Verma", role: "Investor, Noida" },
  { quote: "Found the perfect commercial space for my expansion. Smooth documentation and excellent negotiation.", name: "Vikram Singh", role: "Business Owner, Gurgaon" },
];

const services = [
  ["home", "Residential Property", "Apartments, villas and floors curated for families across NCR."],
  ["building", "Commercial Property", "Offices, retail outlets, warehouses and leasing."],
  ["trend", "Property Investment", "Pre-launch, under-construction and resale opportunities with ROI analysis."],
  ["key", "Home Loan Assistance", "Compare and secure the best home loan rates from 25+ banks."],
  ["document", "Property Documentation", "Sale deed, registry, mutation and complete legal paperwork support."],
  ["briefcase", "Finance Advisory", "LAP, balance transfers, refinancing and structured property finance."],
];

const routes = [
  ["/", "Home"], ["/about", "About"], ["/properties", "Properties"],
  ["/services", "Services"], ["/sell", "Sell"], ["/contact", "Contact"],
];

async function readJson(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`The server returned an invalid response (${response.status}). Please check that the backend is running.`);
  }
}

function apiProperty(item) {
  const images = item.image_urls?.length
    ? item.image_urls
    : [item.image_url || "/assets/apartment.jpg"];
  return {
    id: item.id,
    tag: item.category,
    name: item.title,
    place: item.location,
    area: item.area,
    type: item.property_type,
    price: item.price,
    description: item.description,
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    status: item.status,
    featured: item.featured,
    youtube_url: item.youtube_url || "",
    images,
    image: images[0],
  };
}

function youtubeEmbedUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    let id = "";
    if (host === "youtu.be") id = url.pathname.split("/").filter(Boolean)[0] || "";
    if (["youtube.com", "m.youtube.com"].includes(host)) {
      id = url.pathname === "/watch"
        ? url.searchParams.get("v") || ""
        : url.pathname.match(/^\/(?:embed|shorts)\/([^/?]+)/)?.[1] || "";
    }
    return /^[A-Za-z0-9_-]{6,20}$/.test(id) ? `https://www.youtube.com/embed/${id}` : "";
  } catch {
    return "";
  }
}

function useProperties(fallback = properties) {
  const [items, setItems] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/properties")
      .then((response) => {
        if (!response.ok) throw new Error("Properties API unavailable");
        return readJson(response);
      })
      .then((data) => {
        if (active && data.length) setItems(data.map(apiProperty));
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return { items, loading };
}

function Header() {
  const [open, setOpen] = useState(false);
  const path = window.location.pathname;
  return (
    <header className="header">
      <a className="brand" href="/" aria-label="Universal Group home">
        <img src="/assets/logo.png" alt="" /><strong>Universal Group</strong><span>Builder &amp; Finance Advisor</span>
      </a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}><span /><span /><span /></button>
      <nav className={open ? "nav open" : "nav"} onClick={() => setOpen(false)}>
        {routes.map(([href, label]) => <a className={path === href ? "active" : ""} href={href} key={href}>{label}</a>)}
      </nav>
      <a className="phone-pill" href="tel:9999561999"><Icon name="phone" size={18} />9999561999</a>
    </header>
  );
}

function PropertyCard({ item }) {
  return (
    <article className="property-card">
      <div className="property-image"><img src={item.image} alt={item.name} /><span>{item.tag}</span></div>
      <div className="property-body">
        <h3>{item.name}</h3><p className="location"><Icon name="pin" size={15} />{item.place}</p>
        <div className="property-meta"><span><Icon name="expand" size={16} />{item.area}</span><span><Icon name="home" size={16} />{item.type}</span></div>
        <div className="property-footer"><strong>{item.price}</strong><a href={item.id ? `/properties/${item.id}` : "/contact"}>View Details <Arrow /></a></div>
      </div>
    </article>
  );
}

function PageHero({ eyebrow, title, copy }) {
  return <section className="page-hero"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{copy && <p>{copy}</p>}</section>;
}

function HomePage() {
  const { items } = useProperties();
  const featured = items.filter((item) => item.featured);
  const homepageProperties = (featured.length ? featured : items).slice(0, 3);
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Builder &amp; Finance Advisor</p>
          <h1>Find a home that<br /><span>elevates</span> your every day.</h1>
          <p className="hero-copy">Universal Group is Delhi NCR's trusted partner for premium residential, commercial and investment properties — backed by expert real estate finance advisory.</p>
          <div className="hero-actions"><a className="button primary" href="/properties">View Properties <Arrow /></a><a className="button secondary" href="/contact">Contact Us</a></div>
        </div>
      </section>
      <section className="stats" aria-label="Our achievements">
        {stats.map(([icon, value, label]) => <div className="stat" key={label}><Icon name={icon} size={37} /><strong>{value}</strong><span>{label}</span></div>)}
      </section>
      <section className="about section">
        <div className="about-copy"><p className="eyebrow">About Universal Group</p><h2>A legacy built on <span>trust.</span></h2><p>For over 30 years, Universal Group has helped families and businesses find the right property — and the right way to finance it. From Rohini to Gurgaon, we combine local expertise with end-to-end advisory.</p><a className="text-link" href="/about">Learn more <Arrow /></a></div>
        <div className="about-visual"><img src="/assets/villa-pool.jpg" alt="Luxury property" /><div className="transaction"><strong>₹500 Cr+</strong><span>Properties Transacted</span></div></div>
      </section>
      <section className="listings section">
        <div className="section-heading"><div><p className="eyebrow">Featured Listings</p><h2>Handpicked premium properties</h2></div><a className="text-link" href="/properties">View all <Arrow /></a></div>
        <div className="property-grid">{homepageProperties.map((item) => <PropertyCard key={item.id || item.name} item={item} />)}</div>
      </section>
      <section className="testimonials section">
        <div className="center-heading"><p className="eyebrow">Testimonials</p><h2>Trusted by 9,900+ families</h2></div>
        <div className="testimonial-grid">{testimonials.map((item) => <article className="testimonial" key={item.name}><div className="stars">★★★★★</div><span className="quote-mark">”</span><p>"{item.quote}"</p><div className="author"><strong>{item.name}</strong><span>{item.role}</span></div></article>)}</div>
      </section>
      <section className="cta">
        <h2>Ready to find your <span>dream property?</span></h2><p>Talk to our advisors today — free consultation on property and home loans.</p>
        <div><a className="button primary" href="/contact">Get in Touch</a><a className="button secondary" href="tel:9958326661">Call 9958326661</a></div>
      </section>
    </main>
  );
}

function AboutPage() {
  const expertise = [
    ["home", "Property Buying", "End-to-end guidance from shortlisting to keys-in-hand."],
    ["trend", "Property Selling", "Maximum value for your property with the right buyers."],
    ["briefcase", "Investment Consultation", "Data-backed recommendations across NCR micro-markets."],
    ["key", "Home Loans", "Best rates from leading banks, paperwork handled."],
    ["building", "Commercial Property", "Offices, retail and warehousing solutions."],
    ["document", "Real Estate Finance", "LAP, balance transfers and structured property finance."],
  ];
  return <main><PageHero eyebrow="About" title="Who is Universal Group?" copy="A Unit of P.A. Realtors Pvt. Ltd." />
    <section className="story page-section"><img src="/assets/apartment.jpg" alt="Universal Group property" /><div><p className="eyebrow">Our Story</p><h2>30+ years of building trust across NCR</h2><p>Universal Group, a unit of P.A. Realtors Pvt. Ltd., is led by Pradeep Maheshwari — Director — alongside Prashant Maheshwari, a seasoned Property Dealer &amp; Finance Advisor. With 1,200+ projects completed, 10K+ properties sold and 9,900+ happy clients, we serve Delhi, Gurgaon, Noida, Greater Noida and Sonipat from our Rohini head office and Sonipat branch.</p><ul className="check-list">{["RERA-aware transactions","Transparent pricing & documentation","In-house finance advisory desk","Personalised after-sale support"].map(x=><li key={x}><Icon name="check" size={16}/>{x}</li>)}</ul></div></section>
    <section className="expertise page-section"><div className="center-heading"><p className="eyebrow">Our Expertise</p><h2>A complete real estate partner</h2></div><div className="service-grid">{expertise.map(([icon,title,copy])=><article className="service-card" key={title}><span className="service-icon"><Icon name={icon}/></span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  </main>;
}

function PropertiesPage() {
  const [filter, setFilter] = useState("All");
  const { items, loading } = useProperties();
  const places = ["All", ...new Set(items.map((item) => item.place))];
  const filtered = useMemo(() => filter === "All" ? items : items.filter((item) => item.place === filter), [filter, items]);
  return <main><PageHero eyebrow="Listings" title="Discover Your Next Address" copy="Curated premium properties across Delhi NCR, Sonipat, Gurgaon and Noida." />
    <section className="catalog page-section"><div className="filters">{places.map(place=><button className={filter === place ? "selected" : ""} onClick={()=>setFilter(place)} key={place}>{place}</button>)}</div>{loading && <p className="loading-note">Checking for new listings…</p>}<div className="property-grid">{filtered.map(item=><PropertyCard item={item} key={item.id || item.name}/>)}</div></section>
  </main>;
}

function PropertyDetailPage({ id }) {
  const [item, setItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/properties/${id}`)
      .then(async (response) => {
        const data = await readJson(response);
        if (!response.ok) throw new Error(data.error || "Property not found");
        return data;
      })
      .then((data) => active && setItem(apiProperty(data)))
      .catch((err) => active && setError(err.message));
    return () => { active = false; };
  }, [id]);

  if (error) return <main><PageHero eyebrow="Property" title="Property not found" copy={error}/><div className="not-found"><a className="button primary" href="/properties">Back to Properties</a></div></main>;
  if (!item) return <main className="property-detail-loading"><p>Loading property details…</p></main>;

  const embedUrl = youtubeEmbedUrl(item.youtube_url);
  return <main className="property-detail-page">
    <section className="property-detail-heading">
      <div><p className="eyebrow">{item.tag}</p><h1>{item.name}</h1><p><Icon name="pin" size={17}/>{item.place}</p></div>
      <div><span>{item.status}</span><strong>{item.price}</strong></div>
    </section>
    <section className="property-detail-layout">
      <div className="property-gallery">
        <div className="gallery-main"><img src={item.images[selectedImage]} alt={`${item.name} view ${selectedImage + 1}`}/><span>{selectedImage + 1} / {item.images.length}</span></div>
        {item.images.length > 1 && <div className="gallery-thumbnails">{item.images.map((image, index)=><button className={selectedImage === index ? "selected" : ""} type="button" onClick={()=>setSelectedImage(index)} key={image}><img src={image} alt={`Select view ${index + 1}`}/></button>)}</div>}
      </div>
      <aside className="property-summary">
        <h2>Property Details</h2>
        <dl><div><dt>Property type</dt><dd>{item.type}</dd></div><div><dt>Area</dt><dd>{item.area}</dd></div>{item.bedrooms != null && <div><dt>Bedrooms</dt><dd>{item.bedrooms}</dd></div>}{item.bathrooms != null && <div><dt>Bathrooms</dt><dd>{item.bathrooms}</dd></div>}<div><dt>Status</dt><dd>{item.status}</dd></div></dl>
        <a className="button primary" href={`/contact?property=${encodeURIComponent(item.name)}`}>Enquire About This Property <Arrow /></a>
        <a className="detail-phone" href="tel:9999561999"><Icon name="phone" size={18}/> Call +91 9999561999</a>
      </aside>
    </section>
    <section className="property-description"><p className="eyebrow">Overview</p><h2>About this property</h2><p>{item.description || "Contact Universal Group for complete property details, availability and a guided site visit."}</p></section>
    {embedUrl && <section className="property-video"><div><p className="eyebrow">Video Tour</p><h2>Explore the property</h2></div><div className="video-frame"><iframe src={embedUrl} title={`${item.name} video tour`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div></section>}
  </main>;
}

function ServicesPage() {
  return <main><PageHero eyebrow="Services" title="Everything you need, under one roof" copy="From your first site visit to home-loan disbursal — we handle it end-to-end." />
    <section className="services-page page-section"><div className="service-grid">{services.map(([icon,title,copy])=><article className="service-card large" key={title}><span className="service-icon"><Icon name={icon}/></span><h3>{title}</h3><p>{copy}</p><a href="/contact">Learn more <Arrow /></a></article>)}</div></section>
  </main>;
}

function FormSuccess({ children }) {
  return <div className="form-success"><span><Icon name="check" /></span><strong>{children}</strong></div>;
}

function SellPage() {
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); };
  return <main><PageHero title="Sell Your Property" copy="List with Universal Group and reach the right buyers — quickly and confidently." />
    <section className="split-page page-section"><div className="why-sell"><h2>Why list with us?</h2><p>With 30+ years of experience and 9,900+ happy clients across Delhi NCR, Universal Group ensures your property gets the visibility and value it deserves.</p>{[["trend","Fair Valuation","Get accurate market-driven pricing for your property."],["users","Verified Buyers","We connect you with genuine, pre-qualified buyers."],["document","End-to-End Support","From paperwork to registration, we handle it all."]].map(([icon,title,copy])=><div className="benefit" key={title}><span><Icon name={icon}/></span><div><h4>{title}</h4><p>{copy}</p></div></div>)}</div>
      <div className="form-card"><h3>List Your Property</h3><p>Share your details and our advisor will get back to you within 24 hours.</p>{sent ? <FormSuccess>Listing request received</FormSuccess> : <form onSubmit={submit}><label>Full Name *<input required placeholder="Your full name"/></label><label>Phone Number *<input required inputMode="tel" placeholder="10-digit mobile"/></label><label>Email (optional)<input type="email" placeholder="you@example.com"/></label><label>Property Address *<textarea required placeholder="Full address with locality, city & pincode"/></label><label>Property Type<select><option>Residential</option><option>Commercial</option><option>Plot / Land</option><option>Builder Floor</option><option>Apartment</option><option>Other</option></select></label><label>Additional Details (optional)<textarea placeholder="Size (gaz/sq.yd), expected price, age of property..."/></label><button className="submit-button">Submit Listing Request</button><small>By submitting, you agree to be contacted by our team regarding your property.</small></form>}</div>
    </section>
  </main>;
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); };
  return <main><PageHero eyebrow="Contact" title="Let's talk about your next move" copy="Our advisors are available 7 days a week." />
    <section className="split-page contact-page page-section"><div><h2>Get in touch</h2><p>Reach out via phone, email or visit our offices.</p><div className="contact-cards"><div><span><Icon name="phone"/></span><p><strong>Pradeep Maheshwari</strong><small>Director</small><a href="tel:9999561999">+91 9999561999</a></p></div><div><span><Icon name="phone"/></span><p><strong>Prashant Maheshwari</strong><small>Property Dealer &amp; Finance Advisor</small><a href="tel:9958326661">+91 9958326661</a></p></div><div><span><Icon name="mail"/></span><p><strong>Email</strong><a href="mailto:info@universalgroup.in">info@universalgroup.in</a></p></div><div><span><Icon name="pin"/></span><p><strong>Delhi NCR Head Office</strong><small>Plot No. 32, Pocket-11, Sector-24, Rohini, Delhi-110085</small></p></div><div><span><Icon name="pin"/></span><p><strong>Sonipat Branch Office</strong><small>Villa No. 2016, Eldeco County, G.T. Road, Sonipat, Haryana</small></p></div></div></div>
      <div className="form-card"><h2>Send us a message</h2><p>We'll get back within 24 hours.</p>{sent ? <FormSuccess>Message sent successfully</FormSuccess> : <form onSubmit={submit}><input aria-label="Full Name" required placeholder="Full Name"/><input aria-label="Email" required type="email" placeholder="Email"/><input aria-label="Phone" required inputMode="tel" placeholder="Phone"/><select aria-label="Interested in"><option>Interested in: Residential</option><option>Interested in: Commercial</option><option>Interested in: Investment</option><option>Interested in: Home Loan</option></select><textarea aria-label="Your message" required placeholder="Your message"/><button className="submit-button">Send Message <Arrow /></button></form>}</div>
    </section><div className="map-placeholder"><Icon name="pin" size={38}/><strong>Universal Group — Delhi NCR</strong><span>Plot No. 32, Sector-24, Rohini</span></div>
  </main>;
}

const emptyProperty = {
  title: "", category: "Apartment", location: "", area: "", property_type: "Apartment",
  price: "", description: "", youtube_url: "", bedrooms: "", bathrooms: "", status: "Available", featured: false,
};

function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem("property_admin_token") || "");
  const [login, setLogin] = useState({ username: "admin", password: "" });
  const [form, setForm] = useState(emptyProperty);
  const [editingId, setEditingId] = useState("");
  const [images, setImages] = useState([]);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const loadItems = async () => {
    const response = await fetch("/api/properties");
    if (!response.ok) throw new Error("Could not load properties");
    setItems(await readJson(response));
  };

  useEffect(() => {
    if (token) loadItems().catch((err) => setError(err.message));
  }, [token]);

  const submitLogin = async (event) => {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(login),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("property_admin_token", data.token);
      setToken(data.token);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const logout = () => {
    localStorage.removeItem("property_admin_token");
    setToken(""); setItems([]);
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setError(""); setMessage("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match."); return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error || "Could not change password");
      window.alert(data.message);
      logout();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    if (name === "category" && !editingId) setForm((current) => ({ ...current, category: value, property_type: value }));
  };

  const resetForm = () => {
    setForm(emptyProperty); setEditingId(""); setImages([]);
    const input = document.getElementById("property-image");
    if (input) input.value = "";
  };

  const saveProperty = async (event) => {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, String(value)));
      images.forEach((image) => payload.append("images", image));
      const url = editingId ? `/api/admin/properties/${editingId}` : "/api/admin/properties";
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const data = await readJson(response);
      if (response.status === 401) { logout(); throw new Error("Session expired. Please log in again."); }
      if (!response.ok) throw new Error(data.error || "Could not save property");
      setMessage(editingId ? "Property updated." : "Property published.");
      resetForm();
      await loadItems();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const editProperty = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title, category: item.category, location: item.location, area: item.area,
      property_type: item.property_type, price: item.price, description: item.description || "",
      youtube_url: item.youtube_url || "",
      bedrooms: item.bedrooms ?? "", bathrooms: item.bathrooms ?? "", status: item.status,
      featured: Boolean(item.featured),
    });
    setImages([]); setMessage(""); setError("");
    window.scrollTo({ top: 360, behavior: "smooth" });
  };

  const deleteProperty = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/admin/properties/${item.id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) { logout(); throw new Error("Session expired. Please log in again."); }
      if (!response.ok) throw new Error("Could not delete property");
      setMessage("Property deleted.");
      await loadItems();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  if (!token) {
    return <main className="admin-page"><PageHero eyebrow="Secure Area" title="Property Admin" copy="Sign in to manage listings." />
      <section className="admin-login page-section"><form className="form-card" onSubmit={submitLogin}><h2>Admin Login</h2><p>Use the credentials configured in Hostinger environment variables.</p>{error && <div className="admin-alert error">{error}</div>}<label>Username<input name="username" autoComplete="username" value={login.username} onChange={(e)=>setLogin({...login,username:e.target.value})}/></label><label>Password<input name="password" type="password" autoComplete="current-password" value={login.password} onChange={(e)=>setLogin({...login,password:e.target.value})}/></label><button className="submit-button" disabled={busy}>{busy ? "Signing in…" : "Sign In"}</button></form></section>
    </main>;
  }

  return <main className="admin-page"><PageHero eyebrow="Dashboard" title="Manage Properties" copy="Publish, edit and remove website listings." />
    <section className="admin-shell page-section"><div className="admin-toolbar"><div><h2>{editingId ? "Edit Property" : "Add Property"}</h2><p>Fields marked * are required. Select 1–7 JPG, PNG or WebP images (5MB each, 14MB combined).</p></div><div className="admin-toolbar-actions"><button className="admin-logout" onClick={()=>setShowPasswordForm(!showPasswordForm)}>Change password</button><button className="admin-logout" onClick={logout}>Log out</button></div></div>
      {error && <div className="admin-alert error">{error}</div>}{message && <div className="admin-alert success">{message}</div>}
      {showPasswordForm && <form className="admin-password-form form-card" onSubmit={changePassword}>
        <div><h3>Change admin password</h3><p>Use at least 12 characters. You will be signed out after changing it.</p></div>
        <label>Current password<input type="password" autoComplete="current-password" required value={passwordForm.currentPassword} onChange={(e)=>setPasswordForm({...passwordForm,currentPassword:e.target.value})}/></label>
        <label>New password<input type="password" autoComplete="new-password" minLength="12" required value={passwordForm.newPassword} onChange={(e)=>setPasswordForm({...passwordForm,newPassword:e.target.value})}/></label>
        <label>Confirm new password<input type="password" autoComplete="new-password" minLength="12" required value={passwordForm.confirmPassword} onChange={(e)=>setPasswordForm({...passwordForm,confirmPassword:e.target.value})}/></label>
        <div className="admin-form-actions"><button className="submit-button" disabled={busy}>{busy ? "Changing…" : "Change Password"}</button><button type="button" className="cancel-button" onClick={()=>setShowPasswordForm(false)}>Cancel</button></div>
      </form>}
      <form className="admin-property-form form-card" onSubmit={saveProperty}>
        <label>Property Title *<input name="title" required value={form.title} onChange={updateField} placeholder="Skyline Residency"/></label>
        <label>Category *<select name="category" value={form.category} onChange={updateField}>{["Apartment","Villa","Commercial","Penthouse","Plot / Land","Builder Floor","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Location *<input name="location" required value={form.location} onChange={updateField} placeholder="Rohini, Delhi"/></label>
        <label>Area *<input name="area" required value={form.area} onChange={updateField} placeholder="161 gaz"/></label>
        <label>Property Type *<input name="property_type" required value={form.property_type} onChange={updateField} placeholder="Apartment"/></label>
        <label>Price *<input name="price" required value={form.price} onChange={updateField} placeholder="₹ 1.85 Cr"/></label>
        <label>Bedrooms<input name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={updateField}/></label>
        <label>Bathrooms<input name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={updateField}/></label>
        <label>Status<select name="status" value={form.status} onChange={updateField}><option>Available</option><option>Sold</option><option>Rented</option></select></label>
        <label>Property Images {editingId ? "(select new images to replace gallery)" : "*"}<input id="property-image" type="file" accept="image/jpeg,image/png,image/webp" multiple required={!editingId} onChange={(e)=>{const selected = Array.from(e.target.files || []); if (selected.length > 7) { setError("Please select a maximum of 7 images."); e.target.value = ""; setImages([]); } else { setError(""); setImages(selected); }}}/>{images.length > 0 && <small>{images.length} image{images.length === 1 ? "" : "s"} selected</small>}</label>
        <label>YouTube Video Link<input name="youtube_url" type="url" value={form.youtube_url} onChange={updateField} placeholder="https://www.youtube.com/watch?v=..."/></label>
        <label className="admin-description">Description<textarea name="description" value={form.description} onChange={updateField} placeholder="Property highlights, amenities and nearby landmarks…"/></label>
        <label className="featured-toggle"><input name="featured" type="checkbox" checked={form.featured} onChange={updateField}/> Show in featured listings</label>
        <div className="admin-form-actions"><button className="submit-button" disabled={busy}>{busy ? "Saving…" : editingId ? "Update Property" : "Publish Property"}</button>{editingId && <button type="button" className="cancel-button" onClick={resetForm}>Cancel Edit</button>}</div>
      </form>
      <div className="admin-list-heading"><h2>Published Properties</h2><span>{items.length} listings</span></div>
      <div className="admin-property-list">{items.map(item=><article key={item.id}><img src={item.image_url || "/assets/apartment.jpg"} alt=""/><div><span>{item.category} · {item.status}</span><h3>{item.title}</h3><p>{item.location} · {item.area} · {item.price}</p></div><div className="admin-row-actions"><button onClick={()=>editProperty(item)}>Edit</button><button className="danger" onClick={()=>deleteProperty(item)} disabled={busy}>Delete</button></div></article>)}</div>
    </section>
  </main>;
}

function NotFoundPage() {
  return <main><PageHero eyebrow="404" title="Page not found" copy="The page you requested does not exist."/><div className="not-found"><a className="button primary" href="/">Back to Home</a></div></main>;
}

function Footer() {
  return <footer><div className="footer-grid">
    <div className="footer-brand"><img src="/assets/logo.png" alt="" /><h3>Universal Group</h3><p>Builder &amp; Finance Advisor. Trusted property and finance partner across Delhi NCR, Sonipat, Gurgaon and Noida.</p><small>A Unit of P.A. Realtors Pvt. Ltd.</small><div className="socials"><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">◎</a><a href="#" aria-label="LinkedIn">in</a><a href="#" aria-label="Twitter">𝕏</a></div></div>
    <div><h4>Quick Links</h4><ul>{routes.map(([href,label])=><li key={href}><a href={href}>{label}</a></li>)}</ul></div>
    <div><h4>Offices</h4><div className="office"><strong>Delhi NCR Head Office</strong><p><Icon name="pin" size={16} />Plot No. 32, Pocket-11, Sector-24,<br />Rohini, Delhi-110085</p></div><div className="office"><strong>Sonipat Branch Office</strong><p><Icon name="pin" size={16} />Villa No. 2016, Eldeco County, G.T.<br />Road, Sonipat, Haryana</p></div></div>
    <div><h4>Contact</h4><ul className="contact-list"><li><Icon name="phone" size={16} /><span>Pradeep Maheshwari<a href="tel:9999561999">+91 9999561999</a></span></li><li><Icon name="phone" size={16} /><span>Prashant Maheshwari<a href="tel:9958326661">+91 9958326661</a></span></li><li><Icon name="mail" size={16} /><a href="mailto:info@universalgroup.in">info@universalgroup.in</a></li></ul></div>
  </div><div className="copyright">© 2026 Universal Group. All rights reserved.</div></footer>;
}

function App() {
  const pages = {"/": <HomePage/>, "/about": <AboutPage/>, "/properties": <PropertiesPage/>, "/services": <ServicesPage/>, "/sell": <SellPage/>, "/contact": <ContactPage/>, "/admin": <AdminPage/>};
  const propertyMatch = window.location.pathname.match(/^\/properties\/([a-f\d]{24})\/?$/i);
  const page = propertyMatch ? <PropertyDetailPage id={propertyMatch[1]}/> : pages[window.location.pathname] || <NotFoundPage/>;
  return <><Header />{page}<Footer/><a className="whatsapp" href="https://wa.me/919999561999?text=Hello%20Universal%20Group%2C%20I'd%20like%20to%20enquire%20about%20your%20services." target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><Icon name="message" size={28}/></a></>;
}

export default App;
