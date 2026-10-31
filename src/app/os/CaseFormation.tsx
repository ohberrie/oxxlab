import { CaseDiagram } from './CaseDiagram';

/** Illustrative decomposition; this is not a recovered historical timeline. */
export function CaseFormation({id,dominant,variation}:{id:string;dominant:string;variation:string}) {
  const stages = [
    {number:'01',title:'Base',detail:dominant,phase:'base' as const},
    {number:'02',title:'Transform',detail:variation,phase:'variation' as const},
    {number:'03',title:'Form',detail:'Combined reading',phase:'complete' as const},
  ];
  return <div className="case-formation">
    <div className="case-formation-steps">
      {stages.map((stage,i)=><div className="case-formation-step" key={stage.number}>
        <div className="case-formation-step-name"><span>{stage.number}</span><strong>{stage.title}</strong></div>
        <CaseDiagram id={id} phase={stage.phase}/>
        <div className="case-formation-detail">{stage.detail}</div>
        {i<stages.length-1&&<span className="case-formation-arrow" aria-hidden="true">→</span>}
      </div>)}
    </div>
    <details className="case-formation-about"><summary>About the diagram</summary><p>An analytical breakdown of the existing case illustration, not a chronological production record or reconstructed CAD.</p></details>
  </div>;
}
