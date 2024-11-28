import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define the schema for individual garden elements
const GardenElementSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number },
  height: { type: Number },
  radius: { type: Number }
}, { _id: false });


const AppointmentArchiveSchema = new Schema({
  schedulingDate: {
    type: Date,
    default: Date.now 
  },
  date: {
    type: Date,
    required: true 
  },
  time: {
    type: String,
    required: true
  },
  squareFootage: {
    type: Number,
    required: true 
  },
  gardenType: {
    type: String,
    required: true 
  },
  services: {
    type: [String],
    required: true 
  },
  additionalDescription: {
    type: String,
    default: ''
  },
  firm: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Firm',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  totalSquareFootage: {
    type: Number,
    required: true
  },
  poolSquareFootage: {
    type: Number,
    default: 0
  },
  greenerySquareFootage: {
    type: Number,
    default: 0  
  },
  sunbedsSquareFootage: {
    type: Number,
    default: 0
  },
  fountainSquareFootage: {
    type: Number,
    default: 0 
  },
  tableCount: {
    type: Number,
    default: 0 
  },
  chairCount: {
    type: Number,
    default: 0  
  },
  gardenLayout: [GardenElementSchema],  // Store array of garden elements directly
  owner: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  decoratorDecision: {
    type: String
  },
  rejectionComment: {
    type: String
  },
  decorator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

export default mongoose.model('appointment_archive', AppointmentArchiveSchema, 'appointment_archive');
