import { Router } from "express";
import { createacademicyear, createclass, createsection, deleteacademicyear, getacademicyear, schooladminlogin, updateacademicyear } from "../controllers/admin.controller";
import { verifyjwt } from "../middleware/auth.middleware";

const adminrouter = Router()


//post api
adminrouter.route("/login").post(schooladminlogin)
adminrouter.route("/createacademicyear").post(verifyjwt,createacademicyear)
adminrouter.route("/createclass").post(verifyjwt,createclass)
adminrouter.route("/createsection").post(verifyjwt,createsection)


//get api
adminrouter.route("/getacademicyear").get(verifyjwt,getacademicyear)
adminrouter.route("/getclass").get(verifyjwt,getacademicyear)
adminrouter.route("/getsection").get(verifyjwt,getacademicyear)

//update api
adminrouter.route("/updateacademicyear/:id").post(verifyjwt,updateacademicyear)
adminrouter.route("/updateclass/:id").post(verifyjwt,updateacademicyear)
adminrouter.route("/updatesection/:id").post(verifyjwt,updateacademicyear)

//delete api
adminrouter.route("/deleteacademicyear").post(verifyjwt,deleteacademicyear)
adminrouter.route("/deleteacademicyear").post(verifyjwt,deleteacademicyear)
adminrouter.route("/deleteacademicyear").post(verifyjwt,deleteacademicyear)