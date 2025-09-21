//Whenever you send a request to the server (like GET /cart), 
// Express passes it through a chain of middleware functions before sending back the response.

//JWT = JSON Web Token → a secure way to send information between client and server, No need to log in again for every request.
//It’s mostly used for authentication (login)
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) =>{

    //In Express, every incoming request has a headers object.
    //Headers are extra info sent along with HTTP requests.
    //we have token is inside the headers object like key-value pairs
    const {token}= req.headers; //object detsructing
    if(!token){
        return res.json({success: false,message:"Not Authorized Login Again"});
    }
    try{
        //jwt.verify checks if the token is valid

        const token_decode=jwt.verify(token, process.env.JWT_SECRET);
        
        req.userId=token_decode.id; //This adds a new field (userId) into the request body.
        //Because the frontend doesn’t need to send userId every time.
        //Instead, the backend extracts it from the token and injects it into req.body.
        //So when the actual route runs, it knows which user is making the request.
      
        next();

    }catch(error){
        console.log(error);
        res.json({success: false, message:"Error"});

    }
}


export default authMiddleware;