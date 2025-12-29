"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, MessageSquare, Share2, Send, X, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toggleLike, addComment, sharePost, deleteComment, editComment } from "@/app/community/actions";

type Comment = {
    id: number;
    content: string;
    authorId: number;
    authorName: string;
    authorAvatar: string | null;
    formattedTime: string;
};

type Props = {
    postId: number;
    initialLikes: number;
    initialComments: number;
    initialShares: number;
    isLiked?: boolean;
    comments: Comment[];
    currentUser: {
        name: string;
        avatar: string | null;
    };
    currentUserId: number;
};

export function PostInteractions({
    postId,
    initialLikes,
    initialComments,
    initialShares,
    isLiked = false,
    comments,
    currentUser,
    currentUserId,
}: Props) {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(isLiked);
    const [commentsCount, setCommentsCount] = useState(initialComments);
    const [sharesCount, setSharesCount] = useState(initialShares);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [optimisticComments, setOptimisticComments] = useState(comments);
    const [visibleComments, setVisibleComments] = useState(3);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        setOptimisticComments(comments);
    }, [comments]);

    const handleLike = async () => {
        // Optimistic update
        const isNowLiked = !liked;
        setLiked(isNowLiked);
        setLikes((prev) => (isNowLiked ? prev + 1 : prev - 1));

        try {
            await toggleLike(postId);
        } catch (error) {
            // Revert if failed
            setLiked(!isNowLiked);
            setLikes((prev) => (!isNowLiked ? prev + 1 : prev - 1));
        }
    };

    const handleShare = async () => {
        setSharesCount((prev) => prev + 1);
        await sharePost(postId);
        navigator.clipboard.writeText(`${window.location.origin}/community?post=${postId}`);
    };

    const handleCommentSubmit = async () => {
        if (!commentText.trim()) return;

        setCommentsCount((prev) => prev + 1);
        const text = commentText;
        setCommentText("");

        // Optimistic update: Add comment to list immediately
        const newComment = {
            id: Date.now(), // Temporary ID
            content: text,
            authorId: currentUserId,
            authorName: currentUser.name,
            authorAvatar: currentUser.avatar,
            formattedTime: "Just now",
        };
        setOptimisticComments((prev) => [newComment, ...prev]);

        await addComment(postId, text);
    };

    const handleDeleteComment = async (commentId: number) => {
        setOptimisticComments((prev) => prev.filter((c) => c.id !== commentId));
        setCommentsCount((prev) => prev - 1);
        await deleteComment(commentId);
    };

    const startEditing = (comment: Comment) => {
        setEditingId(comment.id);
        setEditText(comment.content);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditText("");
    };

    const saveEdit = async (commentId: number) => {
        if (!editText.trim()) return;
        setOptimisticComments((prev) =>
            prev.map((c) => (c.id === commentId ? { ...c, content: editText } : c))
        );
        setEditingId(null);
        await editComment(commentId, editText);
    };

    return (
        <div className="flex flex-col gap-3 border-t pt-3">
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        className={`gap-1.5 group ${liked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                    >
                        <ThumbsUp className={`h-4 w-4 transition-transform group-hover:scale-110 ${liked ? "fill-current" : ""}`} />
                        <span>{likes}</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCommentInput(!showCommentInput)}
                        className="gap-1.5 text-muted-foreground hover:text-primary group"
                    >
                        <MessageSquare className="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span>{commentsCount}</span>
                    </Button>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="gap-1.5 text-muted-foreground hover:text-primary group"
                >
                    <Share2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <span>{sharesCount}</span>
                </Button>
            </div>

            {showCommentInput && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 mt-4">
                    <div className="flex gap-3 items-start">
                        <Avatar className="h-8 w-8 mt-1">
                            {currentUser.avatar && <AvatarImage src={currentUser.avatar} />}
                            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 relative">
                            <input
                                className="flex h-10 w-full rounded-2xl border border-input bg-muted/30 px-4 py-2 pr-12 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder={`Write a comment as ${currentUser.name}...`}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                                autoFocus
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-primary hover:bg-transparent"
                                onClick={handleCommentSubmit}
                                disabled={!commentText.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        {optimisticComments.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                <p className="text-sm">No comments yet.</p>
                                <p className="text-xs mt-1">Be the first to start the conversation!</p>
                            </div>
                        ) : (
                            <>
                                {optimisticComments.slice(0, visibleComments).map((comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <Avatar className="h-8 w-8 shrink-0">
                                            {comment.authorAvatar && <AvatarImage src={comment.authorAvatar} />}
                                            <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-1 max-w-[90%]">
                                            <div className="bg-muted/40 rounded-2xl rounded-tl-none px-4 py-2.5 group/comment relative">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-foreground/90">{comment.authorName}</span>
                                                    <span className="text-[10px] text-muted-foreground">{comment.formattedTime}</span>
                                                </div>

                                                {editingId === comment.id ? (
                                                    <div className="flex flex-col gap-2">
                                                        <input
                                                            className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") saveEdit(comment.id);
                                                                if (e.key === "Escape") cancelEditing();
                                                            }}
                                                        />
                                                        <div className="flex gap-2 justify-end">
                                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={cancelEditing}>
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-green-500" onClick={() => saveEdit(comment.id)}>
                                                                <Check className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 px-2">
                                                <button className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">Like</button>
                                                <button className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">Reply</button>
                                                {comment.authorId === currentUserId && editingId !== comment.id && (
                                                    <>
                                                        <button className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors" onClick={() => startEditing(comment)}>Edit</button>
                                                        <button className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {optimisticComments.length > visibleComments && (
                                    <Button
                                        variant="link"
                                        className="text-xs text-muted-foreground self-start p-0 h-auto font-normal"
                                        onClick={() => setVisibleComments((prev) => prev + 5)}
                                    >
                                        View {optimisticComments.length - visibleComments} more comments
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}