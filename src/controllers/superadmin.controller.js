import { useSyncExternalStore } from "react";
import { pool } from "../database/dbconnect.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { asynchandler } from "../utils/Asynchandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";
import bcrypt from "bcrypt"

export const addSchool = asynchandler(async (req, res) => {
    const {
        name,
        branchname,
        email,
        address,
        admin_name,
        admin_email,
        school_plan,
        school_password,
        website_link,
        phone,
        status
    } = req.body;

    // Validation
    if (!name || !email) {
        throw new Apierror(400, "Please fill all required fields");
    }

    // Check if school already exists
    const exist = await pool.query(
        `SELECT * FROM SCHOOL WHERE name = $1 AND email = $2`,
        [name, email]
    );

    if (exist.rows.length > 0) {
        throw new Apierror(400, "School already exists");
    }

    let logoUrl = null;

    // Upload logo if provided
   if (req.file) {
    const uploadedLogo = await uploadToCloudinary(
        req.file.buffer,
        "School/logo",
        `${name}-${branchname}/logo`
    );

    logoUrl = uploadedLogo.secure_url;
}
    console.log(logoUrl)

    const hashpass = await bcrypt.hash(school_password,10)

    // Insert school
    const insertedSchool = await pool.query(
        `
        INSERT INTO SCHOOL
        (
            name,
            branchname,
            email,
            address,
            admin_name,
            admin_email,
            school_plan,
            school_password,
            logo,
            website_link,
            phone,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
        )
        RETURNING *
        `,
        [
            name,
            branchname,
            email,
            address,
            admin_name,
            admin_email,
            school_plan,
            hashpass,
            logoUrl,
            website_link,
            phone,
            status
        ]
    );

    const school_code =
    `AXN/SCH-${String(insertedSchool.rows[0].school_id).padStart(6, "0")}`;


const updatedSchool = await pool.query(
    `
    UPDATE SCHOOL
    SET school_code = $1
    WHERE school_id = $2
    RETURNING *
    `,
    [school_code, insertedSchool.rows[0].school_id]
);


    res.status(201).json(
        new Apiresponse(
            201,
            "School added successfully",
            updatedSchool.rows[0]
        )
    );
});

export const getschools = asynchandler(async(req,res)=>{

    const school = await pool.query(`SELECT * FROM SCHOOL`)

    if(school.rows.length <1){
        throw new Apierror(404,"No School found in the database")
    }

    res.status(200)
    .json(new Apiresponse(200,"All School Fetched Successfully",school.rows))
})

export const getsingleschool = asynchandler(async(req,res)=>{
    const {id} = req.params

    if(!id){
        throw new Apierror(404,"Id not found")
    }

    const existing = await pool.query(`SELECT * FROM SCHOOL WHERE school_id = $1`,[id])
    if(existing.rows.length <1){
        throw new Apierror(404,"No School Found")
    }

    res.status(200)
    .json(new Apiresponse(200,"School fetched Successfully",existing.rows[0]))
})

export const deleteschool = asynchandler(async(req,res)=>{
    const {id} = req.params

    if(!id){
        throw new Apierror(404,"Id not found")
    }
   
     const existing = await pool.query(`SELECT * FROM SCHOOL WHERE school_id = $1`,[id])
    if(existing.rows.length <1){
        throw new Apierror(404,"No School Found")
    }

    await pool.query(`UPDATE SCHOOL SET isDeleted = TRUE WHERE school_id = $1`,[id])

    
    res.status(200)
    .json(new Apiresponse(200,"School deleted Successfully",[]))

})

export const updateschool = asynchandler(async(req,res)=>{
    const {id} = req.params
    const {
        name,
        branchname,
        email,
        address,
        admin_name,
        admin_email,
        school_plan,
        school_password,
        website_link,
        phone,
        status
    } = req.body;
     
    if(!id){
        throw new Apierror(400,"Please fill all the required fields")
    }

    const existing = await pool.query(`SELECT * FROM SCHOOL WHERE school_id = $1`,[id])

    if(existing.rows.length <1){
        throw new Apierror(404,"Schoool not Found ")
    }

  if(name !== undefined) await pool.query(`UPDATE SCHOOL SET name = $1 WHERE school_id = $2`,[name,id])
  if(branchname !== undefined) await pool.query(`UPDATE SCHOOL SET branchname = $1 WHERE school_id = $2`,[branchname,id])
  if(email!== undefined) await pool.query(`UPDATE SCHOOL SET email = $1 WHERE school_id = $2`,[email,id])
  if(address!== undefined) await pool.query(`UPDATE SCHOOL SET address = $1 WHERE school_id = $2`,[address,id])
  if(admin_name!== undefined) await pool.query(`UPDATE SCHOOL SET admin_name = $1 WHERE school_id = $2`,[admin_name,id])
  if(admin_email!== undefined) await pool.query(`UPDATE SCHOOL SET admin_email = $1 WHERE school_id = $2`,[admin_email,id])
  if(school_plan!== undefined) await pool.query(`UPDATE SCHOOL SET school_plan = $1 WHERE school_id = $2`,[school_plan,id])
  if(school_password!== undefined){
     const same = await bcrypt.compare(school_password,existing.rows[0].school_password)
     if(same){
        throw new Apierror(400,"Old and New password cannot be same")
     }else{
        const hashpass = await bcrypt.hash(school_password,10)
        await pool.query(`UPDATE SCHOOL SET school_password = $1 WHERE school_id = $2`,[hashpass,id])
     }
  }
  if(website_link!== undefined) await pool.query(`UPDATE SCHOOL SET website_link = $1 WHERE school_id = $2`,[website_link,id])
  if(phone!== undefined) await pool.query(`UPDATE SCHOOL SET phone = $1 WHERE school_id = $2`,[phone,id])
  if(status!== undefined) await pool.query(`UPDATE SCHOOL SET status = $1 WHERE school_id = $2`,[status,id])
     let logoUrl = null;

   if (req.file) {
    const uploadedLogo = await uploadToCloudinary(
        req.file.buffer,
        "School/logo",
        `${existing.rows[0].name}-${existing.rows[0].branchname}/logo`
    );

    logoUrl = uploadedLogo.secure_url;
    await pool.query(`UPDATE SCHOOL SET logo = $1 WHERE school_id = $2`,[logoUrl,id])
}

const updated = await pool.query(
    `SELECT * FROM school WHERE school_id = $1`,
    [id]
);

res.status(200)
.json(new Apiresponse(200,"School updated Successfully",updated.rows[0]))
})

export const addfeatures = asynchandler(async(req,res)=>{
    const {feature_name,description}=req.body

    if(!feature_name || !description){
        throw new Apierror(400,"Please fill all the required fields")
    }

    const feature = await pool.query(
        `INSERT INTO FEATURES(
          feature_name,
          description
        )
          VALUE(
            $1,$2
        )
            RETURNING *`,
        [feature_name,description])

        res.status(200)
        .json(new Apiresponse(200,"Feature added successfully",feature.rows[0]))
})

export const getfeatures = asynchandler(async(req,res)=>{
    const features = await pool.query(`SELECT * FROM FEATURES`)

    if(features.rows[0].length <1){
        throw new Apierror(404,"No feature found")
    }

    res.status(200)
    .json(new Apiresponse(200,"Features fetched successfully",features))
})

export const addplan = asynchandler(async(req,res)=>{
    const{price , plan_name,max_users,description,features} =req.body

    if(!price || !plan_name || !max_users || !description || !features){
        throw new Apierror(400,"Please fill all the required fields")
    }

    const insertplan = await pool.query(
        `
        INSERT INTO PLAN(
         price,
         plan_name,
         max_user,
         description
        )
         VALUES(
          $1,$2,$3,$4
         )
          RETURNING *
        `,[price,plan_name,max_users,description]
    )

    for(const feature of features){
        await pool.query(
            `INSERT INTO PLAN_FEATURES
            (
            plan_id,
            feature,
            )
            VALUES(
              $1,$2
            )
              RETURNING *`,[insertplan.rows[0].plan_id,feature]
        )
    }

    res.status(200)
    .json(new Apiresponse(200,"Plan added Successfully",insertplan.rows[0]))
})

export const deleteplan = asynchandler(async(req,res)=>{
    const {id} = req.params

    if(!id){
        throw new Apierror(400,"Please fill all the required fields")
    }

    const existingplan = await pool.query(`SELECT * FROM PLAN WHERE plan_id = $1`,[id])
    if(existingpaln.rows[0].length <1){
        throw new Apierror(404,"Plan not found")
    }

     await pool.query(`DELETE FROM SCHOOL WHERE paln_id = $1`,[id])

     res.status(200)
     .json(new Apiresponse(200,"Plan deleted successfully"))
})

export const updateplan = asynchandler(async(req,res)=>{
  const {id} = req.params

    if(!id){
        throw new Apierror(400,"Please fill all the required fields")
    }

     const{price , plan_name,max_users,description,features} =req.body

    if(price!== undefined) await pool.query(`UPDATE PLAN  SET price = $1 WHERE plan_id = $2 `,[price,id])
    if(plan_name!== undefined) await pool.query(`UPDATE PLAN  SET plan_name = $1 WHERE plan_id = $2 `,[plan_name,id])
    if(max_users!== undefined) await pool.query(`UPDATE PLAN  SET max_users = $1 WHERE plan_id = $2 `,[max_users,id])
    if(description!== undefined) await pool.query(`UPDATE PLAN  SET description = $1 WHERE plan_id = $2 `,[description,id])

        if(features!==undefined){
            await pool.query(`DELETE FROM PLAN_FEATURES WHERE plan_id = $1`,[id])
             for(const feature of features){
                 await pool.query(
            `INSERT INTO PLAN_FEATURES
            (
            plan_id,
            feature,
            )
            VALUES(
              $1,$2
            )
              RETURNING *`,[id,feature]
        )
             }
        }

        res.status(200)
        .json(new Apiresponse(200,"Updated the plan successfully"))

})

export const deletefeature = asynchandler(async(req,res)=>{
    const {id} = req.params

    if(!id){
        throw new Apierror(400,"Please fill all the required fields")
    }


    await pool.query(`DELETE FROM FEATURES WHERE feature_id = $1`,[id])

    res.status(200)
    .json(200,"Fature Deleted successfully",[])
})

export const addticket= asynchandler(async(req,res)=>{
    const {subject ,priority , assignee , school_name } = req.body

    if(!subject || !priority || !school_name){
        throw new Apierror(400,"Please fill all the required fields")
    }

    const ticket = await pool.query(`INSERT INTO TICKET(
        school_name,
        subject,
        priority,
        status,
        assignee,
        ),VALUES(
        $1,$2,$3,$4,$5
        )`,[school_name,subject,priority,"Open",null])

    res.status(200)
    .json(new Apiresponse(200,"TIcket created successfully",ticket.rows[0]))
})

export const gettickets = asynchandler(async(req,res)=>{
    const tickets = await pool.query(`SELECT * FROM TICKET`)

    if(ticket.rows.length<1){
        throw new Apierror(404,"No tickets found")
    }

    res.status(200)
    .json(new Apiresponse(200,"Tickets fetched successfully",tickets.rows))
})

export const deleteticket = asynchandler(async(req,res)=>{
    const {id} = req.params

    if(!id){
        throw new Apierror(400,"please fill all the required fields")
    }

    const ticket = await pool.query(`DELETE  FROM  TICKET WHERE ticket_id = $1`,[id])

    res.status(200)
    .json(new Apiresponse(200,"Ticket dleeted successfully",[]))
})

export const updateticket = asynchandler(async(req,res)=>{
    const{id} = req.params

    if(!id){
        throw new Apierror(400,"please fill all the required fields")
    }

    const {subject ,priority ,status ,  assignee , school_name } = req.body

    if(subject!==undefined)await pool.query(`UPDATE TICKET SET subject = $1 WHERE ticket_id = $2`,[subject,id])
    if(priority!==undefined)await pool.query(`UPDATE TICKET SET priority= $1 WHERE ticket_id = $2`,[priority,id])
    if(assignee!==undefined)await pool.query(`UPDATE TICKET SET assignee = $1 WHERE ticket_id = $2`,[assignee,id])
    if(status!==undefined)await pool.query(`UPDATE TICKET SET status = $1 WHERE ticket_id = $2`,[status,id])
    if(school_name!==undefined)await pool.query(`UPDATE TICKET SET school_name = $1 WHERE ticket_id = $2`,[school_name,id])

    const ticket = await pool.query(`Select * FROM  TICKET WHERE ticket_id = $1`,[id])
    if(ticket.rows.length <1){
        throw new Apierror(404,"Ticket not updated")
    }
    res.status(200)
    .json(new Apiresponse(200,"Ticket updated successfully",))

})


export const getallusers = asynchandler(async(req,res)=>{
    const users = await pool.query(`SELECT * FROM USERS`)

    if(users.rows.length<1){
        throw new Apierror(404,"No users found in database")
    }

    res.status(200)
    .json(new Apiresponse(200,"Users fetched successfully",users.rows))
})

