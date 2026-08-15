const express = require('express');
const router = express.Router();
const { share, document } = require('../models');
const { requireAuth } = require('../middleware/auth');
const { slugify } = require('../utils/slugify');

router.use(requireAuth);

// GET /api/shares — powers the /shares flat list
router.get('/', async (req, res) => {
  const shares = await share.findAll({
    include: [{
      model: document,
      attributes: ['id', 'title', 'userId'],
      where: { userId: req.userId },
    }],
    order: [['createdAt', 'DESC']],
  });
  res.json({ success: true, shares });
});

// POST /api/shares — created from inside a document ("Share" action)
router.post('/', async (req, res) => {
  const { documentId } = req.body;
  if (!documentId) return res.status(400).json({ success: false, message: 'documentId is required' });

  const doc = await document.findOne({ where: { id: documentId, userId: req.userId } });
  if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

  const created = await share.create({ documentId, slug: slugify(doc.title) });
  res.status(201).json({ success: true, share: created });
});

// DELETE /api/shares/:id — the "Revoke" row action
router.delete('/:id', async (req, res) => {
  const found = await share.findOne({
    where: { id: req.params.id },
    include: [{ model: document, where: { userId: req.userId } }],
  });
  if (!found) return res.status(404).json({ success: false, message: 'Share link not found' });
  await found.destroy();
  res.json({ success: true, message: 'Share link revoked' });
});

module.exports = router;
