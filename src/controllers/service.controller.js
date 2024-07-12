import { Service } from "../models/service.model.js";
import { Company } from "../models/company.model.js";

// @POST
// service/create
// desc: Creating service with all level of access to the system
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
    ].some((field) => field === "" || field === undefined);
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

// @DELETE
// service detials/delete
// desc: Service detials delete api of service
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

// @PATCH
// service/detials
// desc: Service detials api for serive
const upadateServiceDetials = async (req, res) => {
  const { title, description, duration, price, discount, category, tags } =
    req.body;
  const { serviceId } = req.params;
  try {
    const service = await Service.findOne({ _id: serviceId });
    if (!service) {
      return res.status(404).json({ message: "Service doesn't exist" });
    }
    service.title = title;
    service.description = description;
    service.duration = duration;
    service.price = price;
    service.discount = discount;
    service.category = category;
    service.tags = tags;

    await service.save();

    return res.status(200).json({
      message: "Service detials updated successfully",
      data: service,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message} ` });
  }
};

// @GET
// service/customers
// desc: Paginated api for getting all users with role customer
const getAllServices = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // skip logic
  const skip = (pageNumber - 1) * limitNumber;

  try {
    //pagination logic
    const totalServices = await Service.countDocuments();
    const totalPages = Math.ceil(totalServices / limitNumber);
    const hasNextPage = pageNumber < totalPages;

    // Find services with pagination
    const services = await Service.find()
      .select("title description duration price discount category tags mode")
      .skip(skip)
      .limit(limitNumber);

    // Check if services were found
    if (services.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }

    // Respond with services data and pagination info
    return res.status(200).json({
      message: "Service data found",
      data: { services, hasNextPage, total: totalServices, currentPage: pageNumber },
    });
  } catch (err) {
    // Handle any errors
    return res
      .status(500)
      .json({ message: `Internal server error due to: ${err.message}` });
  }
};

export { postService, deleteService, upadateServiceDetials, getAllServices };
