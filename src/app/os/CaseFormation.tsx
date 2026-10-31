import { CaseDiagram } from './CaseDiagram';

/**
 * An analytical reading order, not a claim about chronological production steps.
 * The original CaseDiagram layers are reused rather than inventing new CAD.
 */
export function CaseFormation({id,dominant,variation}:{id:string;dominant:string;variation:string}) {
  return <div className="case-formation">
    <div className="case-formation-heading"><span className="eyebrow">FORMAL DEVELOPMENT / ANALYTICAL READING</span><p>Read from the governing spatial relationship to transformations and additional detail.</p></div>
    <div className="case-formation-steps">
      {[
        {n:'01',title:'Governing relationship',subtitle:dominant,phase:'base' as const},
        {n:'02',title:'Variation / composition',subtitle:variation,phase:'variation' as const},
        {n:'03',title:'Resulting spatial reading',subtitle:'Integrated formal field',phase:'complete' as const},
      ].map((step,i)=><div className="case-formation-step" key={step.n}>
        <span className="case-formation-no">{step.n}</span>
        <CaseDiagram id={id} phase={step.phase}/>
        <div className="case-formation-detail"><strong>{step.title}</strong><span>{step.subtitle}</span></div>
        {i<2&&<span className="case-formation-arrow" aria-hidden="true">→</span>}
      </div>)}
    </div>
    <p className="case-formation-note">Retrospective analytical breakdown, not verified chronological design or fabrication steps. Specific historical decisions and material details belong in the realization record.</p>
  </div>;
}
