import { useEffect, useRef } from 'react';

function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W, H, dpr, animationId;
    let mouseY = 0.5;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function handleMouseMove(e) {
      mouseY = e.clientY / window.innerHeight;
    }
    window.addEventListener('mousemove', handleMouseMove);

    const lines = [
      { amp: 46, freq: 0.006, speed: 0.010, color: 'rgba(255,62,127,0.55)', yOff: 0.42, width: 2 },
      { amp: 30, freq: 0.009, speed: -0.014, color: 'rgba(0,224,198,0.5)', yOff: 0.52, width: 2 },
      { amp: 60, freq: 0.004, speed: 0.007, color: 'rgba(255,62,127,0.22)', yOff: 0.60, width: 1.4 },
      { amp: 22, freq: 0.013, speed: -0.02, color: 'rgba(0,224,198,0.28)', yOff: 0.34, width: 1.4 },
    ];

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      lines.forEach(line => {
        ctx.beginPath();
        const baseY = H * line.yOff;
        const mouseInfluence = 1 + (Math.abs(mouseY - line.yOff) < 0.15 ? (0.15 - Math.abs(mouseY - line.yOff)) * 6 : 0);
        for (let x = 0; x <= W; x += 4) {
          const y = baseY + Math.sin(x * line.freq + t * line.speed) * line.amp * mouseInfluence
                    + Math.sin(x * line.freq * 2.3 + t * line.speed * 1.7) * (line.amp * 0.25);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.stroke();
      });
      t += 1;
      if (!reduceMotion) animationId = requestAnimationFrame(draw);
    }
    draw();

    // cleanup — this is the important React-specific part:
    // undo everything we set up when this component unmounts,
    // so we never leak event listeners or animation loops
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="hero">
      <canvas ref={canvasRef} id="wave-canvas"></canvas>
      <div className="hero-inner">
        <div className="eyebrow">Software Developer · AWS Certified AI Practitioner</div>
        <h1 className="headline">
          I turn scattered data<br />
          <span className="line2">into clean signal.</span>
        </h1>
        <p className="hero-sub">
          Mohan Thapa — a software developer who owns cloud integrations, data pipelines, and automation end to end, from requirements to production. Based in Springfield, MO.
        </p>
        <div className="hero-cta">
          <a className="btn btn-solid" href="#projects">View the work</a>
          <a className="btn btn-ghost" href="#contact">Start a project</a>
        </div>
      </div>
      <div className="scroll-cue"><span>SCROLL</span><span className="stem"></span></div>
    </section>
  );
}

export default Hero;