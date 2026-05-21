import "dotenv/config"
const config={
    connection_string:process.env.CONNECTION_STRING,
    jwt_secret:process.env.JWT_SECRET
 }
export default config