require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const AboutSection = require('../models/AboutSection');

const seedData = [
  {
    key: "about-hero",
    name: "About Page Hero Banner",
    title: "About Our Company",
    subtitle: "Home » About Us",
    sortOrder: 1,
    isActive: true,
    content: {
      bgImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80"
    }
  },
  {
    key: "about-welcome",
    name: "Welcome Column & Priorities Cards",
    title: "No.1 International Medicine Courier Company in India",
    subtitle: "Welcome to Courier Medicines",
    sortOrder: 2,
    isActive: true,
    content: {
      description1: "At Courier Medicines, we deliver your medicines anywhere in the world. Our team is highly experienced in international medicine delivery, so you can relax knowing your medications will arrive safely and quickly.",
      description2: "Courier medicine from India is legal and we make the process seamless for you by providing Express International medicine courier services from India to Abroad. We have expertise in Courier Different types of medicines be it Liquid or Tablets - allopathic medicine, ayurvedic, homeopathy, herbal, or cold storage / temperature control Medicine.",
      buyServiceTitle: "Service of Buying Prescription medicines",
      buyServiceDesc: "We provide the Service of Buying Prescription medicines on our customer's behalf from a reputed pharmacy to Ensure you Receive Genuine Medicines with the best and most convenient service. Our expert team makes it easy to get these Meds you need without searching for them yourself.",
      priorities: [
        {
          title: "Customer Satisfaction",
          icon: "Heart",
          description: "Fulfilling our client's needs is our top priority. We are always ready to meet your dynamic logistical requirements, anytime and anywhere."
        },
        {
          title: "Innovative Solutions",
          icon: "Shield",
          description: "We offer top-notch facilities like live online tracking, door-to-door pickups, proxy prescription procurement, and real-time status updates."
        },
        {
          title: "Efficiency & Transparency",
          icon: "CheckCircle",
          description: "Serving you with full speed, efficiency, and pricing transparency is our prime goal so you get your essential medicines on time."
        },
        {
          title: "Expert Guidance",
          icon: "Users",
          description: "We provide comprehensive guidance through our documentation experts, assisting with customs clearance in both India and the destination country."
        }
      ]
    }
  },
  {
    key: "about-vision-mission",
    name: "Vision, Mission & Reach Cards",
    title: "Delhi Headquartered Operations",
    subtitle: "Operating across all major cities in India, including Delhi NCR, Gurgaon, Noida, Mumbai, Pune, Hyderabad, Bangalore, Punjab, Chennai, Coimbatore, Jaipur, and many more, with direct door delivery worldwide.",
    sortOrder: 3,
    isActive: true,
    content: {
      vision: "At Courier Medicines, we are dedicated to delivering all types of medicine couriers worldwide. We are committed to making the lives of our customers easier by overcoming the obstacles associated with international medicine couriers, ensuring cost-effectiveness and timely delivery of medicines. We aim to be the leading service provider in the industry, known for our wide international reach and commitment to excellence.",
      mission: "Our mission is to meet and exceed our client's needs by providing the best global and local international delivery services. Headquartered in Delhi and operating across all major cities in India, we prioritize customer satisfaction, speed, efficiency, and expert documentation guidance to make medicine access global.",
      reachCards: [
        {
          title: "Free Door Pickup",
          icon: "MapPin",
          description: "Providing free doorstep pickup service across major Indian hubs: Delhi NCR, Mumbai, Bangalore, Pune, Hyderabad, Chennai, Kolkata, and others."
        },
        {
          title: "Global Coverage",
          icon: "Globe",
          description: "Door delivery to all major international countries: USA, UK, Canada, Australia, New Zealand, Europe, Middle East, Asia, and more."
        },
        {
          title: "All Medicine Types",
          icon: "Package",
          description: "Expertise in couriering all types of medicines: Liquids, Tablets, Allopathic, Ayurvedic, Homeopathic, Herbal, and cold storage."
        },
        {
          title: "Door-to-Door Courier",
          icon: "Truck",
          description: "Complete end-to-end cargo logistics with live tracking, structured packing, and customs clearance assistance."
        }
      ]
    }
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Clearing existing about sections...');
    await AboutSection.deleteMany();

    console.log('Inserting about sections seed data...');
    await AboutSection.insertMany(seedData);

    console.log('🎉 About page seeding completed successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ About page seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
