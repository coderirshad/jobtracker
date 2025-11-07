import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Job from '../models/Job.js';

const router = Router();

// List jobs with filters
router.get('/', requireAuth, async (req, res) => {
  const { q, status, source } = req.query;
  const filter = { userId: req.user.id };
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (q) {
    filter.$or = [
      { company: { $regex: q, $options: 'i' } },
      { role: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } },
    ];
  }
  const jobs = await Job.find(filter).sort({ lastUpdate: -1 });
  res.json({ ok: true, jobs });
});

// Create
router.post('/', requireAuth, async (req, res) => {
  const payload = { ...req.body, userId: req.user.id };
  if (!payload.company || !payload.role) return res.status(400).json({ error: 'company and role required' });
  const job = await Job.create(payload);
  res.json({ ok: true, job });
});

// Update
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const sets = { ...req.body, lastUpdate: new Date() };
  const job = await Job.findOneAndUpdate({ _id: id, userId: req.user.id }, { $set: sets }, { new: true });
  if (!job) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true, job });
});

// Delete
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const del = await Job.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!del) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

// Stats
router.get('/stats/summary', requireAuth, async (req, res) => {
  const byStatus = await Job.aggregate([
    { $match: { userId: new (await import('mongoose')).default.Types.ObjectId(req.user.id) } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  res.json({ ok: true, byStatus });
});

export default router;
