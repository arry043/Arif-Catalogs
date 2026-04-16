async function testApi() {
  console.log('Testing local API endpoints...');
  try {
    const res = await fetch('http://localhost:5001/api/v1/products/categories');
    if (res.ok) {
      const data = await res.json();
      console.log('✅ API /categories OK!');
      console.log('Categories found:', data.length);
      process.exit(0);
    } else {
      console.error('❌ API returned error:', res.status);
      process.exit(1);
    }
  } catch (err: any) {
    console.error('❌ Could not connect to API. Is the server running?');
    process.exit(1);
  }
}

testApi();
