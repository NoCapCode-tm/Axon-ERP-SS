import { Router } from "express";
import { addfeatures, addplan, addSchool, addticket, deletefeature, deleteplan, deleteschool, deleteticket, getallusers, getschools, getsingleschool, gettickets, updateplan, updateschool, updateticket } from "../controllers/superadmin.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const superadminrouter = Router()


//post api
superadminrouter.route("/addschool").post(upload.single("logo"),addSchool)
superadminrouter.route("/addfeatures").post(addfeatures)
superadminrouter.route("/addplan").post(addplan)
superadminrouter.route("/createticket").post(addticket)



//get apis
superadminrouter.route("/getschools").get(getschools)
superadminrouter.route("/gettickets").get(gettickets)
superadminrouter.route("/getsingleschool/:id").get(getsingleschool)
superadminrouter.route("/getallusers").get(getallusers)


//patch api
superadminrouter.route("/updateschool").patch(upload.single("logo"),updateschool)
superadminrouter.route("/updateplan").patch(updateplan)
superadminrouter.route("/updateticket").patch(updateticket)
//delete api
superadminrouter.route("/deleteschool/:id").delete(deleteschool)
superadminrouter.route("/deleteplan/:id").delete(deleteplan)
superadminrouter.route("/deletefeature/:id").delete(deletefeature)
superadminrouter.route("/deleteticket/:id").delete(deleteticket)

export {superadminrouter}