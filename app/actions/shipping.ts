"use server";

const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY || "biteship_entitity_test_... "; // Need to provide a real one
const BITESHIP_URL = "https://api.biteship.com/v1";

export async function getProvinces() {
  const res = await fetch(`${BITESHIP_URL}/maps/areas?countries=ID&type=province`, {
    headers: { 'Authorization': BITESHIP_API_KEY }
  });
  return res.json();
}

export async function getCities(provinceId: string) {
  const res = await fetch(`${BITESHIP_URL}/maps/areas?countries=ID&type=city&parent_id=${provinceId}`, {
    headers: { 'Authorization': BITESHIP_API_KEY }
  });
  return res.json();
}

export async function getDistricts(cityId: string) {
  const res = await fetch(`${BITESHIP_URL}/maps/areas?countries=ID&type=district&parent_id=${cityId}`, {
    headers: { 'Authorization': BITESHIP_API_KEY }
  });
  return res.json();
}

export async function getShippingRates(data: {
  origin_area_id: string,
  destination_area_id: string,
  couriers: string,
  items: any[]
}) {
  const res = await fetch(`${BITESHIP_URL}/rates/couriers`, {
    method: 'POST',
    headers: { 
      'Authorization': BITESHIP_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function searchAreas(input: string) {
  const res = await fetch(`${BITESHIP_URL}/maps/areas?countries=ID&input=${encodeURIComponent(input)}&type=single`, {
    headers: { 'Authorization': BITESHIP_API_KEY }
  });
  return res.json();
}
