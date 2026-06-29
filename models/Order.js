const mongoose = require('mongoose');

/**
 * Order Model
 * Full shipment / order record with granular tracking history.
 * Linked to a QuoteRequest and assigned staff member.
 * trackingHistory stores every status change for timeline display.
 */
const OrderSchema = new mongoose.Schema(
  {
    bookingRef: {
      type: String,
      required: [true, 'Booking reference is required'],
      unique: true,
      trim: true,
    },
    quoteRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuoteRequest',
    },

    // ── Customer details ──────────────────────────────────────────────
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
    },
    customerAddress: {
      type: String,
      trim: true,
    },

    // ── Origin ────────────────────────────────────────────────────────
    originCity: {
      type: String,
      required: [true, 'Origin city is required'],
      trim: true,
    },
    originAddress: {
      type: String,
      trim: true,
    },

    // ── Destination ───────────────────────────────────────────────────
    destinationCountry: {
      type: String,
      required: [true, 'Destination country is required'],
      trim: true,
    },
    destinationCountryCode: {
      type: String,
      trim: true,
    },
    destinationAddress: {
      type: String,
      required: [true, 'Destination address is required'],
      trim: true,
    },
    destinationCity: {
      type: String,
      trim: true,
    },

    // ── Medicine info ─────────────────────────────────────────────────
    medicineType: {
      type: String,
      enum: ['allopathic', 'homeopathic', 'ayurvedic', 'unani', 'critical'],
    },
    medicineList: [
      {
        name: { type: String },
        quantity: { type: Number },
      },
    ],
    hasPrescription: {
      type: Boolean,
    },

    // ── Pricing & payment ─────────────────────────────────────────────
    weight: {
      type: Number,
    },
    basePrice: {
      type: Number,
    },
    finalPrice: {
      type: Number,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending',
    },

    // ── Order status & tracking ───────────────────────────────────────
    status: {
      type: String,
      enum: [
        'booking_confirmed',
        'pickup_scheduled',
        'picked_up',
        'reached_warehouse',
        'photo_verified',
        'documentation_prepared',
        'packing_done',
        'customs_clearance',
        'dispatched',
        'in_transit',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'returned',
      ],
      default: 'booking_confirmed',
    },
    currentLocation: {
      type: String,
    },
    trackingHistory: [
      {
        status: { type: String },
        location: { type: String },
        description: { type: String },
        timestamp: { type: Date, default: Date.now },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],

    // ── Courier partner info ──────────────────────────────────────────
    courierPartner: {
      type: String,
    },
    courierTrackingId: {
      type: String,
    },
    estimatedDelivery: {
      type: Date,
    },
    estimatedDeliveryTime: {
      type: String,
    },
    actualDelivery: {
      type: Date,
    },

    // ── Assignment & notes ────────────────────────────────────────────
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
    },

    // Soft-delete fields
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', OrderSchema);
