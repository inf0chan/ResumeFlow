const express = require('express');
const router = express.Router();
const { document, template, user } = require('../models');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// GET /api/documents?search=&type= — powers the /documents grid (search + type filter)
router.get('/', async (req, res) => {
  const { search, type } = req.query;
  const { Op } = require('sequelize');

  const where = { userId: req.userId };
  if (type && type !== 'all') where.type = type;
  if (search) where.title = { [Op.like]: `%${search}%` };

  const docs = await document.findAll({
    where,
    include: [{ model: template, attributes: ['id', 'name'] }],
    order: [['updatedAt', 'DESC']],
  });
  res.json({ success: true, documents: docs });
});

// GET /api/documents/recent?limit=3 — powers the dashboard "Recent documents" panel
router.get('/recent', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 3, 20);
  const docs = await document.findAll({
    where: { userId: req.userId },
    include: [{ model: template, attributes: ['id', 'name'] }],
    order: [['updatedAt', 'DESC']],
    limit,
  });
  res.json({ success: true, documents: docs });
});

router.get('/:id', async (req, res) => {
  const found = await document.findOne({
    where: { id: req.params.id, userId: req.userId },
    include: [{ model: template }],
  });
  if (!found) return res.status(404).json({ success: false, message: 'Document not found' });
  res.json({ success: true, document: found });
});

// POST /api/documents — "New document" / "Use this template"
router.post('/', async (req, res) => {
  const { title, type, templateId, authorName, authorEmail } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'title is required' });

  const profile = await user.findByPk(req.userId);
  const created = await document.create({
    title,
    type: type || 'resume',
    templateId: templateId || null,
    userId: req.userId,
    authorName: authorName || (profile ? profile.name : null),
    authorEmail: authorEmail || (profile ? profile.email : null),
  });
  res.status(201).json({ success: true, document: created });
});

router.patch('/:id', async (req, res) => {
  const found = await document.findOne({ where: { id: req.params.id, userId: req.userId } });
  if (!found) return res.status(404).json({ success: false, message: 'Document not found' });

  const { title, type, templateId, authorName, authorEmail } = req.body;
  if (title !== undefined) found.title = title;
  if (type !== undefined) found.type = type;
  if (templateId !== undefined) found.templateId = templateId;
  if (authorName !== undefined) found.authorName = authorName;
  if (authorEmail !== undefined) found.authorEmail = authorEmail;
  await found.save();

  res.json({ success: true, document: found });
});

// POST /api/documents/:id/duplicate — kebab menu "Duplicate"
router.post('/:id/duplicate', async (req, res) => {
  const found = await document.findOne({ where: { id: req.params.id, userId: req.userId } });
  if (!found) return res.status(404).json({ success: false, message: 'Document not found' });

  const copy = await document.create({
    title: `${found.title} (copy)`,
    type: found.type,
    templateId: found.templateId,
    userId: req.userId,
    authorName: found.authorName,
    authorEmail: found.authorEmail,
  });
  res.status(201).json({ success: true, document: copy });
});

// DELETE /api/documents/:id — kebab menu "Delete"
router.delete('/:id', async (req, res) => {
  const found = await document.findOne({ where: { id: req.params.id, userId: req.userId } });
  if (!found) return res.status(404).json({ success: false, message: 'Document not found' });
  await found.destroy();
  res.json({ success: true, message: 'Document deleted' });
});

module.exports = router;
