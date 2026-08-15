const express = require('express');
const router = express.Router();
const { application, document } = require('../models');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

const VALID_STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected'];

// GET /api/applications — powers both the /applications board and table views
router.get('/', async (req, res) => {
  const apps = await application.findAll({
    where: { userId: req.userId },
    include: [{ model: document, attributes: ['id', 'title'] }],
    order: [['updatedAt', 'DESC']],
  });
  res.json({ success: true, applications: apps });
});

// GET /api/applications/pipeline — counts per status for the dashboard pipeline bars
router.get('/pipeline', async (req, res) => {
  const apps = await application.findAll({ where: { userId: req.userId }, attributes: ['status'] });
  const counts = Object.fromEntries(VALID_STATUSES.map(s => [s, 0]));
  apps.forEach(a => {
    if (counts[a.status] !== undefined) counts[a.status] += 1;
  });
  res.json({ success: true, pipeline: counts, total: apps.length });
});

// POST /api/applications — "Track application" / "Track an application"
router.post('/', async (req, res) => {
  const { company, role, status, documentId } = req.body;
  if (!company || !role) {
    return res.status(400).json({ success: false, message: 'company and role are required' });
  }
  const initialStatus = VALID_STATUSES.includes(status) ? status : 'saved';

  const created = await application.create({
    company,
    role,
    status: initialStatus,
    documentId: documentId || null,
    userId: req.userId,
  });
  res.status(201).json({ success: true, application: created });
});

// PATCH /api/applications/:id — drag-and-drop between board columns updates status
router.patch('/:id', async (req, res) => {
  const found = await application.findOne({ where: { id: req.params.id, userId: req.userId } });
  if (!found) return res.status(404).json({ success: false, message: 'Application not found' });

  const { company, role, status, documentId } = req.body;
  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `status must be one of ${VALID_STATUSES.join(', ')}` });
    }
    found.status = status;
  }
  if (company !== undefined) found.company = company;
  if (role !== undefined) found.role = role;
  if (documentId !== undefined) found.documentId = documentId;
  await found.save();

  res.json({ success: true, application: found });
});

router.delete('/:id', async (req, res) => {
  const found = await application.findOne({ where: { id: req.params.id, userId: req.userId } });
  if (!found) return res.status(404).json({ success: false, message: 'Application not found' });
  await found.destroy();
  res.json({ success: true, message: 'Application deleted' });
});

module.exports = router;
