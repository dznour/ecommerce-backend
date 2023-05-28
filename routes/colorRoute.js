const express = require('express');
const { getColors, getColor, createColor, updateColor, deleteColor } = require('../controller/colorController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getColors);
router.get('/:id', getColor);
router.post('/', authMiddleware, isAdmin, createColor)
router.put('/:id', authMiddleware, isAdmin, updateColor)
router.delete('/:id', authMiddleware, isAdmin, deleteColor)
module.exports = router;