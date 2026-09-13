const projects = [
  {
    name: 'RFQ & Quote Portal',
    desc: "The company's first role-based, self-service RFQ and quote portal, built end to end — user roles, access controls, record-locking, and request-to-quote workflows. Cut request-to-quote processing time by 60%.",
    tags: ['REST APIs', 'Access Control', 'Workflow Automation'],
  },
  {
    name: 'ISBNDB Data Pipeline',
    desc: 'A Python pipeline that validates, cleans, and enriches 5,000 book records per run across 20+ publishers and roughly 900,000 products — eliminating about 80% of manual metadata cleanup.',
    tags: ['Python', 'ETL', 'ONIX/XML'],
  },
  {
    name: 'MicroCode',
    desc: 'Docker-based code-execution engine for a full-stack coding platform, built with a three-person team. Isolated execution across 5+ languages with automated scoring and leaderboards.',
    tags: ['ASP.NET MVC', 'React', 'Docker'],
  },
];

function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="wrap">
        <div className="proj-head">
          <div className="section-label">03 — Projects</div>
          <h2 className="section-title">Selected work.</h2>
        </div>
        <div className="proj-list">
          {projects.map((p, i) => (
            <div className="proj-item" key={p.name}>
              <div className="proj-idx">{String(i + 1).padStart(2, '0')}</div>
              <div>
                <div className="proj-name"><a href="#" target="_blank" rel="noopener noreferrer">{p.name} →</a></div>
                <div className="proj-desc">{p.desc}</div>
              </div>
              <div className="proj-tags">
                {p.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;