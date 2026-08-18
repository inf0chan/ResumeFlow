// Force Vercel to bundle model files that are loaded dynamically via fs.readdirSync
require('../backend/models/user');
require('../backend/models/document');
require('../backend/models/section');
require('../backend/models/item');
require('../backend/models/version');
require('../backend/models/application');
require('../backend/models/share');
require('../backend/models/template');
require('../backend/models/download');

// Force Vercel to bundle route files
require('../backend/routers/authRoutes');
require('../backend/routers/userRoutes');
require('../backend/routers/documentRoutes');
require('../backend/routers/sectionRoutes');
require('../backend/routers/itemRoutes');
require('../backend/routers/versionRoutes');
require('../backend/routers/applicationRoutes');
require('../backend/routers/shareRoutes');
require('../backend/routers/templateRoutes');
require('../backend/routers/exportRoutes');
require('../backend/routers/publicRoutes');

const app = require('../backend/app');

module.exports = app;
