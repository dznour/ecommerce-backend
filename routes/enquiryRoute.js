const express = require('express');
const router = express.Router();
const { getEnquiries, getEnquiry, createEnquiry, updateEnquiry, deleteEnquiry } = require('../controller/enquiryController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, isAdmin, getEnquiries)
router.get('/:id', authMiddleware, isAdmin, getEnquiry)
router.post('/', createEnquiry)
router.put('/:id', authMiddleware, isAdmin, updateEnquiry)
router.delete('/:id', authMiddleware, isAdmin, deleteEnquiry)
module.exports = router;