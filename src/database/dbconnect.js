import {Pool} from "pg"


const pool = new Pool({
    user:process.env.PG_USER,
    password:process.env.PG_PASSWORD,
    host:process.env.PG_HOST,
    database:process.env.PG_DATABASE,
    port:process.env.PG_PORT,
})


const connectdb = async()=>{
    try {
        const connect = await pool.query("SELECT NOW()")
        console.log(process.env.PG_HOST)
        console.log("Database connected at : ",connect.rows[0])
    
    } catch (error) {
        console.log("Postgres connection not established",error)
    }
}

export {connectdb , pool}