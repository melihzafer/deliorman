// lib/sanity.ts
import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: '6sdtxnoz', // Твоето ID
    dataset: 'production',
    apiVersion: '2025-01-01',
    useCdn: false, // false = винаги пресни данни (важно докато разработваш)
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
    return builder.image(source);
}