import { Schema, model, models } from "mongoose";

// One record per enquiry emailed to an artist. For paid enquiries the unique
// orderId stops the same payment from being used to send repeat emails.
// Free enquiries get a generated orderId and are rate-limited by contact and IP.
const EnquiryEmailSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    paymentId: String,
    kind: { type: String, enum: ["paid", "free"], default: "paid" },
    ip: String,
    linkid: String,
    artistEmail: String,
    clientName: String,
    clientEmail: String,
    clientContact: String,
    eventType: String,
    eventDate: String,
    location: String,
    budget: String,
    status: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
    error: String,
  },
  { timestamps: true }
);

const EnquiryEmail = models.EnquiryEmail || model("EnquiryEmail", EnquiryEmailSchema);

export default EnquiryEmail;
