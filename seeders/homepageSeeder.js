require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const HomepageSection = require('../models/HomepageSection');

const seedData = [
  {
    key: "hero",
    name: "Hero Banner Slider & Form",
    title: "CHOOSE SERVICE FROM BELOW OPTION",
    subtitle: "Select Country and City to calculate medicine shipping charges instantly.",
    sortOrder: 1,
    isActive: true,
    content: {
      slides: [
        {
          heading: "Customer’s First & Trusted Choice",
          subheading: "For International Medicine Courier Services"
        }
      ],
      bullets: [
        "Medicines Procurement Service on Customer behalf",
        "Free Doorstep Medicine Pickup From India and International Delivery",
        "Cheapest Courier rates.",
        "Help In Documentation",
        "Live Tracking",
        "24x7 Customer Support"
      ]
    }
  },
  {
    key: "stats",
    name: "Business Achievements Statistics",
    title: "Our Milestone & Network Achievements",
    subtitle: "We take pride in delivering trust and healthcare products across boundaries.",
    sortOrder: 2,
    isActive: true,
    content: {
      stats: [
        { value: "48000+", label: "Successful Deliveries", suffix: "" },
        { value: "4.9 Excellent", label: "Google Rating", suffix: "", icon: "Google" },
        { value: "100%", label: "Customs Clearance Rate", suffix: "" },
        { value: "4.7", label: "Trustpilot rating", suffix: "" }
      ]
    }
  },
  {
    key: "what-medicines",
    name: "What Medicines We Can Courier",
    title: "What Medicines We Can Courier Internationally",
    subtitle: "We facilitate shipping of a wide range of pharmaceutical and healthcare products under compliance guidelines.",
    sortOrder: 3,
    isActive: true,
    content: {
      categories: [
        {
          id: "allopathic",
          title: "Allopathic Medicines",
          description: "All types of prescription drugs, tablets, capsules, syrups, and life-saving formulations.",
          icon: "Activity",
          imageUrl: "https://res.cloudinary.com/dib6l7ocv/image/upload/v1781865142/courier-medicine-static/cat_allopathic.jpg"
        },
        {
          id: "ayurvedic",
          title: "Ayurvedic & Herbal",
          description: "Natural remedies, herbal health supplements, organic formulations, and traditional Indian products.",
          icon: "Leaf",
          imageUrl: "https://res.cloudinary.com/dib6l7ocv/image/upload/v1781865143/courier-medicine-static/cat_ayurvedic.jpg"
        },
        {
          id: "homeopathic",
          title: "Homeopathic Medicines",
          description: "Dilutions, pills, drops, ointments, and specialty formulas from leading homeopathic manufacturers.",
          icon: "Droplets",
          imageUrl: "https://res.cloudinary.com/dib6l7ocv/image/upload/v1781865145/courier-medicine-static/cat_homeopathic.jpg"
        },
        {
          id: "coldchain",
          title: "Cold Chain Shipments",
          description: "Temperature-controlled shipping for insulin, vaccines, injections, and thermal-sensitive biologics.",
          icon: "Thermometer",
          imageUrl: "https://res.cloudinary.com/dib6l7ocv/image/upload/v1781865144/courier-medicine-static/cat_coldchain.jpg"
        }
      ]
    }
  },
  {
    key: "easy-courier",
    name: "Simple Step Accordions",
    title: "We Made Courier Medicines EASY",
    subtitle: "We offer complete assistance to make the entire process easy, transparent and reliable for you.",
    sortOrder: 4,
    isActive: true,
    content: {
      accordions: [
        {
          title: "Free Door-to-Door Pickup & Delivery",
          content: "Courier Medicines offers completely free doorstep medical shipment collection. You do not need to visit our warehouse; our dedicated local courier agent will collect your medicines directly from your residence or pharmacy across any location in India."
        },
        {
          title: "Reasonable rates",
          content: "We provide highly competitive and cheapest courier rates for global medicine delivery. Our structured corporate tie-ups with major international express partners ensure you receive premium high-speed courier solutions at heavily discounted pocket-friendly prices."
        },
        {
          title: "Purchase of Medicines on your behalf",
          content: "If you cannot procure specific medicines locally, our specialized procurement desk can purchase them from certified authorized pharmacies in India on your behalf, aggregate them, verify the batch numbers/expiry dates, and ship them securely."
        },
        {
          title: "Medicines Packing Services",
          content: "Courier Medicines helps in Packing also. As in case of pick up, the customer has to do the initial packing. Upon arrival at our warehouse, our team checks the condition of the medicines and determines the appropriate way, be it bubble wrap, thermacol, envelopes, or cardboard box to protect your medications from damage and maintaining their integrity throughout the delivery process."
        },
        {
          title: "Guaranteed Delivery Timeline",
          content: "We understand that medicines are life-critical. That's why we operate on a strictly committed and guaranteed delivery schedule. Typically, international shipments are delivered within 3 to 5 business days, backed by express air transit corridors."
        },
        {
          title: "24/7 Customer Support",
          content: "Need assistance with your package status or documentation queries at midnight? Our live support desk operates 24/7/365 to handle your urgent concerns immediately, assuring peace of mind at every milestone of your shipping experience."
        },
        {
          title: "Easy Payment Options",
          content: "We offer smooth, hassle-free payment flexibilities including Online Direct Bank Transfers, UPI (Google Pay, PhonePe, Paytm), Credit/Debit Card payments, and Stripe checkout options for global Indian diaspora customers."
        }
      ]
    }
  },
  {
    key: "flags",
    name: "Global Network Countries List",
    title: "Delivering Medicines Across 220+ Countries",
    subtitle: "We offer express shipping and hassle-free customs clearance in major global destinations.",
    sortOrder: 5,
    isActive: true,
    content: {}
  },
  {
    key: "documents",
    name: "Required Documentation Guide",
    title: "We Help You With DOCUMENTATION",
    subtitle: "We guide you in preparing the exact paperwork needed to guarantee smooth clearance.",
    sortOrder: 6,
    isActive: true,
    content: {
      items: [
        {
          title: "Soft Copies of Prescriptions Required",
          content: "To initiate your medical shipment, we require a scan or clean photo of a valid prescription issued by a registered medical practitioner. This ensures compliance with international customs laws and pharmaceutical export statutes."
        },
        {
          title: "Soft Copies of Bills Required",
          content: "A genuine purchase retail bill from a licensed medical store or pharmacy is mandatory. The name on the bill, prescription, and courier packing slip must correspond to maintain swift clearance without bureaucratic holdups."
        },
        {
          title: "Medicine Export Invoice Preparation",
          content: "Our logistics documentation specialists will handle the complex process of structuring full customs commercial invoices, MSDS declarations, and pharmaceutical export cargo lists for zero stress on your end."
        },
        {
          title: "Customs Clearance Assistance",
          content: "If your shipment Need help in customs clearance, Our team is there to Guide you through process to ensure your medicines are delivered promptly and efficiently. If any Financials involve to pay custom duty than receiver has to pay, As Courier Medicines don't have any Financial Interest into it."
        }
      ]
    }
  },
  {
    key: "cta-banner",
    name: "Action Call Banner",
    title: "Ready to Ship Your Essential Medicines?",
    subtitle: "Get a customized quote or talk to our live logistics specialists on WhatsApp now.",
    sortOrder: 7,
    isActive: true,
    content: {
      bgImage: "https://res.cloudinary.com/dib6l7ocv/image/upload/v1781865147/courier-medicine-static/cta_banner.png",
      buttonText: "Consult Our Experts",
      buttonLink: "https://wa.me/918882691919"
    }
  },
  {
    key: "process",
    name: "Logistics Flow Stages",
    title: "Our Global Shipping & Logistics Process",
    subtitle: "We maintain cold-chain integrity and medical compliance at every node of the transit flow.",
    sortOrder: 8,
    isActive: true,
    content: {
      steps: [
        {
          title: "1. Online Booking",
          description: "Initiate your order by uploading prescription details online or calling our team.",
          imageUrl: "/process_booking_new.png"
        },
        {
          title: "2. Doorstep Pickup",
          description: "Our courier agent collects the medicines from your home anywhere in India for free.",
          imageUrl: "/process_pickup_new.png"
        },
        {
          title: "3. Compliance Packing",
          description: "We pack items in regulatory secure boxes with cold-pack support if required.",
          imageUrl: "/process_packing_new.png"
        },
        {
          title: "4. Documentation Desk",
          description: "Customs specialists prepare regulatory documents, FDA/WHO compliance papers, and shipping invoices.",
          imageUrl: "/process_docs_new.png"
        },
        {
          title: "5. Transit Dispatch",
          description: "Package is dispatched via DHL/FedEx network partners for priority international transit.",
          imageUrl: "/process_dispatch_new.png"
        },
        {
          title: "6. Doorstep Delivery",
          description: "Shipment clears customs cleanly and is delivered straight to your home address abroad.",
          imageUrl: "/process_warehouse_new.png"
        }
      ]
    }
  },
  {
    key: "testimonials",
    name: "Customer Testimonials Slider",
    title: "Customer Feedback",
    subtitle: "Testimonials & Reviews",
    sortOrder: 9,
    isActive: true,
    content: {}
  }
];

const seedDB = async () => {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await connectDB();

    console.log('Clearing existing homepage sections...');
    await HomepageSection.deleteMany();

    console.log('Inserting homepage sections seed data...');
    await HomepageSection.insertMany(seedData);

    console.log('🎉 Database seeding completed successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Database seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
