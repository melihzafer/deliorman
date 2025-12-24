const {createClient} = require('@sanity/client');
const client = createClient({projectId:'6sdtxnoz',dataset:'production',apiVersion:'2025-01-01',useCdn:false});
client.fetch('count(*[_type == "menuItem"])')
  .then((c) => { console.log('menuItemCount', c); })
  .catch((e) => { console.error(e.responseBody || e); process.exit(1); });
