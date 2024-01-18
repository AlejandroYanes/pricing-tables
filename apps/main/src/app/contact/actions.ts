'use server';

export interface Query {
  name: string;
  email: string;
  company: string;
  source: string;
  message: string;
  consent: boolean;
}

export async function postQuery(data: Query) {
  // const data = {
  //   name: form.get('name'),
  //   email: form.get('email'),
  //   company: form.get('company'),
  //   source: form.get('source'),
  //   message: form.get('message'),
  //   consent: form.get('consent') === 'on',
  // };
  console.log('query', data);
}
