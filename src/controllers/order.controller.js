import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js"
import { Service } from "../models/service.model.js";

// @POST
// order/create
// desc: Creating order with all level of access to the system

const createOrder = async (req, res) => {
    const { userId } = req.params;
    const { serviceIds, grandTotal, tax, paymentMode, status, isCancelled } = req.body;

    try {
        //check user is present or not 
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        //check services is present or not
        const services = await Service.find({ '_id': { $in: serviceIds } });

        // Validate that all service IDs were found
        if (services.length !== serviceIds.length) {
            return res.status(400).json({ message: "Services not found" });
        }


        const createdorder = await Order.create({
            userId, serviceIds, grandTotal, tax, paymentMode, status, isCancelled
        })
        return res.status(200).json({ message: "Order is created successfuly", order: createdorder })
    } catch (error) {
        return res.status(400).json({ message: `Internal Server due to ${error.message}` })
    }
}

export { createOrder }