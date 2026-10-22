import { Schema, model, models } from "mongoose";

// One record per paid enquiry that was emailed to an artist. The unique
// orderId stops the same payment from being used to send repeat emails.
const EnquiryEmailSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    paymentId: String,
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
