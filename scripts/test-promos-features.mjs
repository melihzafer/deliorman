import {sanityClient} from '../src/lib/sanity.client.js';
import {groq} from 'next-sanity';

const PROMOS_QUERY = groq`
  *[_type == "promo"] | order(_createdAt desc) {
    _id,
    title,
    description,
    features[] {
      icon,
      title,
      text
    },
    buttonLink,
    buttonLabel
  }
`;

async function testPromos() {
  try {
    console.log('🔍 Fetching promos with features...\n');
    const promos = await sanityClient.fetch(PROMOS_QUERY);

    console.log(`✅ Found ${promos.length} promos\n`);

    promos.forEach((promo, index) => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📋 Promo ${index + 1}: ${promo.title}`);
      console.log(`${'='.repeat(60)}`);
      console.log(`Description: ${promo.description?.substring(0, 80)}...`);
      console.log(`\n🔘 Features (${promo.features?.length || 0}):`);

      if (promo.features && promo.features.length > 0) {
        promo.features.forEach((feature, idx) => {
          console.log(`  ${idx + 1}. ${feature.icon} ${feature.title}: ${feature.text}`);
        });
      } else {
        console.log('  ❌ No features found');
      }

      console.log(`\n🔗 Button:`);
      console.log(`  Label: ${promo.buttonLabel || 'NOT SET'}`);
      console.log(`  Link: ${promo.buttonLink || 'NOT SET'}`);
    });

    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ Test completed successfully');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testPromos();

