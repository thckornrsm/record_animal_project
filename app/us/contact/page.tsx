"use client";

import { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate an API call or form submission
    setTimeout(() => {
      setStatusMessage("Thank you for reaching out! We will get back to you soon.");
      setIsSubmitting(false);
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-4">
        Have questions or suggestions? We'd love to hear from you. Feel free to reach out using the form below or email us directly at{" "}
        <strong>support@mypetdiary.com</strong>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700">Your Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-gray-700">Your Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
            placeholder="Write your message here"
            rows={4}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-3 text-white font-semibold rounded-md ${isSubmitting ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"} transition`}
        >
          {isSubmitting ? "Submitting..." : "Send Message"}
        </button>
      </form>

      {statusMessage && (
        <div className="mt-6 text-green-600 font-semibold">
          {statusMessage}
        </div>
      )}
    </div>
  );
}
