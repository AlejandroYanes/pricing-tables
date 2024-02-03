export function buildSlug(blog: any) {
  const slug: string = blog.properties.Name?.title[0].plain_text.toLowerCase().replace(/ /g, '-');
  const cleanId = blog.id.replace(/-/g, '');
  return `${slug}-${cleanId}`;
}
