const Post = require("../../models/Post");
const PostComment = require("../../models/PostComment");
const PostReaction = require("../../models/PostReaction");
const FilterPostData = require("../../utils/FilterPostData");


exports.fetchPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id).populate('author').populate('foods')

        if (!post) {
            return res.status(400).json({ error: 'Not found' })
        }

        const comments = await PostComment.find({ post }).populate('author').populate('childrent')

        // const post_data = FilterPostData(post)

        return res.status(200).json({
            post: post,
            comments: comments,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

exports.fetchAllPost = async (req, res) => {
    let page = parseInt(req.query.page || 0)
    let limit = 10

    try {
        const posts = await Post.find({ is_public: true })
            .sort({ num_heart: -1, created_at: -1 })
            .limit(limit)
            .skip(page * limit)
            .populate('author')
            .populate('foods')
        //const postData = posts.map((post) => FilterPostData(post))

        const totalCount = await Post.estimatedDocumentCount().exec()
        const paginationData = {
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalPosts: totalCount
        }
        res.status(200).json({ posts: posts, pagination: paginationData })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

exports.fetchAllComment = async (req, res) => {
    let page = parseInt(req.query.page || 0)
    let limit = 10

    try {
        const comments = await PostComment.find({ post: req.params.post_id, parent: null })
            .sort({ created_at: -1 })
            .limit(limit)
            .skip(page * limit)
            .populate({ path: 'children', populate: { path: 'author' } })
            .populate('author')

        //const filterComments = comments.map((comment) => FilterCommentData(comment))
        const totalCount = await PostComment.countDocuments({ post: req.params.post_id, parent: null })

        const paginationData = {
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalComments: totalCount,
        }
        res
            .status(200)
            .json({ comments: comments, pagination: paginationData })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

exports.fetchAllReaction = async (req, res) => {

    try {
        const reacts = await Post.findById(req.params.post_id)
            .populate('reactions')
            .select('reactions')

        //const filterComments = comments.map((comment) => FilterCommentData(comment))
        // const totalCount = await PostReaction.countDocuments({ post: req.params.post_id })

        // const paginationData = {
        //     currentPage: page,
        //     totalPage: Math.ceil(totalCount / limit),
        //     totalReactions: totalCount,
        // }
        res
            .status(200)
            .json({ reacts: reacts})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Something went wrong" })
    }

}

exports.fetchTrendingPost = async (req, res) => {
    let page = parseInt(req.query.page || 0)
    let limit = 10

    try {
        const posts = await Post.find({ is_public: true })
            .sort({ num_heart: -1, created_at: 1 })
            .limit(limit)
            .skip(page * limit)
            .populate('author')
            .populate('foods')

        //const filterPosts = posts.map((comment) => FilterPostData(comment))
        const totalCount = await Post.countDocuments({ is_public: true })

        const paginationData = {
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalPosts: totalCount,
        }
        res
            .status(200)
            .json({ posts: posts, pagination: paginationData })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
}


exports.fetchUserPost = async (req, res) => {
    let page = parseInt(req.query.page || 0)
    let limit = 10

    try {
        const posts = await Post.find({ author: req.params.user_id })
            .sort({ created_at: -1 })
            .limit(limit)
            .skip(page * limit)
            .populate('author')
            .populate('foods')

        //const filterPosts = posts.map((comment) => FilterPostData(comment))
        const totalCount = await Post.countDocuments({ author: req.params.user_id })

        const paginationData = {
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalPosts: totalCount,
        }
        res
            .status(200)
            .json({ posts: posts, pagination: paginationData })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

exports.fetchCloseLocation = async (req, res) => {
    let page = parseInt(req.query.page || 0)
    let limit = 10

    try {
        const location = req.query.location
        const posts = await Post.find({ is_public: true })
            .sort({ created_at: 1 })
            .limit(limit)
            .skip(page * limit)
            .populate('author')
            .populate('foods')

        const postsData = FindCloseLocation(location, posts)

        //const filterPosts = postsData.map((comment) => FilterPostData(comment))
        const totalCount = await Post.countDocuments({ author: req.userId })

        const paginationData = {
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalPosts: totalCount,
        }
        res
            .status(200)
            .json({ posts: postsData, pagination: paginationData })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
}
