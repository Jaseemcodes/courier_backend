const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pricing = require('../models/Pricing');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const DEFAULT_LOGOS = {
  "DHL": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/512px-DHL_Logo.svg.png",
  "UPS": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/UPS_Logo_Shield_2017.svg/339px-UPS_Logo_Shield_2017.svg.png",
  "FedEx": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/FedEx_Express.svg/512px-FedEx_Express.svg.png",
  "ARAMEX": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Aramex_logo.svg/512px-Aramex_logo.svg.png",
  "DPD": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/DPD_logo_%282015%29.svg/512px-DPD_logo_%282015%29.svg.png",
  "ECONOMY POST": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/India_Post_Logo_With_Text.svg/512px-India_Post_Logo_With_Text.svg.png"
};

const migrateProviderLogos = async () => {
  try {
    const pricings = await Pricing.find();
    let updatedCount = 0;

    for (const pricing of pricings) {
      let changed = false;
      pricing.providers.forEach(p => {
        // Find a matching default logo if not already set
        const upperName = p.provider.toUpperCase();
        
        let match = null;
        for (const [key, url] of Object.entries(DEFAULT_LOGOS)) {
          if (upperName.includes(key)) {
            match = url;
            break;
          }
        }

        if (match && !p.image) {
          p.image = match;
          changed = true;
        }
      });

      if (changed) {
        await pricing.save();
        updatedCount++;
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} pricing documents with default logos.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrateProviderLogos();
