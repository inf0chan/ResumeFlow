const express = require('express');
const router = express.Router();
const { share, document, section, item, template } = require('../models');

// GET /api/public/r/:slug — the public share view (/r/<slug> in the frontend), no auth required
router.get('/r/:slug', async (req, res) => {
  const found = await share.findOne({
    where: { slug: req.params.slug },
    include: [{
      model: document,
      include: [
        { model: template },
        { model: section, include: [{ model: item }] },
      ],
    }],
  });

  if (!found) return res.status(404).json({ success: false, message: 'This link is invalid or has been revoked' });

  res.json({ success: true, document: found.document });
});

module.exports = router;
