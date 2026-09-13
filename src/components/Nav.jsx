function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">
          <span className="dot"></span> M. THAPA
        </div>
        <nav className="links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#guestbook">Guestbook</a>
        </nav>
        <a className="nav-cta" href="#contact">Say hello</a>
      </div>
    </header>
  );
}

export default Nav;