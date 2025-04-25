const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const user=require("../Moduls/UserSchema");
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
const JWTCheckFamily = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "your-secret-key");

    const user = await User.findById(decoded.userId); // צריך await!

    if (!user) return res.status(404).json({ message: "User not found" });

    const enteredPassword = req.body.password;

    const isMatch = await bcrypt.compare(enteredPassword, user.password); // גם כאן צריך await!

    if (isMatch) {
      return next();
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports={verifyJwt,JWTCheckFamily};