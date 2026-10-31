import type { ReactNode } from 'react';

/**
 * Editorial spatial diagrams, NOT photographs, original CAD, or simulations of
 * the built stages. Intentionally independent from the generic Engine Viewer.
 * Each composition is based on the known spatial reading of that case.
 */
interface Props { id: string; large?: boolean; phase?: 'base' | 'variation' | 'complete' }
const repeat = (n: number, draw: (i: number) => ReactNode) =>
  Array.from({ length: n }, (_, i) => <g key={i}>{draw(i)}</g>);

function Drawing({ id }: { id: string }) {
  switch (id) {
    case '03': // ALD1 — uncanny enclosed room, displaced objects and panels
      return <>
        <path d="M89 88 243 45 391 93 391 221 239 252 89 209Z M89 88 239 129 391 93 M239 129V252" className="case-strong"/>
        <path d="M126 111 172 122 172 179 126 163Z M186 133 221 142 221 199 186 189Z M278 123 356 105 356 154 278 172Z M270 184 307 177 307 217 270 226Z"/>
        <path d="M132 121 165 131 165 169 132 159Z M299 130 369 112 369 163 299 182Z" className="case-emphasis"/>
        <path d="M89 209 239 252 391 221 M154 229 291 149 M194 241 339 160" className="case-soft"/>
        <path d="M172 122 194 115 194 179 172 179Z M307 177 325 169 325 207 307 217Z" className="case-emphasis"/>
      </>;
    case '04': // IVE BLACKHOLE — sequential LED planes and deeper focal threshold
      return <>
        <path d="M53 32H427V239H53Z M53 32 156 77 M427 32 324 77 M53 239 156 193 M427 239 324 193" className="case-soft"/>
        {repeat(5, i => { const x=72+i*31, y=44+i*21, w=336-i*62, h=178-i*41; return <rect x={x} y={y} width={w} height={h} className={i===0?'case-strong':''}/>; })}
        <path d="M110 44V216 M370 44V216 M163 70V195 M317 70V195" strokeWidth="3" className="case-emphasis"/>
        <path d="M76 236 223 158 404 236 M76 236H404" className="case-soft"/>
        <path d="M215 107 251 107 251 147 215 147Z" className="case-emphasis"/>
      </>;
    case '05': // ALL(H)OURS — low, rectangular cage / exhibition boundary
      return <>
        <path d="M66 88 220 46 410 88V205L250 248 66 208Z M66 88 250 131 410 88 M250 131V248" className="case-strong"/>
        {repeat(6,i=><path d={'M '+(90+i*26)+' '+(82-i*7)+' '+(271+i*22)+' '+(128-i*7)} className="case-soft"/>)}
        {repeat(5,i=><path d={'M '+(86+i*36)+' '+(97+i*8)+' V '+(208+i*6)} />)}
        <path d="M72 130 250 174 406 133 M72 167 250 211 406 170" className="case-soft"/>
        <path d="M114 193V147L153 157V204 M309 213V166L346 157V201" className="case-emphasis"/>
        <path d="M66 88 220 46 410 88" strokeWidth="3" className="case-emphasis"/>
      </>;
    case '06': // KickFlip — energetic curved connector across two zones
      return <>
        <path d="M48 219Q104 201 163 215 M315 215Q380 197 436 219 M50 232H434" className="case-soft"/>
        <path d="M63 212V122Q106 80 157 122V212 M323 212V122Q371 84 420 122V212" className="case-strong"/>
        <path d="M61 184Q153 13 324 183 M86 199Q195 39 397 199 M119 204Q244 67 362 205" className="case-emphasis"/>
        <path d="M166 217Q234 169 309 217 M90 216Q160 132 211 171 M264 177Q324 123 383 216"/>
        <circle cx="105" cy="174" r="25" className="case-soft"/>
        <path d="M80 174H130M105 149V199M88 156Q116 174 89 194M123 157Q97 174 120 192" className="case-soft"/>
      </>;
    case '07': // Park Jihoon — clock / concentric physical stage arches
      return <>
        <path d="M48 225H432" className="case-soft"/>
        {repeat(5,i=>{const r=175-i*27;return <path d={'M '+(240-r)+' 225 A '+r+' '+(r*.92)+' 0 0 1 '+(240+r)+' 225'} strokeWidth={i===0?2.6:1.6} className={i===0?'case-strong':''}/>;})}
        <circle cx="240" cy="146" r="34" className="case-emphasis"/>
        <path d="M240 125V146L256 158" className="case-emphasis"/>
        {repeat(9,i=><path d={'M '+(240+Math.cos(i*Math.PI/8)*161)+' '+(225-Math.sin(i*Math.PI/8)*151)+' l '+(Math.cos(i*Math.PI/8)*7)+' '+(-Math.sin(i*Math.PI/8)*7)} className="case-soft"/>)}
      </>;
    case '08': // Taeyong — vertebrae along a curved overhead track; portal secondary
      return <>
        <path d="M145 235V123Q232 64 330 125V235 M169 234V139Q233 91 306 140V234" className="case-soft"/>
        <path d="M64 91Q154 24 243 66T416 78" className="case-strong"/>
        {repeat(13,i=>{const x=71+i*27,y=85-38*Math.sin(i/12*Math.PI)+18*i/12;const a=-20+40*i/12;return <g transform={'translate('+x+' '+y+') rotate('+a+')'}><path d="M-9-15 -17-5 -11 12 10 13 17-4 9-14Z" strokeWidth="2" className="case-emphasis"/><path d="M-11 2H12" className="case-soft"/></g>;})}
        <path d="M67 100V116 M416 88V114 M86 236H396" className="case-soft"/>
      </>;
    case '09': // izna — rotated and scaled triangular frames, NOT crossing/X
      return <>
        {repeat(6,i=>{const t=i/5, r=161-25*i, cx=238+i*4,cy=147-i*4; return <g transform={'rotate('+(t*13-5)+' '+cx+' '+cy+')'}><path d={'M '+(cx-r)+' '+(cy+r*.56)+' L '+cx+' '+(cy-r*.94)+' L '+(cx+r)+' '+(cy+r*.56)+'Z'} strokeWidth={i===0?3:2} className={i===0?'case-strong':i>3?'case-emphasis':''}/></g>;})}
        {repeat(4,i=><path d={'M '+(48+i*12)+' 190V'+(145+i*8)+' M '+(428-i*12)+' 190V'+(145+i*8)} className="case-soft"/>)}
        <path d="M38 225H440" className="case-soft"/>
      </>;
    case '10': // Yeonjun — wall planes folding into floor / negative carpet footprint
      return <>
        <path d="M97 78 256 37 388 81V204L225 247 97 206Z M97 78 225 126 388 81 M225 126V247" className="case-soft"/>
        {repeat(4,i=>{const x=128+i*23, y=86+i*16,w=209-i*49,h=132-i*24;return <path d={'M '+x+' '+(y+h)+' V '+y+' L '+(x+w)+' '+(y-30+i*5)+' V '+(y+h-14)} className={i===0?'case-strong':''}/>;})}
        <path d="M128 218 225 247 387 203 M152 213 235 237 360 201 M176 206 239 226 335 202" className="case-emphasis"/>
        <path d="M152 213 152 181 M235 237V186" className="case-guide"/>
        <path d="M98 206 225 247 388 204" className="case-soft"/>
      </>;
    case '11': // MEOVV GO HARD — broken club / fractured concrete enclosure
      return <>
        <path d="M73 68 248 34 419 84V219L254 250 73 204Z M73 68 254 111 419 84 M254 111V250" className="case-soft"/>
        <path d="M73 69 130 79 148 117 134 142 157 174 150 200 73 203 M419 84 356 102 341 119 355 146 329 164 341 202 419 219" className="case-strong"/>
        <path d="M150 200 196 184 227 200 254 189 M341 202 305 190 289 215 254 223" className="case-strong"/>
        <path d="M173 116 255 132 337 110 M176 122 256 139 331 119 M207 92 215 196 M281 88 288 204" className="case-emphasis"/>
        <path d="M82 192 112 171 133 206 169 221 195 209 213 235 273 247 320 227 362 238 412 220" className="case-soft"/>
        <path d="M101 75 125 105 118 129 155 145 142 183 M374 97 367 125 387 140 367 164" className="case-guide"/>
      </>;
    case '12': // MODYSSEY — suspended thick rectangular masses and open center
      return <>
        {repeat(5,i=><path d={'M '+(112+i*58)+' 24 V'+(62+i%2*9)} className="case-soft"/>)}
        <path d="M73 66 332 38 424 92 165 121Z M73 66V182L165 238V121 M165 121 424 92V201L165 238 M73 182 332 156 424 201" className="case-strong"/>
        <path d="M129 96 319 75 371 105 180 132Z M129 96V160L180 191V132 M180 132 371 105V174L180 191" className="case-strong"/>
        <path d="M73 66 129 96 M332 38 319 75 M424 92 371 105 M165 121 180 132 M73 182 129 160 M165 238 180 191 M424 201 371 174" className="case-emphasis"/>
        <path d="M103 62 345 51 M84 202 170 254 431 220" className="case-soft"/>
      </>;
    default:
      return <><path d="M111 89H365V210H111Z" className="case-soft"/><path d="M120 200 354 100 M120 100 354 200" className="case-guide"/></>;
  }
}

const CAPTIONS: Record<string,string> = {
  '03': 'FRAGMENTED ROOM / DISPLACED PLANES',
  '04': 'LAYERED THRESHOLDS / RECEDING PLANES',
  '05': 'LOW CEILING / CONTAINED GRID',
  '06': 'CURVED LINKS / LINE CONTINUITY',
  '07': 'CONCENTRIC ARCHES / RADIAL SEQUENCE',
  '08': 'CURVED SPINE / ADAPTIVE RIB ARRAY',
  '09': 'TRIANGULAR FRAMES / PROGRESSIVE ROTATION',
  '10': 'FLOOR–WALL FOLD / LAYERED BOUNDARIES',
  '11': 'FRACTURED ENCLOSURE / COLLAPSED CLUB',
  '12': 'SUSPENDED THICK FRAMES / CENTRAL VOID',
};

export function CaseDiagram({ id, large = false, phase = 'complete' }: Props) {
  return <div className={'case-diagram phase-'+phase+(large ? ' case-diagram-large' : '')}>
    <svg viewBox="0 0 480 270" role="img" aria-label={'Schematic spatial study for case '+id+': '+(CAPTIONS[id] ?? 'mapping held')} preserveAspectRatio="xMidYMid meet">
      <g stroke="var(--os-ink)" strokeWidth="1.65" fill="none" strokeLinecap="square" strokeLinejoin="miter">
        <Drawing id={id}/>
      </g>
      <path d="M25 245H45 M435 245H455 M25 25H45 M435 25H455" stroke="var(--os-line)" fill="none" strokeWidth="1"/>
    </svg>
    <div className="case-diagram-label"><span>FORMAL READING / {id}</span><span>SCHEMATIC</span></div>
    {!large && <span className="case-diagram-hover">{CAPTIONS[id] ?? 'MAPPING HELD'}</span>}
  </div>;
}
