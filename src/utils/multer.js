import multer from 'multer';

export const fileTypes ={
    image:['image/png', 'image/gif','image/jpeg','image/webp','image/svg'],
    pdf:['application/pdf']
}

const uploadFile = (customeType =[])=>{
    const storage = multer.diskStorage({});

    function fileFilter(req,file,cb){
        if(customeType.includes(file.mimeType)){
            cb(null,file);
        }else{
            cb("invalid format",false);
        }
    }
      
     const upload = multer({fileFilter,storage })
     return upload;
}

export default uploadFile;