import { NewReleaseEmail } from './new-release';

export enum EMAIL_TEMPLATES {
  NEW_RELEASE = 'new_release',
}

interface ITemplatesMap {
  [s: string]: {
    render: (props?: any) => JSX.Element | null;
  };
}

export const TEMPLATES_MAP: ITemplatesMap = {
  [EMAIL_TEMPLATES.NEW_RELEASE]: {
    render: NewReleaseEmail,
  },
};
