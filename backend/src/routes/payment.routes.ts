import { Router } from "express";
import { createPaymentUrl, vnpayReturn, vnpayIPN } from "../controllers/payment.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/create-url", auth, createPaymentUrl);
router.get("/vnpay-return", vnpayReturn);
router.get("/vnpay-ipn", vnpayIPN);

export default router;
