import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, HelpCircle, MessageSquare, Bug, Lightbulb, Settings, Mail, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

// Form validation schema
const supportSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  category: z.string().min(1, "Please select a category"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

type SupportFormData = z.infer<typeof supportSchema>;

const supportCategories = [
  { value: "bug", label: "Bug Report", icon: Bug, description: "Report a technical issue or bug" },
  { value: "feature", label: "Feature Request", icon: Lightbulb, description: "Suggest a new feature or improvement" },
  { value: "support", label: "General Support", icon: HelpCircle, description: "Get help with using the app" },
  { value: "feedback", label: "General Feedback", icon: MessageSquare, description: "Share your thoughts and feedback" },
  { value: "account", label: "Account Issues", icon: Settings, description: "Problems with your account or settings" },
];

const Support: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
    mode: "onChange",
  });

  const messageValue = watch("message", "");

  const onSubmit = async (data: SupportFormData) => {
    setIsSubmitting(true);

    try {
      // Get EmailJS configuration from environment variables
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
      const templateId = import.meta.env.VITE_EMAILJS_SUPPORT_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration is missing');
      }

      // Prepare template parameters
      const templateParams = {
        user_name: data.name,
        user_email: data.email,
        category: data.category,
        subject: data.subject,
        message: data.message,
        to_email: 'harry@lidldev.com',
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      toast.success("Support request sent successfully! We'll get back to you soon.");
      reset();
      setSelectedCategory("");
    } catch (error) {
      console.error('Error sending support request:', error);
      toast.error("Failed to send support request. Please try again or contact us directly at harry@lidldev.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySelect = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setValue("category", categoryValue, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Support & Feedback"
        description="Get help with LidlDev services or provide feedback. Contact our support team for technical issues, feature requests, and general inquiries."
        url="https://www.lidldev.com/support"
      />
      <NavigationBar />
      
      {/* Back Navigation */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Support & Feedback
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Need help or have feedback? We're here to assist you. Choose a category below and let us know how we can help.
          </p>
        </div>

        {/* Support Form */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 rounded-2xl">
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Category Selection */}
              <div className="space-y-4">
                <label className="text-sm font-medium">
                  What can we help you with? <span className="text-red-500">*</span>
                </label>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {supportCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => handleCategorySelect(category.value)}
                        className={`p-4 rounded-lg border-2 transition-all text-left hover:border-primary/50 ${
                          selectedCategory === category.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-white/50 dark:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <IconComponent className={`w-5 h-5 mt-0.5 ${
                            selectedCategory === category.value ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                          <div>
                            <h3 className={`font-medium text-sm ${
                              selectedCategory === category.value ? 'text-primary' : 'text-foreground'
                            }`}>
                              {category.label}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" {...register("category")} />
                {errors.category && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
                )}
              </div>

              {/* Personal Information */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className={`w-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      errors.name ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className={`w-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      errors.email ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register("subject")}
                  className={`w-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.subject ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Brief description of your request"
                />
                {errors.subject && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.subject.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={6}
                  {...register("message")}
                  className={`w-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none ${
                    errors.message ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Please provide as much detail as possible..."
                />
                <div className="flex justify-between items-center">
                  {errors.message && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground ml-auto">
                    {messageValue.length}/1000 characters
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Contact Information */}
            <div className="mt-8 pt-8 border-t border-border">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Need immediate assistance?</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <a href="mailto:harry@lidldev.com" className="text-primary hover:underline">
                      harry@lidldev.com
                    </a>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <p>We typically respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Support;
