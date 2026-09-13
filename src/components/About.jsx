function About() {
  return (
    <section className="about" id="about">
      <div className="wrap about-grid">
        <div>
          <div className="section-label">01 — About</div>
          <h2 className="section-title">Ships it<br />end to end.</h2>
        </div>
        <div className="about-body">
          <p>I'm the sole developer behind customer quoting, integration, and automation systems for a K–12 book distributor — spanning ERP, CRM, inventory, and e-commerce. <strong>I own projects end to end</strong>: gathering requirements from sales and accounting, then designing, building, testing, and shipping the solution myself.</p>
          <p>My work sits at the intersection of <strong>system integrations, data pipelines, and process automation</strong> — connecting platforms like Zoho Books, Shopify, and publisher ONIX feeds so that people stop doing by hand what a script can do correctly every time.</p>
          <p>I hold an AWS Certified AI Practitioner certification and previously worked on a TensorFlow-based deep learning model as a research assistant, evaluating configurations for a traumatic brain injury study.</p>
          <div className="stat-row">
            <div className="stat"><div className="num">900K+</div><div className="label">PRODUCTS INTEGRATED</div></div>
            <div className="stat"><div className="num">60%</div><div className="label">FASTER QUOTE PROCESSING</div></div>
            <div className="stat"><div className="num">67%</div><div className="label">LESS MANUAL PROCESSING</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;