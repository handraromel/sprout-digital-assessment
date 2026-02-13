import { InvoiceController } from "@/controllers";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/", authMiddleware, InvoiceController.getAllInvoices);
router.get("/summary", authMiddleware, InvoiceController.getSummary);
router.get("/customers", authMiddleware, InvoiceController.getCustomers);
router.get(
  "/unpaid/:customerName",
  authMiddleware,
  InvoiceController.getUnpaidByCustomer,
);
router.get("/:id", authMiddleware, InvoiceController.getInvoiceById);
router.post("/", authMiddleware, InvoiceController.createInvoice);

export default router;
