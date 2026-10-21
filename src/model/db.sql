CREATE DATABASE schoolerp;

-- SCHOOL TABLE AND SUPER ADMIN SIDE TABLES

CREATE TABLE SCHOOL(
    school_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    branchname VARCHAR(200) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(200) ,
    admin_name VARCHAR(100),
    logo VARCHAR(100),
    website_link VARCHAR(200),
    phone VARCHAR(12),
    status VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PLAN(
    plan_id BIGSERIAL PRIMARY KEY,
    price DECIMAL(10,2),
    plan_name VARCHAR(100) UNIQUE,
    duration INT NOT NULL
);
CREATE TABLE FEATURES(
    feature_id BIGSERIAL PRIMARY KEY,
    feature_name VARCHAR(100) UNIQUE,
    description VARCHAR(200)
);

CREATE TABLE PLAN_FEATURES(
    plan_features_id BIGSERIAL PRIMARY KEY,
    plan_id BIGINT NOT NULL,
    feature_id BIGINT NOT NULL,
    FOREIGN KEY(plan_id) REFERENCES PLAN(plan_id) on DELETE CASCADE,
    FOREIGN KEY(feature_id) REFERENCES FEATURES(feature_id) on DELETE CASCADE,
    UNIQUE(plan_id,feature_id)
);

CREATE TABLE SUBSCRIPTION(
    subscription_id BIGSERIAL PRIMARY KEY,
    status VARCHAR(50),
    school_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    FOREIGN key(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    FOREIGN key(plan_id) REFERENCES PLAN(plan_id) on DELETE CASCADE,
    expires_at TIMESTAMP ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE TICKET(
ticket_id BIGSERIAL PRIMARY KEY,
school_name VARCHAR(100),
status VARCHAR(50),
priority VARCHAR(50),
assignee VARCHAR(50),
subject VARCHAR(1000),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE PAYMENT(
   payment_id BIGSERIAL PRIMARY KEY,
   amount DECIMAL(10,2),
   currency VARCHAR(100),
   payment_gateway VARCHAR(100),
   gateway_transaction_id VARCHAR(200),
   payment_status VARCHAR(100),
   paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   invoice_url VARCHAR(500),
   subscription_id BIGINT NOT NULL,
   school_id BIGINT NOT NULL,
   FOREIGN KEY(subscription_id) REFERENCES SUBSCRIPTION(subscription_id) on DELETE CASCADE,
   FOREIGN key(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE
);

-- SYSTEMS INSIDE A SCHOOL

-- 1 . USERS

CREATE TABLE USERS(
    user_id BIGSERIAL PRIMARY KEY,
    user_name VARCHAR(100),
    email VARCHAR(200),
    user_password VARCHAR(200),
    profile_img VARCHAR(200),
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_status VARCHAR(100),
    school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE
);

CREATE TABLE ROLES(
    role_id BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(100),
    description VARCHAR(500)
);

CREATE TABLE USER_ROLES(
   user_id BIGINT NOT NULL,
   role_id BIGINT NOT NULL,
   FOREIGN KEY(user_id) REFERENCES USERS(user_id) on DELETE CASCADE,
   FOREIGN KEY(role_id) REFERENCES ROLES(role_id) on DELETE CASCADE,
   UNIQUE(user_id,role_id)
);

-- STUDENT TABLE

CREATE TABLE STUDENT(
    admission_no INT ,
    student_id BIGSERIAL PRIMARY KEY,
    admission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    previous_school_name VARCHAR(100),
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    father_phone VARCHAR(20),
    mother_mobile VARCHAR(20),
    father_occupation VARCHAR(50),
    mother_occupation VARCHAR(50),
    address VARCHAR(100),
    aadhar_id VARCHAR(500),
    birth_certificate VARCHAR(500),
    transfer_certificate VARCHAR(500),
    OTHER_DOC VARCHAR(100),
    dob VARCHAR(100),
    gender VARCHAR(100),
    user_id BIGINT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES USERS(user_id)
);

-- TEACHER ENTRY

CREATE TABLE TEACHER(
    teacher_id BIGSERIAL PRIMARY KEY,
    dob DATE,
    gender VARCHAR(100),
    aadhar_id VARCHAR(500),
    pan_id VARCHAR(500),
    aadhar_no VARCHAR(12),
    pan_no VARCHAR(10),
    account_no VARCHAR(500),
    branch_name VARCHAR(500),
    joining_date DATE,
    base_salary DECIMAL(10,2),
    teacher_resume VARCHAR(500)
    user_id BIGINT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES USERS(user_id)
);
CREATE TABLE TEACHER_EXP(
    institute_name VARCHAR(200),
    title VARCHAR(200),
    proof VARCHAR(500),
    teacher_exp_id BIGSERIAL PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    FOREIGN KEY(teacher_id) REFERENCES TEACHER(teacher_id) on DELETE CASCADE
);
CREATE TABLE TEACHER_EDUCATION(
    teacher_education_id BIGSERIAL PRIMARY KEY,
    school_name VARCHAR(200),
    percentage VARCHAR(50),
     teacher_id BIGINT NOT NULL,
    FOREIGN KEY(teacher_id) REFERENCES TEACHER(teacher_id) on DELETE CASCADE 
);

-- ACADEMIC YEAR AND TIMETABLE

CREATE TABLE ACADEMIC_YEAR(
    academic_year_id BIGSERIAL PRIMARY KEY,
    startes_at DATE,
    end_at DATE,
    is_active BOOLEAN,
    academic_year_name VARCHAR(20),
    school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    UNIQUE(school_id, academic_year_name)
);

CREATE TABLE CLASS(
    class_id BIGSERIAL PRIMARY KEY,
    class_name VARCHAR(20),
    school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE
);
CREATE TABLE SECTION(
    section_id BIGSERIAL PRIMARY KEY,
    section_name VARCHAR(50),
    school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE
);
CREATE TABLE CLASS_SECTION(
    class_section_id BIGSERIAL PRIMARY KEY,
    class_id BIGINT NOT NULL,
    section_id BIGINT NOT NULL,
    school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    FOREIGN KEY(class_id) REFERENCES CLASS(class_id) on DELETE CASCADE,
    FOREIGN KEY(section_id) REFERENCES SECTION(section_id) on DELETE CASCADE,
    max_capacity INT,
    UNIQUE(school_id,class_id,section_id)
);

-- TEACHER AND STUDENT ASSIGNMENT TO SECTION

CREATE TABLE STUDENT_CLASS_SECTION(
    enrollment_id BIGSERIAL PRIMARY KEY,
    
    academic_year_id BIGINT NOT NULL,
    school_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    class_section_id BIGINT NOT NULL,
    FOREIGN KEY(class_section_id) REFERENCES CLASS_SECTION(class_section_id) on DELETE CASCADE,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    FOREIGN KEY(student_id) REFERENCES STUDENT(student_id) on DELETE CASCADE,
    UNIQUE(student_id,class_section_id,academic_year_id)

);
CREATE TABLE TEACHER_CLASS_SECTION(
    teacher_enrollment_id BIGSERIAL PRIMARY KEY,
    class_section_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    school_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    FOREIGN KEY(class_section_id) REFERENCES CLASS_SECTION(class_section_id) on DELETE CASCADE,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    FOREIGN KEY(teacher_id) REFERENCES TEACHER(teacher_id) on DELETE CASCADE,
    UNIQUE(teacher_id,class_section_id,academic_year_id)

);

CREATE TABLE SUBJECT(
    subject_id BIGSERIAL PRIMARY KEY,
    subject_name VARCHAR(200),
    school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE
);

CREATE TABLE CLASS_SUBJECT(
    class_subject_id BIGSERIAL PRIMARY KEY,
    class_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    FOREIGN KEY(class_id) REFERENCES CLASS(class_id) on DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES SUBJECT(subject_id) on DELETE CASCADE,
    school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    UNIQUE(class_id,subject_id)

);

CREATE TABLE TEACHER_SUBJECT(
    teacher_subject_id BIGSERIAL PRIMARY KEY,
    subject_id BIGINT NOT NULL,
    FOREIGN KEY(subject_id) REFERENCES SUBJECT(subject_id) on DELETE CASCADE,
    teacher_id BIGINT NOT NULL,
    FOREIGN KEY(teacher_id) REFERENCES TEACHER(teacher_id) on DELETE CASCADE,
    school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    UNIQUE(teacher_id,subject_id)
);

CREATE TABLE TEACHER_SUBJECT_CLASS(
    teacher_subject_class_id BIGSERIAL PRIMARY KEY,
  school_id BIGINT NOT NULL,
  FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
  subject_id BIGINT NOT NULL,
  FOREIGN KEY(subject_id) REFERENCES SUBJECT(subject_id) on DELETE CASCADE,
  teacher_id BIGINT NOT NULL,
  FOREIGN KEY(teacher_id) REFERENCES TEACHER(teacher_id) on DELETE CASCADE,
  class_section_id BIGINT NOT NULL,
  FOREIGN KEY(class_section_id) REFERENCES CLASS_SECTION(class_section_id) on DELETE CASCADE,
  academic_year_id BIGINT NOT NULL,
  FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
  UNIQUE(teacher_id,class_section_id,subject_id,academic_year_id)
);

CREATE TABLE PERIOD(
    period_id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    period_name VARCHAR(20),
    start_time TIME,
    end_time TIME,
    sequence INT,
    is_break BOOLEAN, 
    UNIQUE(school_id, sequence)
);

CREATE TABLE TIMETABLE(
    timetable_id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    class_section_id BIGINT NOT NULL,
    period_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    day_of_week VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    FOREIGN KEY(class_section_id) REFERENCES CLASS_SECTION(class_section_id) on DELETE CASCADE,
    FOREIGN KEY(period_id) REFERENCES PERIOD(period_id) on DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES SUBJECT(subject_id) on DELETE CASCADE,
    FOREIGN KEY(teacher_id) REFERENCES TEACHER(teacher_id) on DELETE CASCADE
);

-- ATTENDANCE and LEAVE SYSTEM

CREATE TABLE STUDENT_ATTENDANCE(
    student_attendance_id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    enrollment_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    FOREIGN KEY(enrollment_id) REFERENCES STUDENT_CLASS_SECTION(enrollment_id) on DELETE CASCADE,
    date DATE,
    status VARCHAR(200),
    marked_by BIGINT,
    FOREIGN KEY(marked_by) REFERENCES USERS(user_id),
    UNIQUE(enrollment_id, date)

);
CREATE TABLE TEACHER_ATTENDANCE(
    teacher_attendance_id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    FOREIGN KEY(teacher_id) REFERENCES TEACHER(teacher_id) on DELETE CASCADE,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    date DATE,
    status VARCHAR(200),
    marked_by BIGINT,
    FOREIGN KEY(marked_by) REFERENCES USERS(user_id),
    UNIQUE(teacher_id, date)

);

CREATE TABLE STUDENT_LEAVE(
    student_leave_id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    leavereason VARCHAR(10000),
    start_date DATE,
    approved_by BIGINT,
    leave_status VARCHAR(30) DEFAULT 'pending',
    FOREIGN KEY(approved_by) REFERENCES USERS(user_id),
    end_date DATE,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    FOREIGN KEY(student_id) REFERENCES STUDENT(student_id) on DELETE CASCADE
);
CREATE TABLE TEACHER_LEAVE(
    teacher_leave_id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    leavereason VARCHAR(10000),
    leave_status VARCHAR(30) DEFAULT 'pending',
    approved_by BIGINT,
    FOREIGN KEY(approved_by) REFERENCES USERS(user_id),
    start_date DATE,
    end_date DATE,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    FOREIGN KEY(teacher_id) REFERENCES TEACHER(teacher_id) on DELETE CASCADE
);

-- EXAMS AND RESULTS

CREATE TABLE EXAM(
    exam_id BIGSERIAL PRIMARY KEY,
    exam_name VARCHAR(50),
    start_date DATE,
    end_date DATE,
    exam_status VARCHAR(50),
    school_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE
);

CREATE TABLE CLASS_EXAM(
    class_exams_id BIGSERIAL PRIMARY KEY,
    class_id BIGINT NOT NULL,
    exam_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    FOREIGN KEY(class_id) REFERENCES CLASS(class_id) on DELETE CASCADE,
    FOREIGN KEY(exam_id) REFERENCES EXAM(exam_id) on DELETE CASCADE,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE
);

CREATE TABLE EXAM_SUBJECT(
   exam_subject_id BIGSERIAL PRIMARY KEY,
   max_marks INT,
   passing_marks INT,
   practical_marks INT,
   internal_marks INT,
    class_id BIGINT NOT NULL,
    exam_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    FOREIGN KEY(subject_id) REFERENCES SUBJECT(subject_id) on DELETE CASCADE,
    FOREIGN KEY(class_id) REFERENCES CLASS(class_id) on DELETE CASCADE,
    FOREIGN KEY(exam_id) REFERENCES EXAM(exam_id) on DELETE CASCADE

);

CREATE TABLE SUBJECT_STUDENT_MARK(
    subject_student_mark_id BIGSERIAL PRIMARY KEY,
    scored_internal_marks INT,
    scored_practical_marks INT,
    scored_theory_marks INT,
    absent_status VARCHAR(100),
    academic_year_id BIGINT NOT NULL,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    student_id BIGINT NOT NULL,
    FOREIGN KEY(student_id) REFERENCES STUDENT(student_id) on DELETE CASCADE,
    exam_subject_id  BIGINT NOT NULL,
    FOREIGN KEY(exam_subject_id) REFERENCES EXAM_SUBJECT(exam_subject_id)


);


CREATE TABLE STUDENT_RESULT(
    student_result_id BIGSERIAL PRIMARY KEY,
    toatl_marks INT,
    percentage DECIMAL(10,2),
    grade VARCHAR(10),
    rank INT,
    result_status VARCHAR(40),
    teacher_remarks VARCHAR(500),
    exam_id BIGINT NOT NULL,
     academic_year_id BIGINT NOT NULL,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    FOREIGN KEY(exam_id) REFERENCES EXAM(exam_id) on DELETE CASCADE,
     student_id BIGINT NOT NULL,
    FOREIGN KEY(student_id) REFERENCES STUDENT(student_id) on DELETE CASCADE,
    UNIQUE(student_id, exam_id)


);

-- ASSIGNMENGTS AND LMS

CREATE TABLE STUDY_MATERIAL(
    study_material_id BIGSERIAL PRIMARY KEY,
    subject_id BIGINT NOT NULL,
    FOREIGN KEY(subject_id) REFERENCES SUBJECT(subject_id) on DELETE CASCADE,
    created_by BIGINT NOT NULL,
    FOREIGN KEY(created_by) REFERENCES USERS(user_id),
    created_at DATE,
    attachment VARCHAR(500),
    video_links VARCHAR(500),
    school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    academic_year_id BIGINT NOT NULL,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    class_id BIGINT NOT NULL,
    FOREIGN KEY(class_id) REFERENCES CLASS(class_id) on DELETE CASCADE,
    is_checked BOOLEAN,
    title VARCHAR(500),
    description VARCHAR(1000)
);

CREATE TABLE ASSIGNMENT(
    assignment_id BIGSERIAL PRIMARY KEY,
    subject_id BIGINT NOT NULL,
    FOREIGN KEY(subject_id) REFERENCES SUBJECT(subject_id) on DELETE CASCADE,
    made_by BIGINT NOT NULL,
    FOREIGN KEY(made_by) REFERENCES USERS(user_id),
    made_at DATE,
    end_at DATE,
    attachment VARCHAR(500),
     school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    academic_year_id BIGINT NOT NULL,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    class_section_id BIGINT NOT NULL,
    FOREIGN KEY(class_section_id) REFERENCES CLASS_SECTION(class_section_id) on DELETE CASCADE,
    assignment_title VARCHAR(200),
    assignment_description VARCHAR(500),
    max_marks DECIMAL(10,2)

);

CREATE TABLE SUBMISSION(
    submission_id BIGSERIAL PRIMARY KEY,
    subject_id BIGINT NOT NULL,
    FOREIGN KEY(subject_id) REFERENCES SUBJECT(subject_id) on DELETE CASCADE,
    submitted_by BIGINT NOT NULL,
    FOREIGN KEY(submitted_by) REFERENCES USERS(user_id),
    submitted_at DATE,
    end_at DATE,
    attachment VARCHAR(500),
     school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    academic_year_id BIGINT NOT NULL,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    enrollment_id BIGINT NOT NULL,
    FOREIGN KEY(enrollment_id) REFERENCES STUDENT_CLASS_SECTION(enrollment_id) on DELETE CASCADE,
    assignment_id BIGINT NOT NULL,
    FOREIGN KEY(assignment_id) REFERENCES ASSIGNMENT(assignment_id) on DELETE CASCADE,
    remarks VARCHAR(500),
    is_checked BOOLEAN,
    marks_obtained INT
);

-- LAST MODULE FEES AND FINANACE
CREATE TABLE FEES(
    fees_id BIGSERIAL PRIMARY KEY,
     school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    academic_year_id BIGINT NOT NULL,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    class_id BIGINT NOT NULL,
    FOREIGN KEY(class_id) REFERENCES CLASS(class_id) on DELETE CASCADE,
    fee_name VARCHAR(100),
    UNIQUE(class_id, academic_year_id)

);

CREATE TABLE FEES_STRUCTURE(
    fees_structure_id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    academic_year_id BIGINT NOT NULL,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    fee_type VARCHAR(100),
    amount DECIMAL(10,2),
    feeS_id BIGINT NOT NULL,
    FOREIGN KEY(fees_id) REFERENCES FEES(fees_id) ON DELETE CASCADE,
    UNIQUE(fees_id, fee_type)
);

CREATE TABLE FEES_INSTALLMENT(
    school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
    academic_year_id BIGINT NOT NULL,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    installment_id BIGSERIAL PRIMARY KEY,
    installment_name VARCHAR(200),
    start_date DATE,
    amount DECIMAL(10,2),
    due_date DATE,
    late_fine DECIMAL(10,2),
    fees_id BIGINT NOT NULL,
    FOREIGN KEY(fees_id) REFERENCES FEES(fees_id) on DELETE CASCADE
);

CREATE TABLE STUDENT_FEES(
    student_fees_id BIGSERIAL PRIMARY KEY,
    academic_year_id BIGINT NOT NULL,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    fees_id BIGINT NOT NULL,
    FOREIGN KEY(fees_id) REFERENCES FEES(fees_id) on DELETE CASCADE,
     school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
     enrollment_id BIGINT NOT NULL,
    FOREIGN KEY(enrollment_id) REFERENCES STUDENT_CLASS_SECTION(enrollment_id) on DELETE CASCADE,
    scholarship_amount DECIMAL(10,2),
    fees_status VARCHAR(200)
);

CREATE TABLE FEES_PAYMENT(
    payment_id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES SCHOOL(school_id) on DELETE CASCADE,
     academic_year_id BIGINT NOT NULL,
    FOREIGN KEY(academic_year_id) REFERENCES ACADEMIC_YEAR(academic_year_id) on DELETE CASCADE,
    installment_id BIGINT NOT NULL,
    FOREIGN KEY(installment_id) REFERENCES FEES_INSTALLMENT(installment_id) on DELETE CASCADE,
    amount DECIMAL(10,2),
    late_fine_paid DECIMAL(10,2),
    receipt_no VARCHAR(100),
    UNIQUE(gateway_transaction_id),
    currency VARCHAR(100),
    balance_amount DECIMAL(10,2),
    payment_gateway VARCHAR(100),
    gateway_transaction_id VARCHAR(200),
    payment_status VARCHAR(200),
    payment_method VARCHAR(200),
    paid_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    invoice_url VARCHAR(500),
    student_fees_id BIGINT NOT NULL,
    FOREIGN KEY(student_fees_id) REFERENCES STUDENT_FEES(student_fees_id) on DELETE CASCADE

)



