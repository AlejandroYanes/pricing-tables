
import { RenderIf, Separator } from '@dealo/ui';

interface Props {
  leftContent: ReactNode;
  rightContent: ReactNode;
}

export default function TwoColumnsLayout(props: Props) {
  const { rightContent, leftContent } = props;

  return (
    <>
      <RenderIf condition={!!leftContent}>
        <div className="flex flex-col pt-5 w-[380px] max-w-[380px]">
          {leftContent}
        </div>
        <Separator orientation="vertical" className="mx-4" />
      </RenderIf>
      <div className="flex flex-col flex-1">
        {rightContent}
      </div>
    </>
  );
}
