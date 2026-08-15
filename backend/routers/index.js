const express = require('express');
const router = express.Router();

router.use("/auth", require('./authRoutes'));
router.use("/users", require('./userRoutes'));
router.use("/templates", require('./templateRoutes'));
router.use("/documents", require('./documentRoutes'));
router.use("/sections", require('./sectionRoutes'));
router.use("/items", require('./itemRoutes'));
router.use("/versions", require('./versionRoutes'));
router.use("/exports", require('./exportRoutes'));
router.use("/applications", require('./applicationRoutes'));
router.use("/shares", require('./shareRoutes'));
router.use("/public", require('./publicRoutes'));


module.exports = router;