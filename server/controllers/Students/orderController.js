const paypal =require('../../helper/paypal');
const Order =require('../../models/Order');
const Course =require('../../models/Course');
const StudentCourse =require('../../models/StudentCourse');

const createOrder =async(req, res) =>{
    try {
        const {
            userId,
            userName,
            userEmail,
            orderStatus,
            paymentMethod,
            paymentStatus,
            orderDate,
            paymentId,
            payerId,
            instructorId,
            instructorName,
            courseImage,
            courseTitle,
            courseId,
            coursePricing,
        } =req.body;

        const create_payment_json ={
            intent:"sale",
            payer: {
                payment_method: "paypal",
            },
            redirect_urls: {
                return_url: `${process.env.CLIENT_URL}/payment-return`,
                cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name:courseTitle,
                                sku: courseId,
                                price: coursePricing,
                                currency: "USD",
                                quantity: 1,
                            },
                        ],
                    },
                    amount: {
                        currency: "USD",
                        total: coursePricing.toFixed(2),
                    },
                    description: courseTitle,
            }]
        };

        paypal.payment.create(create_payment_json, async(error, paymentInfo) =>{
            // console.log(create_payment_json, 'mmn')
            if(error){
                console.log(error);
                res.status(500).json({
                    success: false,
                    message: "Error if creating a paypal payment",
                });
            }else{
                const order = new Order({
                    userId,
                    userName,
                    userEmail,
                    orderStatus,
                    paymentMethod,
                    paymentStatus,
                    orderDate,
                    paymentId,
                    payerId,
                    instructorId,
                    instructorName,
                    courseImage,
                    courseTitle,
                    courseId,
                    coursePricing,
                });
                await order.save();

                const approveUrl =paymentInfo.links.find((link) =>link.rel == "approval_url").href;

                res.status(200).json({
                    success: true,
                    message: "Payment created successfully",
                    data: {
                        approveUrl,
                        orderId: order._id,
                    },
                });
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};

const paymentAndFinalizeOrder =async(req, res) =>{
    try {
        const {paymentId, payerId, orderId} =req.body;
        let order =await Order.findById(orderId);

        if(!order){
            return res.status(404).json({
                success: false,
                message: "Order not found",
            })
        }
        order.paymentStatus ="paid",
        order.orderStatus ="confirmed",
        order.paymentId = paymentId,
        order.payerId = payerId,

        await order.save();

        //update student course model
        const studentCourse =await StudentCourse.findOne({
            userId: order.userId,
        });

        if(studentCourse){
            studentCourse.courses.push({
                courseId: order.courseId,
                title: order.courseTitle,
                instructorId: order.instructorId,
                instructorName: order.instructorName,
                dateOfPurchase: order.orderDate,
                courseImage: order.courseImage,
            });
            await studentCourse.save();
        }else{
            const newStudentCourse = new StudentCourse({
                userId: order.userId,
                courses: [
                    {
                        courseId: order.courseId,
                        title: order.courseTitle,
                        instructorId: order.instructorId,
                        instructorName: order.instructorName,
                        dateOfPurchase: order.orderDate,
                        courseImage: order.courseImage,
                    },
                ],
            });            
            await newStudentCourse.save();
        }

        await Course.findByIdAndUpdate(order.courseId, {
            $addToSet :{
                students: {
                    studentId: order.userId,
                    studentName: order.userName,
                    studentEmail: order.userEmail,
                    paidAmount: order.coursePricing,
                }
            }
        });
        res.status(200).json({
            success: true,
            message: "order confirmed",
            data: order
        });        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};
module.exports ={ createOrder, paymentAndFinalizeOrder };