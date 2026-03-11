import clsx from "clsx";
type HelperProps = {
  additionalClassNames?: string;
};

function Helper({ additionalClassNames = "" }: HelperProps) {
  return (
    <div className={clsx("absolute flex h-[2.892px] items-center justify-center w-[3px]", additionalClassNames)}>
      <div className="flex-none rotate-180">
        <Group9Helper additionalClassNames="relative" />
      </div>
    </div>
  );
}
type Group9HelperProps = {
  additionalClassNames?: string;
};

function Group9Helper({ additionalClassNames = "" }: Group9HelperProps) {
  return (
    <div className={clsx("bg-black h-[2.892px] w-[3px]", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border-[0.1px] border-solid border-white inset-[-0.05px] pointer-events-none" />
    </div>
  );
}

export default function Group() {
  return (
    <div className="relative size-full">
      <div className="absolute contents left-0 top-0">
        <div className="absolute contents left-0 top-0">
          <Group9Helper additionalClassNames="absolute left-[3px] top-0" />
          <Group9Helper additionalClassNames="absolute left-[21px] top-[5.78px]" />
          <Group9Helper additionalClassNames="absolute left-[38.99px] top-[5.78px]" />
          <Helper additionalClassNames="left-[27px] top-[11.57px]" />
          <Helper additionalClassNames="left-[44.99px] top-[11.57px]" />
          <Group9Helper additionalClassNames="absolute left-[3px] top-[17.35px]" />
          <Group9Helper additionalClassNames="absolute left-[3px] top-[2.89px]" />
          <Group9Helper additionalClassNames="absolute left-[21px] top-0" />
          <Group9Helper additionalClassNames="absolute left-[38.99px] top-0" />
          <Helper additionalClassNames="left-[27px] top-[17.35px]" />
          <Helper additionalClassNames="left-[44.99px] top-[17.35px]" />
          <Group9Helper additionalClassNames="absolute left-[3px] top-[5.78px]" />
          <Group9Helper additionalClassNames="absolute left-[21px] top-[2.89px]" />
          <Group9Helper additionalClassNames="absolute left-[38.99px] top-[2.89px]" />
          <Helper additionalClassNames="left-[27px] top-[14.46px]" />
          <Helper additionalClassNames="left-[44.99px] top-[14.46px]" />
          <Group9Helper additionalClassNames="absolute left-[3px] top-[8.68px]" />
          <Group9Helper additionalClassNames="absolute left-[3px] top-[11.57px]" />
          <Group9Helper additionalClassNames="absolute left-[3px] top-[14.46px]" />
          <Group9Helper additionalClassNames="absolute left-0 top-[2.89px]" />
          <Group9Helper additionalClassNames="absolute left-[18px] top-0" />
          <Group9Helper additionalClassNames="absolute left-[36px] top-0" />
          <Helper additionalClassNames="left-[30px] top-[17.35px]" />
          <Helper additionalClassNames="left-[47.99px] top-[17.35px]" />
          <Group9Helper additionalClassNames="absolute left-0 top-[5.78px]" />
          <Group9Helper additionalClassNames="absolute left-[18px] top-[2.89px]" />
          <Group9Helper additionalClassNames="absolute left-[36px] top-[2.89px]" />
          <Helper additionalClassNames="left-[30px] top-[14.46px]" />
          <Helper additionalClassNames="left-[47.99px] top-[14.46px]" />
          <Group9Helper additionalClassNames="absolute left-0 top-[8.68px]" />
          <Group9Helper additionalClassNames="absolute left-0 top-[11.57px]" />
          <Group9Helper additionalClassNames="absolute left-0 top-[14.46px]" />
          <Group9Helper additionalClassNames="absolute left-[6px] top-0" />
          <Group9Helper additionalClassNames="absolute left-[24px] top-[5.78px]" />
          <Group9Helper additionalClassNames="absolute left-[41.99px] top-[5.78px]" />
          <Helper additionalClassNames="left-[24px] top-[11.57px]" />
          <Helper additionalClassNames="left-[41.99px] top-[11.57px]" />
          <Group9Helper additionalClassNames="absolute left-[24px] top-[8.68px]" />
          <Group9Helper additionalClassNames="absolute left-[41.99px] top-[8.68px]" />
          <Group9Helper additionalClassNames="absolute left-[6px] top-[17.35px]" />
          <Group9Helper additionalClassNames="absolute left-[9px] top-[2.89px]" />
          <Group9Helper additionalClassNames="absolute left-[27px] top-0" />
          <Group9Helper additionalClassNames="absolute left-[44.99px] top-0" />
          <Helper additionalClassNames="left-[21px] top-[17.35px]" />
          <Helper additionalClassNames="left-[38.99px] top-[17.35px]" />
          <Group9Helper additionalClassNames="absolute left-[9px] top-[5.78px]" />
          <Group9Helper additionalClassNames="absolute left-[27px] top-[2.89px]" />
          <Group9Helper additionalClassNames="absolute left-[44.99px] top-[2.89px]" />
          <Helper additionalClassNames="left-[21px] top-[14.46px]" />
          <Helper additionalClassNames="left-[38.99px] top-[14.46px]" />
          <Group9Helper additionalClassNames="absolute left-[9px] top-[8.68px]" />
          <Group9Helper additionalClassNames="absolute left-[9px] top-[11.57px]" />
          <Group9Helper additionalClassNames="absolute left-[9px] top-[14.46px]" />
          <Group9Helper additionalClassNames="absolute left-[12px] top-[2.89px]" />
          <Group9Helper additionalClassNames="absolute left-[30px] top-0" />
          <Group9Helper additionalClassNames="absolute left-[47.99px] top-0" />
          <Helper additionalClassNames="left-[18px] top-[17.35px]" />
          <Helper additionalClassNames="left-[35.99px] top-[17.35px]" />
          <Group9Helper additionalClassNames="absolute left-[12px] top-[5.78px]" />
          <Group9Helper additionalClassNames="absolute left-[30px] top-[2.89px]" />
          <Group9Helper additionalClassNames="absolute left-[47.99px] top-[2.89px]" />
          <Helper additionalClassNames="left-[18px] top-[14.46px]" />
          <Helper additionalClassNames="left-[35.99px] top-[14.46px]" />
          <Group9Helper additionalClassNames="absolute left-[12px] top-[8.68px]" />
          <Group9Helper additionalClassNames="absolute left-[12px] top-[11.57px]" />
          <Group9Helper additionalClassNames="absolute left-[12px] top-[14.46px]" />
          <Group9Helper additionalClassNames="absolute left-[9px] top-0" />
          <Group9Helper additionalClassNames="absolute left-[27px] top-[5.78px]" />
          <Group9Helper additionalClassNames="absolute left-[44.99px] top-[5.78px]" />
          <Helper additionalClassNames="left-[21px] top-[11.57px]" />
          <Helper additionalClassNames="left-[38.99px] top-[11.57px]" />
          <Group9Helper additionalClassNames="absolute left-[9px] top-[17.35px]" />
        </div>
      </div>
      <div className="absolute content-stretch flex h-[10.701px] items-center left-[65.23px] top-[4.77px]" data-name="Container">
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
          <p className="col-1 font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[8.414px] lowercase ml-0 mt-[1.05px] relative row-1 text-[#141414] text-[12.153px] tracking-[1.823px] whitespace-nowrap">lab</p>
          <div className="col-1 flex h-[11.099px] items-center justify-center ml-[35px] mt-0 relative row-1 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
            <div className="flex-none rotate-90">
              <div className="h-0 relative w-[11.099px]">
                <div className="absolute inset-[-1px_0_0_0]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.0986 1">
                    <line id="Line 1" stroke="var(--stroke-0, black)" x2="11.0986" y1="0.5" y2="0.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <p className="col-1 font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[8.414px] lowercase ml-[45px] mt-[1.05px] relative row-1 text-[#141414] text-[12.153px] tracking-[1.823px] whitespace-nowrap">studio</p>
        </div>
      </div>
    </div>
  );
}