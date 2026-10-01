import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi, userApi, adoptionApi, careApi } from '../../api';
import { ProductCard } from '../../components/ProductCard';
import { AdoptionCard } from '../../components/AdoptionCard';
import { ArticleCard } from '../../components/ArticleCard';
import { VetCard } from '../../components/VetCard';
import { Loading } from '../../components/Loading';
import { AvatarStack } from '../../components/ui/Avatar';
import { RatingStars } from '../../components/RatingStars';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';

const features = [
  { icon: 'paw', className: '', title: 'Pet Profiles', text: 'Create detailed profiles for every pet in your family with galleries and health summaries.' },
  { icon: 'medical-cross', className: 'teal', title: 'Health Records', text: 'Vaccinations, diagnoses, treatments and more — all in a clean visual timeline.' },
  { icon: 'calendar', className: 'blue', title: 'Vet Appointments', text: 'Find vets, check live availability and book appointments in a couple of clicks.' },
  { icon: 'bag', className: 'green', title: 'Pet Marketplace', text: 'Browse food, toys, grooming and health products for all pets.' },
  { icon: 'heart', className: 'amber', title: 'Adoption', text: 'Connect with verified shelters and give a loving home to an adoptable pet.' },
  { icon: 'book', className: 'blue', title: 'Care Resources', text: 'Articles, FAQs and videos covering feeding, grooming, vaccination and more.' },
];

const steps = [
  { icon: 'user-plus', num: '01', title: 'Create your account', text: 'Sign up free as an owner — or join as a veterinarian or shelter.' },
  { icon: 'paw', num: '02', title: 'Build pet profiles', text: 'Add your pets, their health history and what they love.' },
  { icon: 'sparkles', num: '03', title: 'Enjoy complete care', text: 'Book vets, shop for supplies, and find your next best friend.' },
];

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [vets, setVets] = useState([]);
  const [listings, setListings] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, vetsRes, listingsRes, articlesRes] = await Promise.all([
          productApi.getAll({ limit: 4, sort: 'rating', featured: true }).catch(() => ({ data: [] })),
          userApi.publicVets({ limit: 3 }).catch(() => ({ data: [] })),
          adoptionApi.getAll({ limit: 3, public: true }).catch(() => ({ data: [] })),
          careApi.getArticles({ limit: 3, featured: true }).catch(() => ({ data: [] })),
        ]);
        setFeaturedProducts(productsRes.data || []);
        setVets(vetsRes.data || []);
        setListings(listingsRes.data || []);
        setArticles(articlesRes.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div>
              <div className="hero-eyebrow">
                <span className="pulse-dot" aria-hidden="true" />
                Trusted pet-care platform
              </div>
              <h1 className="hero-title">
                Complete care for <span className="text-gradient">every paw</span>
              </h1>
              <p className="hero-subtitle">
                FurShield connects pet owners, veterinarians and animal shelters across one platform —
                manage health records, book appointments, shop for supplies and adopt a forever friend.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                  <Icon name="arrow-right" size={17} />
                </Link>
                <Link to="/veterinarians" className="btn btn-ghost btn-lg">
                  <Icon name="stethoscope" size={17} />
                  Find a Vet
                </Link>
              </div>
              <div className="hero-trust">
                <AvatarStack
                  items={[
                    { name: 'Ava Petrov' },
                    { name: 'Marcus Lee' },
                    { name: 'Sofia Reyes' },
                    { name: 'Liam Chen' },
                  ]}
                />
                <div className="trust-copy">
                  <span className="trust-stars">
                    <RatingStars rating={4.8} count={null} size={15} />
                    <span>4.8/5</span>
                  </span>
                  <small>from 2,400+ happy users</small>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-media">
                <img
                  src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="A happy dog enjoying time with its owner"
                />
              </div>
              <div className="float-card fc-top">
                <span className="fc-icon teal">
                  <Icon name="check-circle" size={18} />
                </span>
                <span>
                  <span className="fc-title">Vaccination due</span>
                  <br />
                  <span className="fc-sub">Luna · Tomorrow 10:00</span>
                </span>
              </div>
              <div className="float-card fc-bottom animate-float-delay">
                <span className="fc-icon amber">
                  <Icon name="heart-filled" size={17} />
                </span>
                <span>
                  <span className="fc-title">Booked with Dr. Oguchi</span>
                  <br />
                  <span className="fc-sub">4.9 · 320 reviews</span>
                </span>
              </div>
              <div className="hero-badge-float animate-float">
                <Icon name="shield" size={20} />
                <span>
                  <strong>Insured care</strong>
                  <small>Every appointment protected</small>
                </span>
              </div>
            </div>
          </div>

          <div className="stats-bar">
            <div className="stat-box">
              <div className="stat-number">1,200+</div>
              <div className="stat-label">
                <Icon name="stethoscope" size={14} />
                Vets registered
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">
                <Icon name="paw" size={14} />
                Happy pets
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-number">300+</div>
              <div className="stat-label">
                <Icon name="building" size={14} />
                Shelter partners
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-number">15,000+</div>
              <div className="stat-label">
                <Icon name="bag" size={14} />
                Products
              </div>
            </div>
          </div>
        </div>
      </section>

      <Reveal as="section" className="page-section">
        <div className="container">
          <div className="section-head-center">
            <span className="section-eyebrow">
              <span className="dot" aria-hidden="true" /> Why FurShield
            </span>
            <h2 className="section-title">Everything your pet needs</h2>
            <p className="section-subtitle">One platform for the whole pet-care journey</p>
          </div>
          <div className="grid grid-3 tiles-dark">
            {features.map((f) => (
              <div className="feature-tile" key={f.title}>
                <div className={`feature-icon ${f.className}`.trim()}>
                  <Icon name={f.icon} size={22} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {featuredProducts.length > 0 && (
      <Reveal as="section" className="page-section muted">
        <div className="container">
          <div className="section-head section-head-center section-head-with-action">
            <span className="section-eyebrow">
              <span className="dot" aria-hidden="true" /> Marketplace
            </span>
            <h2 className="section-title">Top rated pet products</h2>
            <p className="section-subtitle">Loved by owners and their pets</p>
            <Link to="/products" className="btn btn-outline">
              Browse all
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-4">
              {featuredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </Reveal>
      )}

      <Reveal as="section" className="page-section">
        <div className="container">
          <div className="section-head section-head-center section-head-with-action">
            <span className="section-eyebrow">
              <span className="dot" aria-hidden="true" /> Veterinarians
            </span>
            <h2 className="section-title">Meet trusted veterinarians</h2>
            <p className="section-subtitle">Search, filter and book with the right vet</p>
            <Link to="/veterinarians" className="btn btn-outline">
              All vets
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>
          {loading ? (
            <Loading />
          ) : vets.length > 0 ? (
            <div className="grid grid-3">
              {vets.map((v) => (
                <VetCard key={v._id} vet={v} />
              ))}
            </div>
          ) : (
            <p className="text-muted">No veterinarians listed yet.</p>
          )}
        </div>
      </Reveal>

      <Reveal as="section" className="page-section muted">
        <div className="container">
          <div className="section-head-center">
            <span className="section-eyebrow">
              <span className="dot" aria-hidden="true" /> How it works
            </span>
            <h2 className="section-title">Care in three simple steps</h2>
            <p className="section-subtitle">From sign-up to full peace of mind</p>
          </div>
          <div className="steps tiles-dark">
            {steps.map((s) => (
              <div className="step-item" key={s.num}>
                <div className="step-number">{s.num}</div>
                <div className="feature-icon">
                  <Icon name={s.icon} size={22} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="page-section">
        <div className="container">
          <div className="section-head section-head-center section-head-with-action">
            <span className="section-eyebrow">
              <span className="dot" aria-hidden="true" /> Adoption
            </span>
            <h2 className="section-title">Find your forever friend</h2>
            <p className="section-subtitle">Adoptable pets from verified shelters</p>
            <Link to="/adoption" className="btn btn-outline">
              View adoptions
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>
          {loading ? (
            <Loading />
          ) : listings.length > 0 ? (
            <div className="grid grid-3">
              {listings.map((l) => (
                <AdoptionCard key={l._id} listing={l} />
              ))}
            </div>
          ) : (
            <p className="text-muted">No adoption listings available right now.</p>
          )}
        </div>
      </Reveal>

      {articles.length > 0 && (
      <Reveal as="section" className="page-section muted">
        <div className="container">
          <div className="section-head section-head-center section-head-with-action">
            <span className="section-eyebrow">
              <span className="dot" aria-hidden="true" /> Resources
            </span>
            <h2 className="section-title">Learn how to care better</h2>
            <p className="section-subtitle">Expert articles on feeding, grooming and more</p>
            <Link to="/care" className="btn btn-outline">
              All resources
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-3">
              {articles.map((a) => (
                <ArticleCard key={a._id} article={a} />
              ))}
            </div>
          )}
        </div>
      </Reveal>
      )}

      <Reveal as="section" className="page-section">
        <div className="container">
          <div className="cta-band">
            <h2>Ready to give your pet complete care?</h2>
            <p>Join thousands of happy pet owners and professionals today — it only takes a minute.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-accent btn-lg">
                Create your free account
                <Icon name="arrow-right" size={17} />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </>
  );
};

export default Home;