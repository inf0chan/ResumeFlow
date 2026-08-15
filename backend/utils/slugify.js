const crypto = require('crypto');

/** Turns "Senior Frontend Engineer — 2026" into "senior-frontend-engineer-2026-9x2kq1" */
function slugify(title) {
  const base = (title || 'document')
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  const suffix = crypto.randomBytes(4).toString('hex').slice(0, 6);
  return `${base || 'document'}-${suffix}`;
}

module.exports = { slugify };
