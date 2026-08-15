const express = require('express');
const router = express.Router();
const { section, document } = require('../models');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

async function assertOwnsDocument(documentId, userId) {
  const doc = await document.findOne({ where: { id: documentId, userId } });
  return !!doc;
}

// GET /api/sections/document/:documentId — sections for the document editor, in order
router.get('/document/:documentId', async (req, res) => {
  if (!(await assertOwnsDocument(req.params.documentId, req.userId))) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }
  const sections = await section.findAll({
    where: { documentId: req.params.documentId },
    order: [['position', 'ASC']],
  });
  res.json({ success: true, sections });
});

router.post('/', async (req, res) => {
  const { heading, position, documentId } = req.body;
  if (!documentId) return res.status(400).json({ success: false, message: 'documentId is required' });
  if (!(await assertOwnsDocument(documentId, req.userId))) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  const created = await section.create({ heading, position: position ?? 0, documentId });
  res.status(201).json({ success: true, section: created });
});

router.patch('/:id', async (req, res) => {
  const found = await section.findByPk(req.params.id);
  if (!found || !(await assertOwnsDocument(found.documentId, req.userId))) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }

  const { heading, position } = req.body;
  if (heading !== undefined) found.heading = heading;
  if (position !== undefined) found.position = position;
  await found.save();

  res.json({ success: true, section: found });
});

router.delete('/:id', async (req, res) => {
  const found = await section.findByPk(req.params.id);
  if (!found || !(await assertOwnsDocument(found.documentId, req.userId))) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }
  await found.destroy();
  res.json({ success: true, message: 'Section deleted' });
});

module.exports = router;
