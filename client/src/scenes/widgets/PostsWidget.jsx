import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setPosts } from "state"
import PostWidget from "./PostWidget"
import { GlobalVariable } from "util/globleVariable"

const main_url = GlobalVariable.apiUrl.mailUrl

const PostsWidget = ({ userId, isProfile = false }) => {
 const dispatch = useDispatch()
 const posts = useSelector((state) => state.posts)
 const token = useSelector((state) => state.token)

 const getPosts = async () => {
  const response = await fetch(`${main_url}/posts`, {
   method: "GET",
   headers: { Authorization: `Bearer ${token}` }
  })
  const data = await response.json()
  dispatch(setPosts({ posts: data.reverse() }))
 }

 const getUserPosts = async () => {
  const response = await fetch(`${main_url}/posts/${userId}/posts`, {
   method: "GET",
   headers: { Authorization: `Bearer ${token}` }
  })
  const data = await response.json()
  dispatch(setPosts({ posts: data }))
 }

 useEffect(() => {
  if (isProfile) {
   getUserPosts()
  } else {
   getPosts()
  }
 }, []) // eslint-disable-line react-hooks/exhaustive-deps

 return (
  <>
   {posts.map(
    ({
     _id,
     userId,
     firstName,
     lastName,
     description,
     location,
     picturePath,
     userPicturePath,
     likes,
     comments,
     updatedAt
    }) => (
     <PostWidget
      key={_id}
      postId={_id}
      postUserId={userId}
      name={`${firstName} ${lastName}`}
      description={description}
      location={location}
      picturePath={picturePath}
      userPicturePath={userPicturePath}
      likes={likes}
      comments={comments}
      time={updatedAt}
     />
    )
   )}
  </>
 )
}

export default PostsWidget
