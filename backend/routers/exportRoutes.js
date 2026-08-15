const express = require('express');
const router = express.Router();
const { export: exportModel, document } = require('../models');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// GET /api/exports — powers the /exports list
router.get('/', async (req, res) => {
  const exports = await exportModel.findAll({
    where: { userId: req.userId },
    include: [{ model: document, attributes: ['id', 'title'] }],
    order: [['createdAt', 'DESC']],
  });
  res.json({ success: true, exports });
});

// GET /api/exports/count — feeds the dashboard "Exports" counter
router.get('/count', async (req, res) => {
  const count = await exportModel.count({ where: { userId: req.userId } });
  res.json({ success: true, count });
});

// POST /api/exports — recorded whenever a document is exported to PDF
router.post('/', async (req, res) => {
  const { format, fileUrl, documentId } = req.body;
  if (!documentId || !fileUrl) {
    return res.status(400).json({ success: false, message: 'documentId and fileUrl are required' });
  }

  const doc = await document.findOne({ where: { id: documentId, userId: req.userId } });
  if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

  const created = await exportModel.create({
    format: format || 'pdf',
    fileUrl,
    documentId,
    userId: req.userId,
  });
  res.status(201).json({ success: true, export: created });
});

router.delete('/:id', async (req, res) => {
  const found = await exportModel.findOne({ where: { id: req.params.id, userId: req.userId } });
  if (!found) return res.status(404).json({ success: false, message: 'Export not found' });
  await found.destroy();
  res.json({ success: true, message: 'Export deleted' });
});

module.exports = router;
