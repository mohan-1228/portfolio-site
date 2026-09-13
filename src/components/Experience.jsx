const jobs = [
  {
    role: 'Software Developer',
    date: 'Jan 2025 — Present',
    co: 'K12Savings',
    desc: 'Sole developer for quoting, integration, and automation systems across ERP, CRM, inventory, and e-commerce. Built REST APIs connecting Zoho Books, Shopify, and ONIX publisher feeds across 20+ publishers.',
  },
  {
    role: 'Software Development Intern',
    date: 'Jun 2024 — Dec 2024',
    co: 'K12Savings',
    desc: 'Built Python ETL pipelines transforming publisher ONIX XML into validated, ERP-ready records across 25+ metadata fields. Improved site page-load speed by 30% and organic search traffic by 13%.',
  },
  {
    role: 'Undergraduate Research Assistant',
    date: 'Jan 2024 — Jun 2024',
    co: 'Computational Learning Systems Lab, Missouri State University',
    desc: 'Standardized 25,000+ MRI scans for a TensorFlow-based traumatic brain injury model and evaluated five configurations, contributing to an accuracy improvement from 73% to 86%.',
  },
];

function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="wrap">
        <div className="exp-head">
          <div className="section-label">04 — Experience</div>
          <h2 className="section-title">The track record.</h2>
        </div>
        <div className="track">
          {jobs.map(j => (
            <div className="exp-item" key={j.role + j.date}>
              <div className="exp-top">
                <div className="exp-role">{j.role}</div>
                <div className="exp-date">{j.date}</div>
              </div>
              <div className="exp-co">{j.co}</div>
              <div className="exp-desc">{j.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;