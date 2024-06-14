import { Payout } from "../models/payout.model.js";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";

// @POST
//ADMIN PAYOUTS TO COMPANY

const adminToCompanyPayout = async (req, res) => {
  const { companyId, adminId } = req.params;
  const { amount, paymentMode, status } = req.body;

  try {
    // sanitiasing inputs
    if (!companyId || !adminId) {
      return res
        .status(401)
        .json({ message: "Company Id or admin Id missing" });
    }
    const isEmptyFields = [amount, paymentMode, status, adminId].some(
      (field) => field === ""
    );
    if (isEmptyFields) {
      return res.status(401).json({ message: "All fields are required" });
    }
    // Check if the company is valid
    const company = await Company.findOne({ _id: companyId });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    //payout creation

    const payout = await Payout.create({
      adminId,
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


//ADMIN PAYOUTS TO AFFILIATE MARKETER

const adminToAffiliatePayout = async (req, res) => {
  const { userId, adminId } = req.params;
  const { amount, paymentMode, status } = req.body;

  try {
    // sanitiasing inputs
    if (!userId || !adminId) {
      return res.status(401).json({ message: "user Id or admin Id missing" });
    }
    const isEmptyFields = [amount, paymentMode, status, adminId].some(
      (field) => field === ""
    );
    if (isEmptyFields) {
      return res.status(401).json({ message: "All fields are required" });
    }
    // Check if the user is valid
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    //payout creation

    const payout = await Payout.create({
      adminId,
      userId,
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

//DELETE A PAYOUT

const deletePayout = async (req, res) => {
  const { payoutId } = req.params;
  try {
    // Find the payout by ID
    const payout = await Payout.findOne({ _id: payoutId });
    if (!payout) {
      return res.status(404).json({ message: "Payout not found" });
    }
    // Delete the payout
    await Payout.deleteOne({ _id: payoutId });
    return res.status(200).json({ message: "Payout successfully deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message}` });
  }
};

//PATCH

const updatePayout = async (req, res) => {
  const { amount, paymentMode, status } = req.body;
  const { payoutId } = req.params;
  try {
    const payout = await Payout.findOne({ _id: payoutId });

    if (!payout) {
      return res.status(404).json({ message: "Payout id dosen't exist" });
    }
    payout.amount = amount;
    payout.paymentMode = paymentMode;
    payout.status = status;
    payout.adminId = payout.adminId;

    await payout.save();

    return res.status(200).json({
      message: "Payout details updated successfully",
      data: payout,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message}` });
  }
};

export {
  adminToCompanyPayout,
  adminToAffiliatePayout,
  deletePayout,
  updatePayout,
};
