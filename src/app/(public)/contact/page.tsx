"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2, MessageSquare, MapPin } from "lucide-react";
import { toast } from "sonner";
import { submitContactAction } from "@/app/actions/message-actions";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error("Please enter your name (at least 2 characters).");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!subject.trim()) {
      toast.error("Please provide a subject.");
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      toast.error("Please enter your message (at least 5 characters).");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("subject", subject.trim());
    formData.append("message", message.trim());

    try {
      const res = await submitContactAction(formData);
      if (res.success) {
        setSubmitted(true);
        toast.success(res.message);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        toast.error(res.error || "Failed to send message.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7434E8]/10 text-[#7434E8] text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#202A3D]">
            Have a question, feedback or collaboration idea?
          </h1>
          <p className="text-base text-[#667085] leading-relaxed">
            We love hearing from readers, fellow engineers, and collaborators. Fill out the form below and we will get back to you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-white border border-[#E9E7F1] p-8 shadow-sm space-y-6">
              <h3 className="font-heading font-bold text-xl text-[#202A3D]">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#7434E8]/10 text-[#7434E8] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#667085] uppercase tracking-wider">
                      Direct Inquiries
                    </p>
                    <p className="text-sm font-semibold text-[#202A3D] mt-0.5">
                      contact@animeshkibaatein.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7434E8] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#667085] uppercase tracking-wider">
                      Response Time
                    </p>
                    <p className="text-sm font-semibold text-[#202A3D] mt-0.5">
                      Typically within 24–48 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F2F1F8]">
                <p className="text-xs text-[#667085] leading-relaxed">
                  Submissions are reviewed directly by Animesh Prakash. No automated third-party routing.
                </p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-[#E9E7F1] p-8 sm:p-10 shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-[#202A3D]">
                    Message Received!
                  </h3>
                  <p className="text-sm text-[#667085] max-w-sm mx-auto">
                    Thank you for reaching out. We have safely saved your message and will review it shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7434E8] text-white text-xs font-semibold hover:bg-[#6028C9]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7434E8]/20 focus:border-[#7434E8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7434E8]/20 focus:border-[#7434E8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What is this regarding?"
                      className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7434E8]/20 focus:border-[#7434E8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your thoughts, feedback, or inquiry in detail..."
                      className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7434E8]/20 focus:border-[#7434E8] resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#7434E8] hover:bg-[#6028C9] text-white text-sm font-semibold shadow-md shadow-[#7434E8]/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? "Sending Message..." : "Send Message"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
