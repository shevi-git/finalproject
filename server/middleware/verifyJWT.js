const jwt=require("jsonwebtoken");
const verifyJwt=(req,res,next)=>{
    try{
        const authHeader = req.headers.authorization || req.headers.Authorization  
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
        }  
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) 
        return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err)
            return res.status(403).json({ message: 'Forbidden' });
        req.user=decoded;
        next();
    });
    }
    catch (error) {
        console.error("Error in login function:", error);
        res.status(500).json({ message: "Server error" });
    }

}