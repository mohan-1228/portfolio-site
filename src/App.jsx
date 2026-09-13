import './index.css';
import Nav from './components/Nav';
import './components/Nav.css';
import Hero from './components/Hero';
import './components/Hero.css';
import About from './components/About';
import './components/About.css';
import Skills from './components/Skills';
import './components/Skills.css';
import Projects from './components/Projects';
import './components/Projects.css';
import Experience from './components/Experience';
import './components/Experience.css';
import Guestbook from './components/Guestbook';
import './components/Guestbook.css';
import Contact from './components/Contact';
import './components/Contact.css';
function App() {
  return (
    <div>
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Guestbook />
      <Contact />
    </div>
  );
}

export default App;