const Food = require('../../models/Food')
const Post = require("../../models/Post")
const PostComment = require("../../models/PostComment")
const PostReaction = require("../../models/PostReaction")
const FilterPostData = require("../../utils/FilterPostData")
const SendDataToFollower = require("../../utils/socket/SendDataToFollower")
const SendDataToUsers = require("../../utils/socket/SendDataToUsers")
const CreateNotification = require('../../utils/CreateNotification')
const { FilterCommentData } = require('../../utils/FilterCommentData')


exports.createPost = async (req, res) => {

    try {
        const {foods, content, photos, location, is_public} = req.body

        if((!content || content.trim().length === 0) && (!photos || photos.length === 0)) {
            return res.status(400).json({ error: 'Post must have content or a photo'})
        }

        const post = new Post({
            content,
            photos,
            location,
            is_public,
            author: req.userId
        })

        if(foods) {
            foods.forEach( food => {
                post.foods.push(food)
            })
        }

        const savePost = await post.save()

        const post_data = FilterPostData(await Post.findById(savePost.id).populate('author').populate('foods'))

        let notifData = {
            req,
            notify_type: 'POST',
            notify_content: `${post_data.author.username} has new post`,
            key: 'new-post',
            data: post_data,
            destination: ''
        }

        await SendDataToFollower(notifData)

        return res.status(201).json({
            message: 'Create new post successfully',
            post: post_data
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Something went wrong'})
    }
}

exports.likeOrDislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id).populate('author')

        if(!post) {
            return res.status(400).json({ error: 'Post not found'})
        }

        const postReaction = await PostReaction.findOne({post: post.id, author: req.userId})

        if(postReaction){
            await SendDataToUsers({req, key: 'dislike-post', data: postReaction})

            await postReaction.remove()
            
            post.num_heart -=1
            await post.save()            

            return res.status(200).json({message: 'Remove post reaction succesfully'})
        } else {

            const postReaction = new PostReaction({
                author: req.userId,
                post: post
            })

            const savedPostReaction = await postReaction.save()

            post.num_heart +=1
            await post.save()

            await SendDataToUsers({req, key: 'like-post', data: savedPostReaction})
            if(post.author.id !== req.userId){

                let notification = await CreateNotification({
                    author: req.userId,
                    receiver: post.author.id,
                    type: 'LIKE',
                    destination: '',
                    content: `${post.author.username} has liked your post`
                })
        
                if(post.author.socket_id) {
        
                    req.io
                        .to(post.author.socket_id)
                        .emit('notification', {data: notification})
                }
            }


            return res.status(200).json({message: 'Add post reaction succesfully', data: savedPostReaction})

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Something went wrong'})
    }
}

exports.createComment = async (req, res) => {
    try {
        const {post, content, parent} = req.body

        const post_obj = await Post.findById(post).populate('author')

        if(!post_obj) {
            error.post = 'Post not found'
        }

        error = {}

        if(!content|| content.trim().length === 0) {
            error.content = 'Content field must be require'
        }

        if(parent) {

            const parent_obj = await PostComment.findById(parent)
    
            if(!parent_obj) {
                error.parent = 'parent comment not found'
            }
        }


        if (Object.keys(error).length) {
            return res.status(422).json({error})
        }

        const comment = new PostComment({
            author: req.userId,
            post: post_obj.id,
            content: content,
            parent: parent
        })

        const saveComment = await comment.save()

        await SendDataToUsers({req, key: 'new-comment-post', data: saveComment})


        if(post_obj.author.id !== req.userId) {

            let notification = await CreateNotification({
                author: req.userId,
                receiver: post.author,
                type: 'COMMENT',
                destination: '',
                content: `${post_obj.author.username} has comment your post`
            })
    
            if(post_obj.author.socket_id) {
    
                req.io
                    .to(post_obj.author.socket_id)
                    .emit('notification', {data: notification})
            }
        }

        return res.status(200).json({message: 'Add comment succesfully', data: saveComment})

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Something went wrong'})
    }
}