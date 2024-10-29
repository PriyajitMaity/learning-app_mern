const express =require('express');
const router =express.Router();

const { createOrder, paymentAndFinalizeOrder } =require("../../controllers/Students/orderController");

router.post('/create', createOrder);
router.post('/capture', paymentAndFinalizeOrder);

module.exports = router;