import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String },
  link: { type: String },
  source: { type: String }, // LinkedIn, Naukri, Referral, etc.
  status: { 
    type: String, 
    enum: ['Saved','Applied','Interview','Offer','Rejected','Ghosted'], 
    default: 'Applied' 
  },
  contactName: { type: String },
  contactEmail: { type: String },
  notes: { type: String },
  appliedAt: { type: Date, default: Date.now },
  lastUpdate: { type: Date, default: Date.now }
}, { timestamps: true });

jobSchema.pre('save', function(next){
  this.lastUpdate = new Date();
  next();
});

export default mongoose.model('Job', jobSchema);
