import { PaymentController } from "@/controllers";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/", authMiddleware, PaymentController.getAllPayments);
router.get("/:id", authMiddleware, PaymentController.getPaymentById);
router.post("/", authMiddleware, PaymentController.createPayment);

export default router;
