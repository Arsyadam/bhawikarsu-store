"use server";

import Midtrans from "midtrans-client";
import { createClient } from "@/utils/supabase/server";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
const midtransApiUrl = isProduction ? "https://api.midtrans.com/v2" : "https://api.sandbox.midtrans.com/v2";

// Initialize Midtrans Core API client
const core = new Midtrans.CoreApi({
  isProduction: isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

export async function createMidtransTransaction(orderData: {
  amount: number;
  items: any[];
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
}) {
  try {
    const orderId = crypto.randomUUID();
    
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const authHeader = Buffer.from(`${serverKey}:`).toString("base64");

    const parameter = {
      payment_type: "qris",
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(orderData.amount),
      },
      item_details: orderData.items.map(item => ({
        id: (item.id || "item").toString().substring(0, 50),
        price: Math.max(0, Math.round(item.price)),
        quantity: item.quantity,
        name: (item.name || "Product").substring(0, 50),
      })),
      customer_details: {
        first_name: orderData.customerDetails.firstName,
        last_name: orderData.customerDetails.lastName,
        email: orderData.customerDetails.email,
        phone: orderData.customerDetails.phone,
        billing_address: {
            first_name: orderData.customerDetails.firstName,
            last_name: orderData.customerDetails.lastName,
            email: orderData.customerDetails.email,
            phone: orderData.customerDetails.phone,
            address: orderData.customerDetails.address,
        },
        shipping_address: {
            first_name: orderData.customerDetails.firstName,
            last_name: orderData.customerDetails.lastName,
            email: orderData.customerDetails.email,
            phone: orderData.customerDetails.phone,
            address: orderData.customerDetails.address,
        }
      },
      qris: {
        acquirer: "gopay"
      }
    };

    // Log calculation to ensure sum matches gross_amount (prevents 500 simulator error)
    const itemsSum = parameter.item_details.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    console.log(`Gross Amount: ${parameter.transaction_details.gross_amount}, Items Sum: ${itemsSum}`);
    
    if (itemsSum !== parameter.transaction_details.gross_amount) {
        console.error("CRITICAL: Amount mismatch between gross_amount and item_details sum!");
    }

    console.log("Sending Direct Charge Request:", JSON.stringify(parameter, null, 2));

    const response = await fetch(`${midtransApiUrl}/charge`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Basic ${authHeader}`
      },
      body: JSON.stringify(parameter)
    });

    const result = await response.json();
    console.log("Midtrans Raw Result:", JSON.stringify(result, null, 2));

    if (!response.ok || result.status_code !== "201") {
        return {
            success: false,
            error: result.status_message || `Midtrans Error: ${result.status_code}`
        };
    }

    const qrAction = result.actions?.find((action: any) => action.name === "generate-qr-code");
    const qrActionV2 = result.actions?.find((action: any) => action.name === "generate-qr-code-v2");

    // 4. Save to Database (Supabase)
    try {
      const supabase = await createClient();
      const { error: dbError } = await supabase.from("orders").insert([
        {
          id: result.order_id,
          customer: `${orderData.customerDetails.firstName} ${orderData.customerDetails.lastName} - ${orderData.customerDetails.address}`,
          email: orderData.customerDetails.email,
          // Removed 'phone' and 'address' root fields to fix Supabase PGRST204 error
          total: Math.round(Number(result.gross_amount)),
          items: orderData.items,
          status: "pending",
          created_at: new Date().toISOString()
        }
      ]);

      if (dbError) console.error("Supabase Error:", dbError);
    } catch (dbErr) {
      console.error("Supabase Connection Failed:", dbErr);
    }

    return {
      success: true,
      transaction_id: result.transaction_id,
      order_id: result.order_id,
      gross_amount: result.gross_amount,
      qr_url: qrAction?.url || qrActionV2?.url,
      qr_string: result.qr_string,
      status: result.transaction_status,
      actions: result.actions,
      expiry_time: result.expiry_time
    };

  } catch (error: any) {
    console.error("Midtrans Fatal Error:", error);
    return {
      success: false,
      error: error.message || "Gagal menghubungi server pembayaran"
    };
  }
}

export async function checkPaymentStatus(orderId: string) {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const authHeader = Buffer.from(`${serverKey}:`).toString("base64");

    const response = await fetch(`${midtransApiUrl}/${orderId}/status`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Basic ${authHeader}`
      },
      cache: 'no-store'
    });

    const result = await response.json();
    console.log("Status Check Result:", result);

    const isPaid = result.transaction_status === "settlement" || result.transaction_status === "capture";
    
    if (isPaid) {
        // Update database status
        const supabase = await createClient();
        await supabase
            .from("orders")
            .update({ status: "completed" })
            .eq("id", orderId);
            
        return { success: true, status: result.transaction_status, paid: true };
    }

    return { 
        success: true, 
        paid: false, 
        status: result.transaction_status,
        message: result.status_message 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
