import { Link } from 'react-router';
import { GlyphHero } from './GlyphHero';
import { Viewer } from '../os/Viewer';

export function Home() {
  return (
    <>
      <GlyphHero />
      <div className="home" id="form-thinks-forward">
        <section className="home-hero">
          <div className="hero-copy">
            <span className="eyebrow">Practice → Principle → Possibility</span>
            <h1>Form thinks<br />forward.</h1>
            <p className="description">I extract formal decisions from built work, and turn them into engines for the next design.</p>
            <Link className="btn" to="/engine/convergence">Explore the engine <span>↗</span></Link>
          </div>
          <Viewer
            kind="converge"
            className="hero-art"
            dock
            caption="09 / PROGRESSIVE CONVERGENCE"
            subtitle="Rotate to reveal the depth."
          />
        </section>
        <div className="hero-source">
          <Link to="/field/09">Extracted from Field 09 <span className="blue">↗</span></Link>
          <span className="mono">A new engine, rooted in real practice.</span>
          <Link to="/tools">Production tools <span className="blue">↗</span></Link>
        </div>
        <section className="home-lower">
          <div>
            <span className="eyebrow">The research question</span>
            <h2>What can a finished work<br />teach the next one?</h2>
            <p>OXX makes tacit formal decisions explicit: the rules that generate possibilities, and the judgments that select between them.</p>
            <Link className="text-button" to="/method">Read the method <span>↗</span></Link>
          </div>
          <div>
            <div className="history"><b>SHAPER</b><span>→</span><b>STAGE PRACTICE</b><span>→</span><b>OXX OS</b></div>
            <p>Controlled generation became a question about real-world judgment. OXX returns those accumulated decisions as reusable formal and production logics.</p>
            <Link className="text-button" to="/field">Read the field cases <span>↗</span></Link>
          </div>
        </section>
      </div>
    </>
  );
}
