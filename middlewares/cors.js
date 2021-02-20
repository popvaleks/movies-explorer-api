const router = require('express').Router();
const cors = require('cors');

const { corsSettings } = require('../config');

router.use(cors(corsSettings));

module.exports = router;
