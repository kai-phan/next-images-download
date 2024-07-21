'use server';

export const fetchImage = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch image');

    const blob = await res.blob();
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return {
      url: `data:image/jpeg;base64,${base64}`,
      type: 'image/jpeg',
      name: url.split('retail-products/')[1],
    };
  } catch (error) {
    return null;
  }
};
