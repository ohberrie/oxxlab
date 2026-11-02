import { useId, useState } from 'react';
import { CaseDiagram } from './CaseDiagram';
import { CASE_STAGE_VIEWS } from './caseStageViews';

// Publish only project-verified, cleared local assets. Never use Drive/private URLs.
export interface CasePhoto { src: `/cases/${string}`; alt: string; credit: string; }
export const CASE_PHOTOS: Partial<Record<string, CasePhoto>> = {};

export function CaseMedia({ id, large = false, photo = CASE_PHOTOS[id], diagramAvailable = true }: { id: string; large?: boolean; photo?: CasePhoto; diagramAvailable?: boolean }) {
  const uid = useId();
  const [selected, setSelected] = useState<'image' | 'diagram'>('image');
  const [hover, setHover] = useState(false);
  const [failed, setFailed] = useState(false);
  const image = photo ?? CASE_STAGE_VIEWS[id];
  const available = image && !failed;
  const diagram = diagramAvailable && (!available || hover || selected === 'diagram');
  const imageLabel = photo ? 'ACTUAL' : 'STAGE VIEW';
  return <div className="case-media">
    <div className="case-media-stage" id={uid}
      onPointerEnter={e => { if (diagramAvailable && e.pointerType === 'mouse') setHover(true); }}
      onPointerLeave={() => setHover(false)}>
      {available && <div className={'case-media-photo'+(!photo ? ' case-media-model' : '')+(diagram ? ' is-hidden' : '')} aria-hidden={diagram}>
        <img src={image.src} alt={image.alt} width={!photo ? 1600 : undefined} height={!photo ? 1200 : undefined}
          loading={large ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
      </div>}
      {diagramAvailable && <div className={'case-media-diagram'+(!diagram ? ' is-hidden' : '')} aria-hidden={!diagram}><CaseDiagram id={id} large={large} /></div>}
      {!available && !diagramAvailable && <div className="case-media-unavailable" role="status">STAGE VIEW UNAVAILABLE</div>}
    </div>
    <div className="case-media-bar">
      {available ? <>{diagramAvailable ? <div className="case-media-controls" role="group" aria-label={'Case '+id+' image view'}>
        <button type="button" aria-controls={uid} aria-pressed={!diagram} onClick={() => { setHover(false); setSelected('image'); }}>{imageLabel}</button>
        <button type="button" aria-controls={uid} aria-pressed={!!diagram} onClick={() => { setHover(false); setSelected('diagram'); }}>DIAGRAM</button>
      </div> : <span className="case-media-static-label">{imageLabel} / {id}</span>}<span className="case-media-credit">{diagram ? 'FORMAL READING / SCHEMATIC' : image.credit}</span></> : <><span>{diagramAvailable ? 'DIAGRAM' : 'STAGE VIEW'} / {id}</span><span role="status">SOURCE IMAGE PENDING</span></>}
    </div>
  </div>;
}
