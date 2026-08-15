const express = require('express');
const router = express.Router();
const { item, section, document } = require('../models');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

async function assertOwnsSection(sectionId, userId) {
  const found = await section.findByPk(sectionId, { include: [{ model: document }] });
  return found && found.document && found.document.userId === userId ? found : null;
}

// GET /api/items/section/:sectionId — bullet items within a resume section
router.get('/section/:sectionId', async (req, res) => {
  if (!(await assertOwnsSection(req.params.sectionId, req.userId))) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }
  const items = await item.findAll({
    where: { sectionId: req.params.sectionId },
    order: [['position', 'ASC']],
  });
  res.json({ success: true, items });
});

router.post('/', async (req, res) => {
  const { content, position, sectionId } = req.body;
  if (!sectionId) return res.status(400).json({ success: false, message: 'sectionId is required' });
  if (!(await assertOwnsSection(sectionId, req.userId))) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }

  const created = await item.create({ content, position: position ?? 0, sectionId });
  res.status(201).json({ success: true, item: created });
});

router.patch('/:id', async (req, res) => {
  const found = await item.findByPk(req.params.id);
  if (!found || !(await assertOwnsSection(found.sectionId, req.userId))) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  const { content, position } = req.body;
  if (content !== undefined) found.content = content;
  if (position !== undefined) found.position = position;
  await found.save();

  res.json({ success: true, item: found });
});

router.delete('/:id', async (req, res) => {
  const found = await item.findByPk(req.params.id);
  if (!found || !(await assertOwnsSection(found.sectionId, req.userId))) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  await found.destroy();
  res.json({ success: true, message: 'Item deleted' });
});

module.exports = router;
