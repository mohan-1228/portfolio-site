const skills = [
  { name: 'Data & ETL', pct: 90 },
  { name: 'Backend', pct: 86 },
  { name: 'Cloud & AWS', pct: 75 },
  { name: 'Frontend', pct: 68 },
  { name: 'ML / AI', pct: 62 },
];

function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="wrap">
        <div className="skills-head">
          <div>
            <div className="section-label">02 — Skills</div>
            <h2 className="section-title">Where the signal's strongest.</h2>
          </div>
          <p>Levels are self-rated against production experience, not tutorials completed.</p>
        </div>
        <div className="eq">
          {skills.map((s, i) => (
            <div className="eq-col" key={s.name}>
              <div className="eq-bar-wrap">
                <div
                  className="eq-bar"
                  style={{
                    height: `${s.pct}%`,
                    background: i % 2 === 0
                      ? 'linear-gradient(180deg, var(--ch-r), var(--ch-l))'
                      : 'linear-gradient(180deg, var(--ch-l), var(--ch-r))'
                  }}
                ></div>
              </div>
              <div className="eq-meta">
                <div className="pct">{s.pct}%</div>
                <div className="name">{s.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;