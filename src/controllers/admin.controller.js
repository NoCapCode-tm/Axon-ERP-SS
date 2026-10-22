import { pool } from "../database/dbconnect";
import { Apierror } from "../utils/Apierror";
import { Apiresponse } from "../utils/Apiresponse";
import { asynchandler } from "../utils/Asynchandler";
import bcrypt from "bcrypt"
import { generateAccessToken } from "../utils/Tokengenerate.utils";


export const schooladminlogin = asynchandler(async(req,res)=>{
    const {code , password} = req.body

    if(!code || !password){
        throw new Apierror(400,"Please fill all the required fields")
    }

    const existinguser = await pool.query('SELECT * FROM SCHOOL WHERE school_code = $1',[code]);
    if(existinguser.rows.length < 1){
       throw new Apierror(404,"School not present")
    }

    const passwordcorrect = bcrypt.compare(existinguser.rows[0].school_password , password)
    if(!passwordcorrect){
       throw new Apierror(401,"Incorrect Password")
    }
  //token waala kaam baaki  hai
  const accessToken =  generateAccessToken(existinguser.rows[0])
   
   
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
    };

    return res
        .status(200)
        .cookie("Token", accessToken, cookieOptions)
        .json(
            new Apiresponse(
                200,
                "Logged in Successfully",
                existinguser.rows[0]
            )
        );
})
export const getacademicyear = asynchandler(async(req,res)=>{
  const school = req.user
  if(!school){
    throw new Apierror(401,"School not Authorized")
  }

  const year = await pool.query('SELECT * FROM ACADEMIC_YEAR WHERE school_id = $1 AND is_deleted = $2',[school.id,false])

  res.status(200)
  .json(new Apiresponse(200,"Academic year added",year.rows[0]))
})

export const createacademicyear = asynchandler(async(req,res)=>{
  const school = req.user
  if(!school){
    throw new Apierror(401,"School not Authorized")
  }


  const {name ,  start , end , active} = req.body

  if(!name || !start || !end || !active){
    throw new Apierror(500,"Please fill all the required fields")
  }

  const year = await pool.query('INSERT INTO ACADEMIC_YEAR (startes_at , end_at ,is_active , academic_year_name , school_id ,is_deleted) VALUES ($1 ,$2 , $3 , $4 ,$5 ,$6) RETURNING *',[start , end , active , name , school.id ,false])

  res.status(200)
  .json(new Apiresponse(200,"Academic year added",year.rows[0]))
})

  export const updateacademicyear = asynchandler(async (req, res) => {
    const school = req.user;

    if (!school) {
        throw new Apierror(401, "School not Authorized");
    }

    const { id } = req.params;
    const { name, start, end, active } = req.body;

    if (!id) {
        throw new Apierror(400, "Academic year ID is required");
    }

    if (
        name === undefined ||
        start === undefined ||
        end === undefined ||
        active === undefined
    ) {
        throw new Apierror(400, "Please fill all the required fields");
    }

    const year = await pool.query(
        `UPDATE ACADEMIC_YEAR
         SET startes_at = $1,
             end_at = $2,
             is_active = $3,
             academic_year_name = $4
         WHERE academic_year_id = $5
           AND school_id = $6
         RETURNING *`,
        [start, end, active, name, id, school.id]
    );

    if (year.rows.length === 0) {
        throw new Apierror(
            404,
            "Academic year not found or does not belong to this school"
        );
    }

    return res.status(200).json(
        new Apiresponse(
            200,
            "Academic year updated successfully",
            year.rows[0]
        )
    );
});

export const deleteacademicyear = asynchandler(async(req,res)=>{
  const school = req.user
  if(!school){
    throw new Apierror(401,"School not Authorized")
  }
  const { id } = req.params;

  const year = await pool.query(
        `UPDATE ACADEMIC_YEAR
         SET is_deleted = $1,
         WHERE academic_year_id = $5
           AND school_id = $6
         RETURNING *`,
        [true, id, school.id]
    );


  res.status(200)
  .json(new Apiresponse(200,"Academic year deleted",year.rows[0]))
})

export const createclass = asynchandler(async(req,res)=>{
  const school = req.user
  if(!school){
    throw new Apierror(401,"School not Authorized")
  }

  const {name , max_size} = req.body

  if(!name || !max_size){
    throw new Apierror(400,"Please fill all the required fields")
  }

  const cl = await pool.query('INSERT INTO CLASS(max_size  ,class_name,school_id) VALUES ($1,$2,$3) RETURNING *',[max_size,name,school.id])
 if(cl.rows[0].length == 0){
  throw new Apierror(500,"Failed to create a class")
 }

 res.status(200)
 .json(new Apiresponse(200,"Class Created Successfully",cl.rows[0]))

})

export const createsection = asynchandler(async(req,res)=>{
  const school = req.user
  if(!school){
    throw new Apierror(401,"School not Authorized")
  }

  const {name,size} = req.body

  if(!name || !size){
    throw new Apierror(400,"Please fill all the required fields")
  }

  const cl = await pool.query('SELECT * FROM CLASS WHERE school_id = $1 AND is_deleted = $2',[school.id,false])

  const sec = await pool.query('INSERT INTO SECTION(section_name,school_id) VALUES ($1,$2) RETURNING *',[name,school.id])
 if(sec.rows[0].length == 0){
  throw new Apierror(500,"Failed to create a class")
 }

 for (const cls of cl.rows){
    const cl_sec = await pool.query('INSERT INTO CLASS_SECTION(section_id,class_id,school_id,max_capacity) VALUES ($1,$2,$3,$4) RETURNING *',[sec.rows[0].section_id,cls.class_id,school.id,size]);
 }
 

 res.status(200)
 .json(new Apiresponse(200,"Class Created Successfully",sec.rows[0]))

})
export const getclass = asynchandler(async(req,res)=>{
  const school = req.user
  if(!school){
    throw new Apierror(401,"School not Authorized")
  }

  const cl = await pool.query('SELECT * FROM CLASS WHERE school_id = $1 AND is_deleted = $2',[school.id,false])

  res.status(200)
  .json(new Apiresponse(200,"Academic year added",cl.rows[0]))
})
export const getsection= asynchandler(async(req,res)=>{
  const school = req.user
  if(!school){
    throw new Apierror(401,"School not Authorized")
  }

  const sc = await pool.query('SELECT * FROM SECTION WHERE school_id = $1 AND is_deleted = $2',[school.id,false])

  res.status(200)
  .json(new Apiresponse(200,"Academic year added",sc.rows[0]))
})

export const updateclass = asynchandler(async (req, res) => {
    const school = req.user;

    if (!school) {
        throw new Apierror(401, "School not Authorized");
    }

    const { id } = req.params;
    const { name, max_size } = req.body;

    if (!id || !max_size) {
        throw new Apierror(400, "Valid class ID is required");
    }

    const className = String(name ?? "").trim();
    const maxSize = Number(max_size);

    if (
        !className ||
        maxSize <= 0
    ) {
        throw new Apierror(
            400,
            "Please provide a valid class name and positive maximum size"
        );
    }

    const result = await pool.query(
        `UPDATE CLASS
         SET class_name = $1,
             max_size = $2
         WHERE class_id = $3
           AND school_id = $4
           AND is_deleted = false
         RETURNING *`,
        [className, maxSize, id, school.id]
    );

    if (result.rowCount === 0) {
        throw new Apierror(
            404,
            "Class not found or does not belong to this school"
        );
    }

    return res.status(200).json(
        new Apiresponse(
            200,
            "Class updated successfully",
            result.rows[0]
        )
    );
});


export const updatesection = asynchandler(async (req, res) => {
    const school = req.user;

    if (!school) {
        throw new Apierror(401, "School not Authorized");
    }

    const { id } = req.params;
    const { name, size } = req.body;

    if (!id || !size) {
        throw new Apierror(400, "Valid section ID is required");
    }

    if (
        !name ||
        size<= 0
    ) {
        throw new Apierror(
            400,
            "Please provide a valid section name and positive capacity"
        );
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const sectionResult = await client.query(
            `UPDATE SECTION
             SET section_name = $1
             WHERE section_id = $2
               AND school_id = $3
             RETURNING *`,
            [name, id, school.id]
        );

        if (sectionResult.rowCount === 0) {
            throw new Apierror(
                404,
                "Section not found or does not belong to this school"
            );
        }

        const capacityResult = await client.query(
            `UPDATE CLASS_SECTION
             SET max_capacity = $1
             WHERE section_id = $2
               AND school_id = $3
             RETURNING class_section_id`,
            [size, id, school.id]
        );

        await client.query("COMMIT");

        return res.status(200).json(
            new Apiresponse(
                200,
                "Section updated successfully",
                {
                    section: sectionResult.rows[0],
                    updatedClassSections: capacityResult.rowCount,
                }
            )
        );
    } catch (error) {
        await client.query("ROLLBACK").catch(() => {});
        throw error;
    } finally {
        client.release();
    }
});

export const deleteclass = asynchandler(async(req,res)=>{
  const school = req.user
  if(!school){
    throw new Apierror(401,"School not Authorized")
  }
  const { id } = req.params;

  const cl = await pool.query(
        `UPDATE ACADEMIC_YEAR
         SET is_deleted = $1,
         WHERE class_id = $5
           AND school_id = $6
         RETURNING *`,
        [true, id, school.id]
    );


  res.status(200)
  .json(new Apiresponse(200,"Academic year deleted",cl.rows[0]))
})
export const deletesection = asynchandler(async(req,res)=>{
  const school = req.user
  if(!school){
    throw new Apierror(401,"School not Authorized")
  }
  const { id } = req.params;

  const sec = await pool.query(
        `UPDATE ACADEMIC_YEAR
         SET is_deleted = $1,
         WHERE section_id = $5
           AND school_id = $6
         RETURNING *`,
        [true, id, school.id]
    );


  res.status(200)
  .json(new Apiresponse(200,"Academic year deleted",sec.rows[0]))
})