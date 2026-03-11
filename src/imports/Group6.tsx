import clsx from "clsx";
type Group1HelperProps = {
  additionalClassNames?: string;
};

function Group1Helper({ additionalClassNames = "" }: Group1HelperProps) {
  return (
    <div className={clsx("absolute flex items-center justify-center size-[3px]", additionalClassNames)}>
      <div className="flex-none rotate-180">
        <div className="bg-black size-[3px]" />
      </div>
    </div>
  );
}

export default function Group() {
  return (
    <div className="relative size-full">
      <div className="absolute contents left-0 top-0">
        <div className="absolute bg-black left-[3px] size-[3px] top-0" />
        <div className="absolute bg-black left-[21px] size-[3px] top-[6px]" />
        <div className="absolute bg-black left-[38.99px] size-[3px] top-[6px]" />
        <Group1Helper additionalClassNames="left-[27px] top-[12px]" />
        <Group1Helper additionalClassNames="left-[44.99px] top-[12px]" />
        <div className="absolute bg-black left-[3px] size-[3px] top-[18px]" />
        <div className="absolute bg-black left-[3px] size-[3px] top-[3px]" />
        <div className="absolute bg-black left-[21px] size-[3px] top-0" />
        <div className="absolute bg-black left-[38.99px] size-[3px] top-0" />
        <Group1Helper additionalClassNames="left-[27px] top-[18px]" />
        <Group1Helper additionalClassNames="left-[44.99px] top-[18px]" />
        <div className="absolute bg-black left-[3px] size-[3px] top-[6px]" />
        <div className="absolute bg-black left-[21px] size-[3px] top-[3px]" />
        <div className="absolute bg-black left-[38.99px] size-[3px] top-[3px]" />
        <Group1Helper additionalClassNames="left-[27px] top-[15px]" />
        <Group1Helper additionalClassNames="left-[44.99px] top-[15px]" />
        <div className="absolute bg-black left-[3px] size-[3px] top-[9px]" />
        <div className="absolute bg-black left-[3px] size-[3px] top-[12px]" />
        <div className="absolute bg-black left-[3px] size-[3px] top-[15px]" />
        <div className="absolute bg-black left-0 size-[3px] top-[3px]" />
        <div className="absolute bg-black left-[18px] size-[3px] top-0" />
        <div className="absolute bg-black left-[36px] size-[3px] top-0" />
        <Group1Helper additionalClassNames="left-[30px] top-[18px]" />
        <Group1Helper additionalClassNames="left-[47.99px] top-[18px]" />
        <div className="absolute bg-black left-0 size-[3px] top-[6px]" />
        <div className="absolute bg-black left-[18px] size-[3px] top-[3px]" />
        <div className="absolute bg-black left-[36px] size-[3px] top-[3px]" />
        <Group1Helper additionalClassNames="left-[30px] top-[15px]" />
        <Group1Helper additionalClassNames="left-[47.99px] top-[15px]" />
        <div className="absolute bg-black left-0 size-[3px] top-[9px]" />
        <div className="absolute bg-black left-0 size-[3px] top-[12px]" />
        <div className="absolute bg-black left-0 size-[3px] top-[15px]" />
        <div className="absolute bg-black left-[6px] size-[3px] top-0" />
        <div className="absolute bg-black left-[24px] size-[3px] top-[6px]" />
        <div className="absolute bg-black left-[41.99px] size-[3px] top-[6px]" />
        <Group1Helper additionalClassNames="left-[24px] top-[12px]" />
        <Group1Helper additionalClassNames="left-[41.99px] top-[12px]" />
        <div className="absolute bg-black left-[24px] size-[3px] top-[9px]" />
        <div className="absolute bg-black left-[41.99px] size-[3px] top-[9px]" />
        <div className="absolute bg-black left-[6px] size-[3px] top-[18px]" />
        <div className="absolute bg-black left-[9px] size-[3px] top-[3px]" />
        <div className="absolute bg-black left-[27px] size-[3px] top-0" />
        <div className="absolute bg-black left-[44.99px] size-[3px] top-0" />
        <Group1Helper additionalClassNames="left-[21px] top-[18px]" />
        <Group1Helper additionalClassNames="left-[38.99px] top-[18px]" />
        <div className="absolute bg-black left-[9px] size-[3px] top-[6px]" />
        <div className="absolute bg-black left-[27px] size-[3px] top-[3px]" />
        <div className="absolute bg-black left-[44.99px] size-[3px] top-[3px]" />
        <Group1Helper additionalClassNames="left-[21px] top-[15px]" />
        <Group1Helper additionalClassNames="left-[38.99px] top-[15px]" />
        <div className="absolute bg-black left-[9px] size-[3px] top-[9px]" />
        <div className="absolute bg-black left-[9px] size-[3px] top-[12px]" />
        <div className="absolute bg-black left-[9px] size-[3px] top-[15px]" />
        <div className="absolute bg-black left-[12px] size-[3px] top-[3px]" />
        <div className="absolute bg-black left-[30px] size-[3px] top-0" />
        <div className="absolute bg-black left-[47.99px] size-[3px] top-0" />
        <Group1Helper additionalClassNames="left-[18px] top-[18px]" />
        <Group1Helper additionalClassNames="left-[35.99px] top-[18px]" />
        <div className="absolute bg-black left-[12px] size-[3px] top-[6px]" />
        <div className="absolute bg-black left-[30px] size-[3px] top-[3px]" />
        <div className="absolute bg-black left-[47.99px] size-[3px] top-[3px]" />
        <Group1Helper additionalClassNames="left-[18px] top-[15px]" />
        <Group1Helper additionalClassNames="left-[35.99px] top-[15px]" />
        <div className="absolute bg-black left-[12px] size-[3px] top-[9px]" />
        <div className="absolute bg-black left-[12px] size-[3px] top-[12px]" />
        <div className="absolute bg-black left-[12px] size-[3px] top-[15px]" />
        <div className="absolute bg-black left-[9px] size-[3px] top-0" />
        <div className="absolute bg-black left-[27px] size-[3px] top-[6px]" />
        <div className="absolute bg-black left-[44.99px] size-[3px] top-[6px]" />
        <Group1Helper additionalClassNames="left-[21px] top-[12px]" />
        <Group1Helper additionalClassNames="left-[38.99px] top-[12px]" />
        <div className="absolute bg-black left-[9px] size-[3px] top-[18px]" />
      </div>
      <div className="absolute contents left-[60.99px] top-0">
        <div className="absolute bg-black left-[63.99px] size-[3px] top-0" />
        <div className="absolute contents left-[60.99px] top-0">
          <div className="absolute bg-black left-[78.99px] size-[3px] top-0" />
          <div className="absolute bg-black left-[96.99px] size-[3px] top-0" />
          <div className="absolute bg-black left-[78.99px] size-[3px] top-[3px]" />
          <div className="absolute bg-black left-[78.99px] size-[3px] top-[6px]" />
          <div className="absolute bg-black left-[78.99px] size-[3px] top-[9px]" />
          <div className="absolute bg-black left-[96.99px] size-[3px] top-[9px]" />
          <div className="absolute bg-black left-[81.99px] size-[3px] top-[9px]" />
          <div className="absolute bg-black left-[99.99px] size-[3px] top-[9px]" />
          <div className="absolute bg-black left-[99.99px] size-[3px] top-[18px]" />
          <div className="absolute bg-black left-[78.99px] size-[3px] top-[12px]" />
          <div className="absolute bg-black left-[78.99px] size-[3px] top-[15px]" />
          <div className="absolute bg-black left-[78.99px] size-[3px] top-[18px]" />
          <div className="absolute bg-black left-[96.99px] size-[3px] top-[18px]" />
          <div className="absolute bg-black left-[75.99px] size-[3px] top-[3px]" />
          <div className="absolute bg-black left-[93.99px] size-[3px] top-[3px]" />
          <div className="absolute bg-black left-[93.99px] size-[3px] top-0" />
          <div className="absolute bg-black left-[75.99px] size-[3px] top-[6px]" />
          <div className="absolute bg-black left-[93.99px] size-[3px] top-[6px]" />
          <div className="absolute bg-black left-[75.99px] size-[3px] top-[9px]" />
          <div className="absolute bg-black left-[93.99px] size-[3px] top-[9px]" />
          <div className="absolute bg-black left-[75.99px] size-[3px] top-[12px]" />
          <div className="absolute bg-black left-[93.99px] size-[3px] top-[12px]" />
          <div className="absolute bg-black left-[75.99px] size-[3px] top-[15px]" />
          <div className="absolute bg-black left-[93.99px] size-[3px] top-[15px]" />
          <div className="absolute bg-black left-[75.99px] size-[3px] top-[18px]" />
          <div className="absolute bg-black left-[93.99px] size-[3px] top-[18px]" />
          <div className="absolute bg-black left-[81.99px] size-[3px] top-0" />
          <div className="absolute bg-black left-[99.99px] size-[3px] top-0" />
          <div className="absolute bg-black left-[84.99px] size-[3px] top-[3px]" />
          <div className="absolute bg-black left-[102.99px] size-[3px] top-[3px]" />
          <div className="absolute bg-black left-[96.99px] size-[3px] top-[3px]" />
          <div className="absolute bg-black left-[60.99px] size-[3px] top-[3px]" />
          <div className="absolute bg-black left-[63.99px] size-[3px] top-[3px]" />
          <div className="absolute bg-black left-[84.99px] size-[3px] top-[6px]" />
          <div className="absolute bg-black left-[102.99px] size-[3px] top-[6px]" />
          <div className="absolute bg-black left-[96.99px] size-[3px] top-[6px]" />
          <div className="absolute bg-black left-[60.99px] size-[3px] top-[6px]" />
          <div className="absolute bg-black left-[63.99px] size-[3px] top-[6px]" />
          <div className="absolute bg-black left-[84.99px] size-[3px] top-[9px]" />
          <div className="absolute bg-black left-[102.99px] size-[3px] top-[9px]" />
          <div className="absolute bg-black left-[60.99px] size-[3px] top-[9px]" />
          <div className="absolute bg-black left-[63.99px] size-[3px] top-[9px]" />
          <div className="absolute bg-black left-[84.99px] size-[3px] top-[12px]" />
          <div className="absolute bg-black left-[102.99px] size-[3px] top-[12px]" />
          <div className="absolute bg-black left-[96.99px] size-[3px] top-[12px]" />
          <div className="absolute bg-black left-[60.99px] size-[3px] top-[12px]" />
          <div className="absolute bg-black left-[63.99px] size-[3px] top-[12px]" />
          <div className="absolute bg-black left-[84.99px] size-[3px] top-[15px]" />
          <div className="absolute bg-black left-[102.99px] size-[3px] top-[15px]" />
          <div className="absolute bg-black left-[96.99px] size-[3px] top-[15px]" />
          <div className="absolute bg-black left-[84.99px] size-[3px] top-[18px]" />
          <div className="absolute bg-black left-[102.99px] size-[3px] top-[18px]" />
          <div className="absolute bg-black left-[60.99px] size-[3px] top-[15px]" />
          <div className="absolute bg-black left-[63.99px] size-[3px] top-[15px]" />
          <div className="absolute bg-black left-[87.99px] size-[3px] top-[3px]" />
          <div className="absolute bg-black left-[105.98px] size-[3px] top-[3px]" />
          <div className="absolute bg-black left-[87.99px] size-[3px] top-[6px]" />
          <div className="absolute bg-black left-[105.98px] size-[3px] top-[6px]" />
          <div className="absolute bg-black left-[87.99px] size-[3px] top-[9px]" />
          <div className="absolute bg-black left-[87.99px] size-[3px] top-[12px]" />
          <div className="absolute bg-black left-[105.98px] size-[3px] top-[12px]" />
          <div className="absolute bg-black left-[87.99px] size-[3px] top-[15px]" />
          <div className="absolute bg-black left-[105.98px] size-[3px] top-[15px]" />
          <div className="absolute bg-black left-[87.99px] size-[3px] top-[18px]" />
          <div className="absolute bg-black left-[84.99px] size-[3px] top-0" />
          <div className="absolute bg-black left-[102.99px] size-[3px] top-0" />
          <div className="absolute bg-black left-[60.99px] size-[3px] top-0" />
          <div className="absolute bg-black left-[60.99px] size-[3px] top-[18px]" />
          <div className="absolute bg-black left-[63.99px] size-[3px] top-[18px]" />
          <div className="absolute bg-black left-[66.99px] size-[3px] top-[18px]" />
          <div className="absolute bg-black left-[69.99px] size-[3px] top-[18px]" />
        </div>
      </div>
    </div>
  );
}