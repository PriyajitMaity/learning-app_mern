const mongoose =require("mongoose");
const { Schema, model } =require("mongoose");

const Order =new mongoose.Schema({
    userId: String,
    userName: String,
    userEmail: String,
    orderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    orderDate: Date,
    paymentId: String,
    payerId: String,
    instructorId: String,
    instructorName: String,
    courseImage: String,
    courseTitle: String,
    courseId: String,
    coursePricing: String,
})
module.exports =mongoose.model("Order", Order);