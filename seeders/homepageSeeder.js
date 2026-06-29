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
        { value: "10K+", label: "Successful Deliveries", suffix: "" },
        { value: "220+", label: "Global Destinations", suffix: "" },
        { value: "99.8%", label: "Customs Clearance Rate", suffix: "" },
        { value: "4.9/5", label: "Customer Rating", suffix: "" }
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
    title: "We Made Courier Medicines Easy",
    subtitle: "Our streamlined process ensures your essential medicines reach you in 4 simple steps.",
    sortOrder: 4,
    isActive: true,
    content: {
      accordions: [
        {
          title: "1. Upload Prescription & Details",
          content: "Simply share your valid prescription along with the quantity of medicines you require. Our pharmacy compliance experts will review and verify it."
        },
        {
          title: "2. Procurement (If Required)",
          content: "Don't have the medicines? No worries. We can procure them on your behalf from licensed pharmacies in India at discounted prices."
        },
        {
          title: "3. Professional Packaging & Customs Clearance",
          content: "Medicines are packed in certified temperature-resistant boxes with original invoices. We handle all customs documentation, clearances, and regulatory filings."
        },
        {
          title: "4. Express Doorstep Delivery",
          content: "Enjoy free home pickup in India and express international shipping with real-time transit tracking straight to your global destination."
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
    title: "Hassle-Free Customs & Documentation Support",
    subtitle: "We guide you in preparing the exact paperwork needed to guarantee smooth clearance.",
    sortOrder: 6,
    isActive: true,
    content: {
      items: [
        {
          title: "Valid Doctor's Prescription",
          content: "A scanned copy of a valid prescription listing the patient name, medicine names, dosage, and doctor's license details."
        },
        {
          title: "Patient Identity Proof",
          content: "Identity document (Passport copy, national ID, or visa copy) of the receiver living abroad to verify the importer profile."
        },
        {
          title: "Original Invoice & Bills",
          content: "The original store receipt containing batch numbers, expiry dates, price tags, and official pharmacy stamp signatures."
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
