const allowedOrigins = require("./allowed_origin_list")
const corsOPtion ={
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin)!= -1 || !origin){
      callback(null,true)
    }
    else{
      callback(new Error("Not allowed by cors"));
    }
  },
  optionsSuccessStatus: 200
}
module.exports = corsOPtion;