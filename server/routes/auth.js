const express =require('express');
const {register, login} =require('../controllers/auth');
const authMiddleware =require('../middleware/authenticate');

const router =express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth",authMiddleware, (req, res) =>{
    const user =req.user;
   
    res.status(200).json({
        success: true,
        message: 'Authenticated user!',
        data:{
            user,
        } 
    })
})
module.exports =router;