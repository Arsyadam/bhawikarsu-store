const BITESHIP_API_KEY = "biteship_test.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdGluZy1iaGFzd2lrYXJzdSBzdG9yZSIsInVzZXJJZCI6IjY5OTkzNGQ1MTA4NjRhZjcyZjM5MmMwNyIsImlhdCI6MTc3MTY0ODgxM30.d7cOqK6LTySpGcNZRJBoZAEdrNcTNTY2GSHUXiyEMbY";
const BITESHIP_URL = "https://api.biteship.com/v1";

async function test() {
  const data = {
    origin_area_id: "IDNP5IDNC136IDND804IDZ65122",
    destination_area_id: "IDNP6IDNC148IDND843IDZ12250",
    couriers: "jne,jnt,sicepat",
    items: [
      {
        name: "Test Item",
        value: 100000,
        weight: 500,
        quantity: 1,
        length: 10,
        width: 10,
        height: 10
      }
    ]
  };

  try {
    const res = await fetch(`${BITESHIP_URL}/rates/couriers`, {
      method: 'POST',
      headers: { 
        'Authorization': BITESHIP_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (err) {
    console.error(err);
  }
}

test();
