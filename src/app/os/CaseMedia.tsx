import { useId, useState } from 'react';
import { CaseDiagram } from './CaseDiagram';
import { CaseIso } from './CaseIso';

// Publish only project-verified, cleared local assets. Never use Drive/private URLs.
export interface CasePhoto { src: `/cases/${string}`; alt: string; credit: string; }
export const CASE_PHOTOS: Partial<Record<string, CasePhoto>> = {};

export function CaseMedia({ id, large = false, photo = CASE_PHOTOS[id] }: { id: string; large?: boolean; photo?: CasePhoto }) {
  const uid = useId();
  const [selected, setSelected] = useState<'actual' | 'diagram'>('actual');
  const [hover, setHover] = useState(false);
  const [failed, setFailed] = useState(false);
  const available = photo && !failed;
  const diagram = !available || hover || selected === 'diagram';
  return <div className="case-media" onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(true); }} onPointerLeave={() => setHover(false)}>
    <div className="case-media-stage" id={uid}>
      {available && <div className={'case-media-photo'+(diagram ? ' is-hidden' : '')} aria-hidden={diagram}>
        <img src={photo.src} alt={photo.alt} loading="lazy" onError={() => setFailed(true)} />
      </div>}
      <div className={'case-media-diagram'+(!diagram ? ' is-hidden' : '')} aria-hidden={!diagram}>{available ? <CaseDiagram id={id} large={large} /> : <CaseIso id={id} large={large} />}</div>
    </div>
    <div className="case-media-bar">
      {available ? <><div className="case-media-controls" aria-label={'Case '+id+' image view'}>
        <button type="button" aria-controls={uid} aria-pressed={!diagram} onClick={() => { setHover(false); setSelected('actual'); }}>ACTUAL</button>
        <button type="button" aria-controls={uid} aria-pressed={!!diagram} onClick={() => { setHover(false); setSelected('diagram'); }}>DIAGRAM</button>
      </div><span className="case-media-credit">{photo.credit}</span></> : <><span>DIAGRAM / {id}</span><span role="status">SOURCE IMAGE PENDING</span></>}
    </div>
  </div>;
}
