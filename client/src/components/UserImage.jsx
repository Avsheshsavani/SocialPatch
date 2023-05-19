import { Box } from "@mui/material"
import { GlobalVariable } from "util/globleVariable"

const main_url=GlobalVariable.apiUrl.mailUrl

const UserImage = ({ image, size = "60px" }) => {
 return (
  <Box width={size} height={size}>
   <img
    style={{ objectFit: "cover", borderRadius: "50%" }}
    width={size}
    height={size}
    alt="user"
    src={`${main_url}/assets/${image}`}
   />
  </Box>
 )
}

export default UserImage