const express = require('express');
const router = express.Router();
const { version, document } = require('../models');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

async function assertOwnsDocument(documentId, userId) {
  const doc = await document.findOne({ where: { id: documentId, userId } });
  return !!doc;
}

// GET /api/versions/document/:documentId — "Saved versions" for one document
router.get('/document/:documentId', async (req, res) => {
  if (!(await assertOwnsDocument(req.params.documentId, req.userId))) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }
  const versions = await version.findAll({
    where: { documentId: req.params.documentId },
    order: [['createdAt', 'DESC']],
  });
  res.json({ success: true, versions });
});

// GET /api/versions/count — feeds the dashboard "Saved versions" counter
router.get('/count', async (req, res) => {
  const docs = await document.findAll({ where: { userId: req.userId }, attributes: ['id'] });
  const count = await version.count({ where: { documentId: docs.map(d => d.id) } });
  res.json({ success: true, count });
});

// POST /api/versions — "Save version" action from the editor
router.post('/', async (req, res) => {
  const { label, snapshot, documentId } = req.body;
  if (!documentId) return res.status(400).json({ success: false, message: 'documentId is required' });
  if (!(await assertOwnsDocument(documentId, req.userId))) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  const created = await version.create({
    label: label || new Date().toLocaleString(),
    snapshot: typeof snapshot === 'string' ? snapshot : JSON.stringify(snapshot || {}),
    documentId,
  });
  res.status(201).json({ success: true, version: created });
});

router.delete('/:id', async (req, res) => {
  const found = await version.findByPk(req.params.id);
  if (!found || !(await assertOwnsDocument(found.documentId, req.userId))) {
    return res.status(404).json({ success: false, message: 'Version not found' });
  }
  await found.destroy();
  res.json({ success: true, message: 'Version deleted' });
});

module.exports = router;
