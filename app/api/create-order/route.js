import Razorpay from "razorpay";
import fs from "fs";
import path from "path";

const razorpay = new Razorpay({
  key_id: "rzp_test_da6BN8GQaZjO9c",
  key_secret: "GHQ7UbFak9Ws37ML8upj3tih",
});

const ordersFilePath = path.resolve(process.cwd(), "orders.json");

const readData = () => {
  if (fs.existsSync(ordersFilePath)) {
    const data = fs.readFileSync(ordersFilePath);
    return JSON.parse(data);
  }
  return [];
};

const writeData = (data) => {
  fs.writeFileSync(ordersFilePath, JSON.stringify(data, null, 2));
};

// Export the POST method
export const POST = async (req) => {
  try {
    const { amount, currency, receipt, notes } = await req.json(); // Use await req.json() to parse the request body

    const options = {
      amount: amount * 100,
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);
    const orders = readData();
    orders.push({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: "created",
    });
    writeData(orders);

    return new Response(JSON.stringify(order), { status: 200 }); // Return a Response object
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error creating order" }), {
      status: 500,
    });
  }
};
