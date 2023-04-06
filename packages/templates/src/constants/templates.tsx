import type { Templates } from 'models';

import { BasicTemplate } from '../Basic';

export enum TEMPLATE_IDS {
  BASIC = '1',
  FAKE_1 = '2',
  FAKE_2 = '3',
}

export type TemplateId = keyof typeof TEMPLATE_IDS;

export const templatesList: Templates[] = [
  { id: TEMPLATE_IDS.BASIC, name: 'Basic' },
  { id: TEMPLATE_IDS.FAKE_1, name: 'Fake 1' },
  { id: TEMPLATE_IDS.FAKE_2, name: 'Fake 2' },
];

export const templatesMap: Record<string, (props?: any) => JSX.Element> = {
  [TEMPLATE_IDS.BASIC]: BasicTemplate,
  [TEMPLATE_IDS.FAKE_1]: () => <>Fake 1</>,
  [TEMPLATE_IDS.FAKE_2]: () => <>Fake 2</>,
};
