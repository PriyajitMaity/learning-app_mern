const express =require("express");
const multer =require("multer");
const { uploadMediaToCloudinary,deleteMediaToCloudinary } =require('../../helper/cloudinary');

const router =express.Router();
const upload =multer({dest: "/uploads"});
router.post('/upload', upload.single("file"), async(req, res) =>{
    try{
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const result =await uploadMediaToCloudinary(req.file.path);
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: result
        })
    }catch(err){
        console.log(err, 'upload error');
        res.status(500).json({
            success: false,
            message: 'Error to upload file'
        })
    }
})

router.post('/bulk-upload', upload.array('file', 10), async(req, res) =>{
    try{

        const uploadPromises =req.files.map((fileItems) =>uploadMediaToCloudinary(fileItems.path))
        const results =await Promise.all(uploadPromises);
        
        res.status(200).json({
            success: true,
            message: 'Bulk Files uploaded successfully',
            data: results,
        })
    }catch(event){
        console.log(event, 'bulk upload error');
        res.status(500).json({
            success: false,
            message: 'Error in bulk uploading files'
        })
    }
})

router.delete('/delete/:id', async(req, res) =>{
    try {
        const id =req.params.id;

        if(!id) return res.status(400).json({message: 'No id provided'});

        await deleteMediaToCloudinary(id);
        res.status(200).json({
            success: true,
            message: 'Assest deleted successfully'
        })
    } catch(err){
        console.log(err, 'upload error');
        res.status(500).json({
            success: false,
            message: 'Error deleting file'
        })
    }
})

module.exports = router;