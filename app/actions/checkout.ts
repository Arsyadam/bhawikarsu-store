"use server";

/**
 * Placeholder for Mengantar API Integration
 * Documentation: https://mengantar.com/docs/api
 */
export async function getMengantarRates(origin: string, destination: string, weight: number) {
  // In a real scenario, you would call:
  // const res = await fetch("https://api.mengantar.com/rates", {
  //   method: "POST",
  //   headers: { "Authorization": `Bearer ${process.env.MENGANTAR_API_KEY}` },
  //   body: JSON.stringify({ origin, destination, weight })
  // });
  // return res.json();

  // Simulating response
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    { id: "reg", name: "J&T REGULAR", price: 12000, etd: "2-3 DAYS" },
    { id: "exp", name: "SICEPAT BEST", price: 25000, etd: "1-2 DAYS" },
    { id: "eco", name: "JNE OKE", price: 9000, etd: "4-5 DAYS" }
  ];
}

/**
 * Placeholder for Midtrans QRIS Integration
 */
export async function createMidtransTransaction(orderId: string, amount: number) {
    // const res = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", { ... });
    // return res.json();

    return {
        token: "mock_token_" + Math.random().toString(36).substring(7),
        redirect_url: "https://midtrans.com/qris/mock",
        qr_url: "/mock-qr.png"
    };
}
