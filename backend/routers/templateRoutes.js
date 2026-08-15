const express = require('express');
const router = express.Router();
const { template } = require('../models');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// GET /api/templates — powers the /templates gallery
router.get('/', async (req, res) => {
  const all = await template.findAll({ order: [['createdAt', 'ASC']] });
  res.json({ success: true, templates: all });
});

router.get('/:id', async (req, res) => {
  const found = await template.findByPk(req.params.id);
  if (!found) return res.status(404).json({ success: false, message: 'Template not found' });
  res.json({ success: true, template: found });
});

// POST /api/templates — the "New template" dialog (name, accent, font, layout, density -> config)
router.post('/', async (req, res) => {
  const { name, config } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'name is required' });

  const created = await template.create({
    name,
    config: typeof config === 'string' ? config : JSON.stringify(config || {}),
  });
  res.status(201).json({ success: true, template: created });
});

router.patch('/:id', async (req, res) => {
  const found = await template.findByPk(req.params.id);
  if (!found) return res.status(404).json({ success: false, message: 'Template not found' });

  const { name, config } = req.body;
  if (name !== undefined) found.name = name;
  if (config !== undefined) found.config = typeof config === 'string' ? config : JSON.stringify(config);
  await found.save();

  res.json({ success: true, template: found });
});

router.delete('/:id', async (req, res) => {
  const found = await template.findByPk(req.params.id);
  if (!found) return res.status(404).json({ success: false, message: 'Template not found' });
  await found.destroy();
  res.json({ success: true, message: 'Template deleted' });
});

module.exports = router;
