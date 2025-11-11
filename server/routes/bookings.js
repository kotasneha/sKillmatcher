import express from 'express';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { service_id, date, address } = req.body;
    const user_id = req.user.id;

    const service = await Service.findById(service_id).populate('worker_id');
    if (!service) return res.status(404).json({ error: 'Service not found' });
    const worker_id = service.worker_id?._id;
    if (!worker_id) return res.status(400).json({ error: 'Service has no assigned worker' });

    const exists = await Booking.findOne({ service_id, date });
    if (exists) return res.status(409).json({ error: 'This time slot is already booked' });

    const booking = await Booking.create({ user_id, worker_id, service_id, date, address, status: 'pending' });
    res.json(booking);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/my-orders', auth, async (req, res) => {
  const user_id = req.user.id;
  const orders = await Booking.find({ user_id, status: { $in: ['pending','accepted'] } })
    .populate('service_id worker_id');
  res.json(orders);
});

router.get('/my-history', auth, async (req, res) => {
  const user_id = req.user.id;
  const orders = await Booking.find({ user_id, status: { $in: ['completed','rejected','cancelled'] } })
    .populate('service_id worker_id');
  res.json(orders);
});

router.put('/:id/cancel', auth, async (req, res) => {
  const b = await Booking.findOne({ _id: req.params.id, user_id: req.user.id });
  if (!b) return res.status(404).json({ error: 'Not found' });
  if (!['pending','accepted'].includes(b.status)) return res.status(400).json({ error: 'Cannot cancel this order' });
  b.status = 'cancelled';
  await b.save();
  res.json(b);
});

router.get('/my-bookings', auth, async (req, res) => {
  const worker_id = req.user.id;
  const list = await Booking.find({ worker_id }).populate('service_id user_id');
  res.json(list);
});

router.put('/:id/status', auth, async (req, res) => {
  const b = await Booking.findOne({ _id: req.params.id, worker_id: req.user.id });
  if (!b) return res.status(404).json({ error: 'Not found' });
  b.status = req.body.status;
  await b.save();
  res.json(b);
});

export default router;
