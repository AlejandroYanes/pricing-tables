import type { Templates, WidgetInfo } from '@dealo/models';

import BasicTemplate, { BasicSkeleton } from '../Basic';
import SecondTemplate, { SecondSkeleton } from '../Second';
import ThirdTemplate, { ThirdSkeleton } from '../Third';

// import { BasicSkeleton } from '../Basic';
// import { SecondSkeleton } from '../Second';
// import { ThirdSkeleton } from '../Third';
// const BasicTemplate = lazy(() => import('../Basic'));
// const SecondTemplate = lazy(() => import('../Second'));
// const ThirdTemplate = lazy(() => import('../Third'));

export enum TEMPLATE_IDS {
  BASIC = '1',
  SECOND = '2',
  THIRD = '3',
}

export const templatesList: Templates[] = [
  { id: TEMPLATE_IDS.BASIC, name: 'First Template' },
  { id: TEMPLATE_IDS.SECOND, name: 'Second Template' },
  { id: TEMPLATE_IDS.THIRD, name: 'Third Template' },
];

interface TemplatesMap {
  [s: string]: {
    render: (props?: any) => JSX.Element | null;
    calculateIsMobile: (widget: WidgetInfo, screenWidth: number) => boolean;
  };
}
export const templatesMap: TemplatesMap = {
  [TEMPLATE_IDS.BASIC]: {
    render: BasicTemplate,
    calculateIsMobile: (widget: WidgetInfo, screenWidth: number) => {
      const { products } = widget;
      const width = products.length * 300;
      return screenWidth < width;
    },
  },
  [TEMPLATE_IDS.SECOND]: {
    render: SecondTemplate,
    calculateIsMobile: (widget: WidgetInfo, screenWidth: number) => {
      const { products } = widget;
      const width = products.length * 300;
      return screenWidth < width;
    },
  },
  [TEMPLATE_IDS.THIRD]: {
    render: ThirdTemplate,
    calculateIsMobile: (_widget, screenWidth: number) => screenWidth < 900,
  },
};

export const mockTemplate = { render: () => null, calculateIsMobile: () => false };

export const skeletonMap: Record<string, (props?: any) => JSX.Element> = {
  [TEMPLATE_IDS.BASIC]: BasicSkeleton,
  [TEMPLATE_IDS.SECOND]: SecondSkeleton,
  [TEMPLATE_IDS.THIRD]: ThirdSkeleton,
}
