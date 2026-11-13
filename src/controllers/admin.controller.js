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

export const createsubject = asynchandler(async(req,res)=>{
   const school = req.user
  if(!school){
    throw new Apierror(401,"School not Authorized")
  }
  
  const {name , classes} = req.body

  const subjectName = String(name ?? "").trim();

const words = subjectName
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

const base_code = words.length > 1
    ? words.map(word => word[0]).join("").toUpperCase()
    : words[0]?.slice(0, 4).toUpperCase() || "";

  const existing_sub = await pool.query('SELECT * FROM SUBJECT WHERE subject_code = $1',[base_code])
  if(existing_sub.rows.length > 0){
    throw new Apierror(400,"Subject already exists")
  }

  const sub = await pool.query(`INSERT INTO SUBJECT(subject_name , subject_code ,school_id) VALUES ($1,$2,$3) RETURNING *`,[name,base_code,school.id])
  
   for (const cls of classes){
    const cl = await pool.query('SELECT * FROM CLASS WHERE class_id = $1',[cls])
    const existingcl = await pool.query('SELECT * FROM CLASS_SUBJECT WHERE class_id = $1 AND subject_id=$2 AND school_id = $3 ',[cls,sub.rows[0],school.id])
    if(existingcl.rows.length==0){
      const class_sub_code = `${base_code}-0${cl.rows[0].class_name}`
      const cl_sub = await pool.query('INSERT INTO CLASS_SUBJECT(subject_id,class_id,school_id,class_subject_code) VALUES ($1,$2,$3,$4) RETURNING *',[sub.rows[0].subject_id,cls,school.id,class_sub_code]);
    }else{
      continue
    }
  }

  res.status(200)
  .json(new Apiresponse(200,"Subject added Successfully",[sub.rows[0]]))
})

export const getsubject = asynchandler(async(req,res)=>{
    const school = req.user
  if(!school){
    throw new Apierror(401,"School not Authorized")
  }

  const sub = await pool.query('SELECT * FROM SUBJECT WHERE school_id = $1 AND is_deleted = $2',[school.id,false])

  res.status(200)
  .json(new Apiresponse(200,"Subjects Fetched Successfully",sub.rows[0]))
})


export const updatesubject = asynchandler(async (req, res) => {
  const school = req.user;

  if (!school) {
    throw new Apierror(401, "School not Authorized");
  }

  const { subject_id } = req.params;
  const { name, classes } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Check whether subject exists and belongs to this school
    const existingSubject = await client.query(
      `SELECT * FROM SUBJECT 
       WHERE subject_id = $1 AND school_id = $2`,
      [subject_id, school.id]
    );

    if (existingSubject.rows.length === 0) {
      throw new Apierror(404, "Subject not found");
    }

    const subject = existingSubject.rows[0];

    // 2. Generate subject code if name is provided
    let subjectName = subject.subject_name;
    let base_code = subject.subject_code;

    if (name !== undefined) {
      subjectName = String(name).trim();

      if (!subjectName) {
        throw new Apierror(400, "Subject name cannot be empty");
      }

      const words = subjectName
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .split(/\s+/)
        .filter(Boolean);

      base_code =
        words.length > 1
          ? words.map(word => word[0]).join("").toUpperCase()
          : words[0]?.slice(0, 4).toUpperCase() || "";

      if (!base_code) {
        throw new Apierror(400, "Invalid subject name");
      }

      // 3. Check duplicate subject code (excluding current subject)
      const duplicate = await client.query(
        `SELECT subject_id FROM SUBJECT
         WHERE subject_code = $1
         AND school_id = $2
         AND subject_id <> $3`,
        [base_code, school.id, subject_id]
      );

      if (duplicate.rows.length > 0) {
        throw new Apierror(400, "Subject already exists");
      }
    }

    // 4. Update subject details
    const updatedSubject = await client.query(
      `UPDATE SUBJECT
       SET subject_name = $1,
           subject_code = $2
       WHERE subject_id = $3
       AND school_id = $4
       RETURNING *`,
      [subjectName, base_code, subject_id, school.id]
    );

    // 5. Update existing CLASS_SUBJECT mappings
    // if subject code changes, update their class_subject_code too
    await client.query(
      `UPDATE CLASS_SUBJECT cs
       SET class_subject_code = $1 || '-0' || c.class_name
       FROM CLASS c
       WHERE cs.class_id = c.class_id
       AND cs.subject_id = $2
       AND cs.school_id = $3`,
      [base_code, subject_id, school.id]
    );

    // 6. Update class associations only if classes is provided
    if (classes !== undefined) {

      if (!Array.isArray(classes)) {
        throw new Apierror(400, "Classes must be an array");
      }

      // Remove duplicate class IDs
      const uniqueClasses = [...new Set(classes)];

      // Validate that all classes belong to this school
      const validClasses = await client.query(
        `SELECT class_id, class_name
         FROM CLASS
         WHERE class_id = ANY($1::int[])
         AND school_id = $2`,
        [uniqueClasses, school.id]
      );

      if (validClasses.rows.length !== uniqueClasses.length) {
        throw new Apierror(400, "One or more classes are invalid");
      }

      // Remove associations that are no longer required
      await client.query(
        `DELETE FROM CLASS_SUBJECT
         WHERE subject_id = $1
         AND school_id = $2
         AND NOT (class_id = ANY($3::int[]))`,
        [subject_id, school.id, uniqueClasses]
      );

      // Add newly selected class associations
      for (const cls of validClasses.rows) {

        const existingMapping = await client.query(
          `SELECT class_subject_id
           FROM CLASS_SUBJECT
           WHERE class_id = $1
           AND subject_id = $2
           AND school_id = $3`,
          [cls.class_id, subject_id, school.id]
        );

        if (existingMapping.rows.length === 0) {

          const class_sub_code =
            `${base_code}-0${cls.class_name}`;

          await client.query(
            `INSERT INTO CLASS_SUBJECT
             (subject_id, class_id, school_id, class_subject_code)
             VALUES ($1, $2, $3, $4)`,
            [
              subject_id,
              cls.class_id,
              school.id,
              class_sub_code
            ]
          );
        }
      }
    }

    // 7. Get updated class associations
    const updatedClasses = await client.query(
      `SELECT cs.*, c.class_name
       FROM CLASS_SUBJECT cs
       JOIN CLASS c ON c.class_id = cs.class_id
       WHERE cs.subject_id = $1
       AND cs.school_id = $2`,
      [subject_id, school.id]
    );

    await client.query("COMMIT");

    return res.status(200).json(
      new Apiresponse(200, "Subject updated successfully", {
        subject: updatedSubject.rows[0],
        classes: updatedClasses.rows
      })
    );

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});

// export const deletesubject = asynchandler(async(req,res)=>{
   
// })

export const assignclassteacher = asynchandler(async(req,res)=>{
   
})


