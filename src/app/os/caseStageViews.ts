export interface CaseStageView {
  src: `/cases/${string}`;
  alt: string;
  credit: string;
}

const frontView = (id: string, slug: string, artist: string): CaseStageView => ({
  src: `/cases/stage-front/${id}-${slug}-front.webp`,
  alt: `${artist} stage, front view from the original SketchUp model, with the surrounding main stage and Layher faded`,
  credit: 'ORIGINAL MODEL / FRONT VIEW',
});

// Match project identities, not extraction order. These are model views, not photos.
// Images for 01–02 do not change their held formal-strategy mapping.
export const CASE_STAGE_VIEWS: Partial<Record<string, CaseStageView>> = {
  '01': frontView('01', 'monsta-x', 'MONSTA X'),
  '02': frontView('02', 'babymonster', 'BABYMONSTER'),
  '03': frontView('03', 'ald1', 'ALD1'),
  '04': frontView('04', 'ive', 'IVE'),
  '05': frontView('05', 'allhours', 'ALL(H)OURS'),
  '06': frontView('06', 'kickflip', 'KickFlip'),
  '07': frontView('07', 'park-jihoon', 'Park Jihoon'),
  '08': frontView('08', 'taeyong', 'Taeyong'),
  '09': frontView('09', 'izna', 'izna'),
  '10': frontView('10', 'yeonjun', 'Yeonjun'),
  '11': frontView('11', 'meovv', 'MEOVV'),
  '12': frontView('12', 'modyssey', 'MODYSSEY'),
};
