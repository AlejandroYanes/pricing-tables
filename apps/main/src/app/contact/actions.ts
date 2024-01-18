'use server';

export async function postQuery(form: FormData) {
  const data = {
    name: form.get('name'),
    email: form.get('email'),
    company: form.get('company'),
    source: form.get('source'),
    message: form.get('message'),
    consent: form.get('consent') === 'on',
  };
  console.log('query', data);
}
