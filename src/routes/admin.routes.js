import { Router } from "express";
import { assignclasssubjectteacher, assignclassteacher, createacademicyear, createclass, createsection, createsubject, deleteacademicyear, getacademicyear, getsubject, schooladminlogin, updateacademicyear, updatesubject } from "../controllers/admin.controller";
import { verifyjwt } from "../middleware/auth.middleware";

const adminrouter = Router()


//post api
adminrouter.route("/login").post(schooladminlogin)
adminrouter.route("/createacademicyear").post(verifyjwt,createacademicyear)
adminrouter.route("/createclass").post(verifyjwt,createclass)
adminrouter.route("/createsection").post(verifyjwt,createsection)
adminrouter.route("/createsubject").post(verifyjwt,createsubject)
adminrouter.route("/assignclassteacher").post(verifyjwt,assignclassteacher)
adminrouter.route("/assignsubteacher").post(verifyjwt,assignclasssubjectteacher)


//get api
adminrouter.route("/getacademicyear").get(verifyjwt,getacademicyear)
adminrouter.route("/getclass").get(verifyjwt,getacademicyear)
adminrouter.route("/getsection").get(verifyjwt,getacademicyear)
adminrouter.route("/getsubject").get(verifyjwt,getsubject)

//update api
adminrouter.route("/updateacademicyear/:id").post(verifyjwt,updateacademicyear)
adminrouter.route("/updateclass/:id").post(verifyjwt,updateacademicyear)
adminrouter.route("/updatesection/:id").post(verifyjwt,updateacademicyear)
adminrouter.route("/updatesubject/:id").post(verifyjwt,updatesubject)

//delete api
adminrouter.route("/deleteacademicyear/:id").post(verifyjwt,deleteacademicyear)
adminrouter.route("/deleteclass/:id").post(verifyjwt,deleteclass)
adminrouter.route("/deletesection/:id").post(verifyjwt,deletesection)