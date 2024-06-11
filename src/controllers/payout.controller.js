import { Payout } from "../models/payout.model.js";
import { Company } from "../models/company.model.js";

// @POST
//admin payouts to company

const createPayout = async (req, res) => {
  const { companyId, adminId } = req.params;
  const { amount, paymentMode, status, userId } = req.body;

  try {
    // sanitiasing inputs
    if (!companyId) {
      return res.status(401).json({ message: "Company Id missing" });
    }
    const isEmptyFields = [amount, paymentMode, status, userId].some(
      (field) => field === ""
    );
    if (isEmptyFields) {
      return res.status(401).json({ message: "All fields are required" });
    }
    // Check if the company is valid
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    //payout creation

    const payout = await Payout.create({
      adminId,
      userId,
      companyId,
      amount,
      paymentMode,
    });
    const createdPayout = await Payout.findOne({ _id: payout._id });
    if (!createdPayout) {
      return res.status(500).json({ message: "Payment is failed " });
    }

    return res.status(201).json({ message: "Payment is successful " });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message}` });
  }
};

export { createPayout };
