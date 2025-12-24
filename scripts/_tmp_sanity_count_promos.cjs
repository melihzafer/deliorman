const {createClient} = require('@sanity/client');
const client = createClient({
  projectId: '6sdtxnoz',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
});
client.fetch('count(*[_type == "promo"])')
  .then((c) => { console.log('promoCount', c); })
  .catch((e) => { console.error(e.responseBody || e); process.exit(1); });
