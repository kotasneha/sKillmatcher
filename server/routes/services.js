import express from 'express';
import Service from '../models/Service.js';
import auth from '../middleware/auth.js';
const router = express.Router();

// Get all services (with worker info)
router.get('/all', async (req,res)=>{
  const services = await Service.find().populate('worker_id', 'name email');
  res.json(services);
});

// Worker creates service (assign worker_id)
router.post('/', auth, async (req,res)=>{
  if(req.user.role !== 'worker')
    return res.status(403).json({ error: "Only workers can add services" });

  const newService = await Service.create({
    ...req.body,
    worker_id: req.user.id
  });

  res.json(newService);
});

export default router;
