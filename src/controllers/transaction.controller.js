import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";

// @POST
// transaction/transactions
// desc: Creating transaction with all level of access to the system
const postTransaction = async (req, res) => {
  const { userId, orderId } = req.params;
  const { transactionId, grandTotal, tax, paymentMode, status } = req.body;
  try {
    // sanitiasing inputs

    if (!userId || !orderId) {
      return res
        .status(401)
        .json({ message: "User Id or Order Id is missing" });
    }
    const isEmptyFields = [transactionId, grandTotal, tax, paymentMode, status].some(
        (field) => field === "" || field === undefined
      );
      if (isEmptyFields) {
        return res.status(401).json({ message: "All fields are required" });
      }

    // Check if the user is valid
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the order is valid
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    //transaction creation

    const transaction = await Transaction.create({
      transactionId, userId, orderId, grandTotal, tax, paymentMode, status
    });
    const createdTransaction = await Transaction.findOne({ _id: transaction._id });
    if (!createdTransaction) {
      return res.status(500).json({ message: "Transaction is failed " });
    }

    return res.status(201).json({ message: "Transaction is successful " });


  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message}` });
  }

}

export { postTransaction }