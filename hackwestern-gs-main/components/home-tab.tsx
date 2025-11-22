"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Bookmark, ImageIcon, Video, X } from "lucide-react"

interface Post {
  id: number
  username: string
  handle: string
  avatar: string
  timestamp: string
  content: string
  type: "text" | "image" | "video"
  media?: string
  likes: number
  comments: Comment[] // Added comments array to each post
  isLiked: boolean
  isSaved: boolean
}

interface Comment {
  id: number
  username: string
  handle: string
  avatar: string
  timestamp: string
  content: string
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    username: "Sarah M",
    handle: "@sarahinvests",
    avatar: "/woman-portrait.png",
    timestamp: "2h ago",
    content:
      "Just maxed out my TFSA for the year! 🎉 Feeling so proud of staying consistent with my monthly contributions. Who else is working on their 2025 goals?",
    type: "text",
    likes: 124,
    comments: [
      // Added initial comments
      {
        id: 1,
        username: "Emma Chen",
        handle: "@emmabudgets",
        avatar: "/serene-asian-woman.png",
        timestamp: "1h ago",
        content: "That's amazing! I'm working on maxing mine too. Halfway there! 💪",
      },
      {
        id: 2,
        username: "Maya Finance",
        handle: "@mayatalks",
        avatar: "/woman-with-stylish-glasses.png",
        timestamp: "45m ago",
        content: "Congratulations! Consistency is key. Keep it up!",
      },
    ],
    isLiked: false,
    isSaved: false,
  },
  {
    id: 2,
    username: "Emma Chen",
    handle: "@emmabudgets",
    avatar: "/serene-asian-woman.png",
    timestamp: "5h ago",
    content:
      "Created this visual budget tracker and it's been a game changer! Color coding makes it so much easier to see where my money goes 💰",
    type: "image",
    media: "/colorful-budget-spreadsheet.jpg",
    likes: 289,
    comments: [
      {
        id: 1,
        username: "Priya Shah",
        handle: "@priyasaves",
        avatar: "/serene-indian-woman.png",
        timestamp: "4h ago",
        content: "This looks great! Would you mind sharing the template?",
      },
    ],
    isLiked: true,
    isSaved: true,
  },
  {
    id: 3,
    username: "Maya Finance",
    handle: "@mayatalks",
    avatar: "/woman-with-stylish-glasses.png",
    timestamp: "8h ago",
    content:
      "Made a quick explainer on why I prefer ETFs over individual stocks for long-term investing. Check it out! 📊",
    type: "video",
    media: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    likes: 456,
    comments: [],
    isLiked: false,
    isSaved: false,
  },
  {
    id: 4,
    username: "Priya Shah",
    handle: "@priyasaves",
    avatar: "/serene-indian-woman.png",
    timestamp: "1d ago",
    content:
      "Question: When should I move from a high-interest savings account to investing? I have about $15k saved now and feel ready to take the next step but nervous! 😅",
    type: "text",
    likes: 92,
    comments: [
      {
        id: 1,
        username: "Sarah M",
        handle: "@sarahinvests",
        avatar: "/woman-portrait.png",
        timestamp: "20h ago",
        content: "You're ready! Start with broad market ETFs and dollar-cost average. You got this!",
      },
    ],
    isLiked: false,
    isSaved: false,
  },
]

interface HomeTabProps {
  onNavigateToProfile: (handle: string) => void
}

export function HomeTab({ onNavigateToProfile }: HomeTabProps) {
  const [posts, setPosts] = useState<Post[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("finance-app-posts")
      return saved ? JSON.parse(saved) : MOCK_POSTS
    }
    return MOCK_POSTS
  })
  const [newPost, setNewPost] = useState("")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null) // Track selected post for fullscreen view
  const [newComment, setNewComment] = useState("") // Track new comment input

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("finance-app-posts", JSON.stringify(posts))
    }
  }, [posts])

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        isLiked: !selectedPost.isLiked,
        likes: selectedPost.isLiked ? selectedPost.likes - 1 : selectedPost.likes + 1,
      })
    }
  }

  const handleSave = (postId: number) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, isSaved: !post.isSaved } : post)))
  }

  const handlePost = () => {
    if (newPost.trim()) {
      const newPostObj: Post = {
        id: Date.now(),
        username: "You",
        handle: "@yourusername",
        avatar: "/abstract-geometric-shapes.png",
        timestamp: "Just now",
        content: newPost,
        type: "text",
        likes: 0,
        comments: [],
        isLiked: false,
        isSaved: false,
      }
      setPosts([newPostObj, ...posts]) // Add new post to the beginning
      setNewPost("") // Clear input
    }
  }

  const handlePostComment = () => {
    if (newComment.trim() && selectedPost) {
      const newCommentObj: Comment = {
        id: Date.now(),
        username: "You",
        handle: "@yourusername",
        avatar: "/abstract-geometric-shapes.png",
        timestamp: "Just now",
        content: newComment,
      }

      const updatedPost = {
        ...selectedPost,
        comments: [newCommentObj, ...selectedPost.comments], // Add to beginning
      }

      setSelectedPost(updatedPost)
      setPosts(posts.map((post) => (post.id === selectedPost.id ? updatedPost : post)))
      setNewComment("") // Clear input
    }
  }

  if (selectedPost) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4">
          <Button variant="ghost" onClick={() => setSelectedPost(null)} className="mb-4 hover:bg-pink-50">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>

          {/* Post Content */}
          <Card className="p-6 border-pink-100 shadow-sm mb-6">
            <div className="flex gap-3">
              <Avatar className="w-12 h-12 cursor-pointer" onClick={() => onNavigateToProfile(selectedPost.handle)}>
                <AvatarImage src={selectedPost.avatar || "/placeholder.svg"} />
                <AvatarFallback>{selectedPost.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="font-semibold text-foreground cursor-pointer hover:underline"
                    onClick={() => onNavigateToProfile(selectedPost.handle)}
                  >
                    {selectedPost.username}
                  </span>
                  <span className="text-sm text-muted-foreground">{selectedPost.handle}</span>
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">{selectedPost.timestamp}</span>
                </div>

                <p className="text-foreground mb-4 text-pretty text-lg">{selectedPost.content}</p>

                {selectedPost.type === "image" && selectedPost.media && (
                  <img
                    src={selectedPost.media || "/placeholder.svg"}
                    alt="Post content"
                    className="rounded-lg border border-border w-full mb-4"
                  />
                )}

                {selectedPost.type === "video" && selectedPost.media && (
                  <div className="relative rounded-lg overflow-hidden border border-border mb-4 aspect-video">
                    <iframe
                      src={selectedPost.media}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div className="flex items-center gap-6 py-3 border-t border-b border-gray-200">
                  <button
                    onClick={() => handleLike(selectedPost.id)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Heart className={`w-6 h-6 ${selectedPost.isLiked ? "fill-primary text-primary" : ""}`} />
                    <span className="text-base">{selectedPost.likes}</span>
                  </button>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-base">{selectedPost.comments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Comment Input */}
          <Card className="p-4 border-pink-100 shadow-sm mb-6">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/abstract-geometric-shapes.png" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none border-border"
                />
                <div className="flex justify-end">
                  <Button onClick={handlePostComment} className="bg-primary hover:bg-primary/90 text-white">
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Comments ({selectedPost.comments.length})</h3>
            {selectedPost.comments.map((comment) => (
              <Card key={comment.id} className="p-4 border-gray-200">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10 cursor-pointer" onClick={() => onNavigateToProfile(comment.handle)}>
                    <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{comment.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="font-semibold text-foreground cursor-pointer hover:underline"
                        onClick={() => onNavigateToProfile(comment.handle)}
                      >
                        {comment.username}
                      </span>
                      <span className="text-sm text-muted-foreground">{comment.handle}</span>
                      <span className="text-sm text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-foreground text-pretty">{comment.content}</p>
                  </div>
                </div>
              </Card>
            ))}
            {selectedPost.comments.length === 0 && (
              <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card className="p-4 border-border shadow-sm">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/abstract-geometric-shapes.png" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[80px] resize-none border-border"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Image
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </Button>
              </div>
              <Button onClick={handlePost} className="bg-primary hover:bg-primary/90 text-white">
                Post
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="p-4 border-border shadow-sm hover:border-pink-200 transition-colors cursor-pointer"
            onClick={() => setSelectedPost(post)} // Open fullscreen on click
          >
            <div className="flex gap-3">
              <Avatar
                className="w-10 h-10 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigateToProfile(post.handle)
                }}
              >
                <AvatarImage src={post.avatar || "/placeholder.svg"} />
                <AvatarFallback>{post.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-semibold text-foreground hover:underline"
                    onClick={(e) => {
                      e.stopPropagation()
                      onNavigateToProfile(post.handle)
                    }}
                  >
                    {post.username}
                  </span>
                  <span className="text-sm text-muted-foreground">{post.handle}</span>
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                </div>

                <p className="text-foreground mb-3 text-pretty">{post.content}</p>

                {post.type === "image" && post.media && (
                  <img
                    src={post.media || "/placeholder.svg"}
                    alt="Post content"
                    className="rounded-lg border border-border w-full mb-3"
                  />
                )}

                {post.type === "video" && post.media && (
                  <div className="relative rounded-lg overflow-hidden border border-border mb-3 aspect-video">
                    <iframe
                      src={post.media}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div className="flex items-center gap-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLike(post.id)
                    }}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? "fill-primary text-primary" : ""}`} />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.comments.length}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSave(post.id)
                    }}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ml-auto"
                  >
                    <Bookmark className={`w-5 h-5 ${post.isSaved ? "fill-primary text-primary" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
