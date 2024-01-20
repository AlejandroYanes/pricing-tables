import { type ReactNode } from 'react';
import { IconCheck } from '@tabler/icons-react';
import { RenderIf, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@dealo/ui';

import TwoColumnsLayout from './TwoColumnsLayout';
import { useVisualPanelStates } from './state';

interface Props {
  showPanel: boolean;
  template: ReactNode;
}

const TEMPLATE_COLOURS = {
  'red': 'bg-red-500',
  'orange': 'bg-orange-500',
  'amber': 'bg-amber-500',
  'yellow': 'bg-yellow-500',
  'lime': 'bg-lime-500',
  'green': 'bg-green-500',
  'emerald': 'bg-emerald-500',
  'teal': 'bg-teal-500',
  'cyan': 'bg-cyan-500',
  'sky': 'bg-sky-500',
  'blue': 'bg-blue-500',
  'indigo': 'bg-indigo-500',
  'violet': 'bg-violet-500',
  'purple': 'bg-purple-500',
  'fuchsia': 'bg-fuchsia-500',
  'pink': 'bg-pink-500',
  'rose': 'bg-rose-500',
};

const baseColors = Object.keys(TEMPLATE_COLOURS) as Array<keyof typeof TEMPLATE_COLOURS>;

export default function VisualsForm(props: Props) {
  const { showPanel, template } = props;
  const { color, setColor } = useVisualPanelStates();

  const panel = (
    <>
      <div>
        <h3 className="text-xl font-semibold">Pick a color</h3>
        <div className="grid grid-cols-5 gap-3 mt-4">
          {baseColors.map((baseColor) => (
            <div key={baseColor}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      role="button"
                      // eslint-disable-next-line max-len
                      className={`w-[36px] h-[36px] ${TEMPLATE_COLOURS[baseColor]} text-white rounded-full flex flex-col justify-center items-center cursor-pointer hover:opacity-80`}
                      onClick={() => setColor(baseColor)}
                    >
                      <RenderIf condition={baseColor === color}>
                        <IconCheck />
                      </RenderIf>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{baseColor}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <TwoColumnsLayout leftContent={showPanel ? panel : null} rightContent={template} />
  );
}
