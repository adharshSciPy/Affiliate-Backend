import { Service } from "../models/service.model.js";
import { Company } from "../models/company.model.js";

const postService = async (req, res) => {
  const { companyId } = req.params;
  const {
    title,
    description,
    duration,
    price,
    discount,
    category,
    tags,
    mode,
  } = req.body;
  try {
    // sanitiasing inputs
    if (!companyId) {
      return res.status(401).json({ message: "Company Id missing" });
    }
    const isEmptyFields = [
      title,
      description,
      duration,
      price,
      discount,
      category,
      tags,
      mode,
    ].some((field) => field === "");
    if (isEmptyFields) {
      return res.status(401).json({ message: "All fields are required" });
    }

    // Check if the company is valid
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    const service = await Service.create({
      title,
      description,
      duration,
      price,
      discount,
      category,
      tags,
      mode,
      companyId,
    });
    const createdService = await Service.findOne({ _id: service._id });
    if (!createdService) {
      return res.status(500).json({ message: "Service registration failed" });
    }
    return res.status(201).json({ message: "Service Registration Successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message}` });
  }
};

//delete a service controller

const deleteService = async (req, res) => {
  const { serviceId } = req.params;
  //find serviceId

  try {
    const isServiceExist = await Service.findOne({ _id: serviceId });

    if (!isServiceExist) {
      return res.status(404).json({ message: "Service doesn't exist" });
    }

    //delete serviceId
    const service = await Service.deleteOne({ _id: serviceId });
    if (!service) {
      return res.status(404).json({ message: "Service not fount" });
    }
    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message}` });
  }
};

export { postService, deleteService };
