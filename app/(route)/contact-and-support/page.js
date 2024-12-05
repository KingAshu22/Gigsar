"use client";

import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen flex flex-col items-center py-12 bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Contact Us
        </h1>

        <div className="grid grid-rows-1 md:grid-rows-1 gap-8 mb-8">
          {/* Contact Information Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <div className="flex items-center space-x-4 p-4 border border-gray-300 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <Phone className="text-blue-600 w-6 h-6" />
              <div>
                <p className="text-lg font-semibold">Phone</p>
                <p className="text-gray-600">+91 98929 62178</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 border border-gray-300 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <Mail className="text-blue-600 w-6 h-6" />
              <div>
                <p className="text-lg font-semibold">Email</p>
                <p className="text-gray-600">support@gigsar.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 border border-gray-300 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <MapPin className="text-blue-600 w-6 h-6" />
              <div>
                <p className="text-lg font-semibold">Address</p>
                <p className="text-gray-600">
                  243, B Wing, Orchid Road Mall, Royal Palms, Goregaon(E), Aarey Milk Colony, Goregaon East, Mumbai- 400065,
                  Maharashtra
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 border border-gray-300 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <MapPin className="text-blue-600 w-6 h-6" />
              <div>
                <p className="text-lg font-semibold">Important Details</p>
                <p className="text-gray-600">
                  Legal Name: Gigsar India Private Limited<br />
                  Corporate Identification Number: U82300MH2024PTC435832<br />
                  Permanent Account Number: AALCG6323Q<br />
                  Tax Deduction & Collection Account Number: MUMG27543F
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
