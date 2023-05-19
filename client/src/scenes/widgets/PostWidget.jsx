import {
 ChatBubbleOutlineOutlined,
 FavoriteBorderOutlined,
 FavoriteOutlined,
 ShareOutlined
} from "@mui/icons-material"
import {
 Box,
 Button,
 Divider,
 IconButton,
 InputBase,
 Typography,
 useTheme
} from "@mui/material"
import FlexBetween from "components/FlexBetween"
import Friend from "components/Friend"
import WidgetWrapper from "components/WidgetWrapper"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setPost } from "state"
import { GlobalVariable } from "util/globleVariable"

const main_url = GlobalVariable.apiUrl.mailUrl

const PostWidget = ({
 postId,
 postUserId,
 name,
 description,
 location,
 picturePath,
 userPicturePath,
 likes,
 comments
}) => {
  console.log(comments)
 const [isComments, setIsComments] = useState(false)
 const [commentData,setCommentdata] = useState("")
 const dispatch = useDispatch()
 const token = useSelector((state) => state.token)
 const loggedInUserId = useSelector((state) => state.user._id)
 const userInfo = useSelector((state) => state.user)
 const isLiked = Boolean(likes[loggedInUserId])
 const likeCount = Object.keys(likes).length

 const { palette } = useTheme()
 const main = palette.neutral.main
 const medium = palette.neutral.medium
 const primary = palette.primary.main

 const patchLike = async () => {
  const response = await fetch(`${main_url}/posts/${postId}/like`, {
   method: "PATCH",
   headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
   },
   body: JSON.stringify({ userId: loggedInUserId })
  })
  const updatedPost = await response.json()
  dispatch(setPost({ post: updatedPost }))
 }

 const commentAction = async () => {
  const response = await fetch(`${main_url}/posts/${postId}/comment`, {
   method: "PATCH",
   headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
   },
   body: JSON.stringify({ userId: loggedInUserId, comment: commentData, firstName:userInfo.firstName, lastName: userInfo.lastName })
  })
  const updatedPost = await response.json()
  dispatch(setPost({ post: updatedPost }))
  setCommentdata("")
 }

 return (
  <WidgetWrapper m="2rem 0">
   <Friend
    friendId={postUserId}
    name={name}
    subtitle={location}
    userPicturePath={userPicturePath}
    isSameUser={loggedInUserId !== postUserId ? true : false}
   />

   <Typography color={main} sx={{ mt: "1rem" }}>
    {description}
   </Typography>
   {picturePath && (
    <img
     width="100%"
     height="auto"
     alt="post"
     style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
     src={`${main_url}/assets/${picturePath}`}
    />
   )}
   <FlexBetween mt="0.25rem">
    <FlexBetween gap="1rem">
     <FlexBetween gap="0.3rem">
      <IconButton onClick={patchLike}>
       {isLiked ? (
        <FavoriteOutlined sx={{ color: primary }} />
       ) : (
        <FavoriteBorderOutlined />
       )}
      </IconButton>
      <Typography>{likeCount}</Typography>
     </FlexBetween>

     <FlexBetween gap="0.3rem">
      <IconButton onClick={() => setIsComments(!isComments)}>
       <ChatBubbleOutlineOutlined />
      </IconButton>
      <Typography>{comments.length}</Typography>
     </FlexBetween>
    </FlexBetween>

    <IconButton>
     <ShareOutlined />
    </IconButton>
   </FlexBetween>
   {isComments && (
    <Box mt="0.5rem">
     <>
      <FlexBetween gap="0.25rem" sx = {{ marginBottom : "1rem"}}>
       <InputBase
        placeholder="Comment..."
         onChange={(e) => setCommentdata(e.target.value)}
         value={commentData}
        sx={{
         width: "80%",
         backgroundColor: palette.neutral.light,
         borderRadius: "2rem",
         padding: "0.5rem 1rem"
        }}
       />
       <Button
         disabled={!commentData}
         onClick={commentAction}
        sx={{
         color: palette.background.alt,
         backgroundColor: palette.primary.main,
         border: `1px solid ${palette.primary.main}`,
         borderRadius: "3rem",
         "&:hover": {
          color: palette.primary.light,
          cursor: "pointer",
          border: `1px solid ${palette.primary.light}`
         }
        }}
       >
        Comment
       </Button>
      </FlexBetween>
      {comments.map((e, i) => (

       <Box key={`${name}-${i}`}>
        <Divider />
        <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
         {e.name}
        </Typography>
        <Typography sx={{ color: medium, m: "0.5rem 0", pl: "1rem" }}>
         {e.comment}
        </Typography>
       </Box>
      ))}
     </>
     <Divider />
    </Box>
   )}
  </WidgetWrapper>
 )
}

export default PostWidget
