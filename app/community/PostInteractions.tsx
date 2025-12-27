"use client";

import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Share2, Send } from "lucide-react";
import { useState } from "react";
import { toggleLike, addComment, sharePost } from "@/app/community/actions";

type Props = {
    postId: number;
    initialLikes: number;
    initialComments: number;
    initialShares: number;
    isLiked?: boolean;
};

export function PostInteractions({
    postId,
    initialLikes,
    initialComments,
    initialShares,
    isLiked = false,
}: Props) {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(isLiked);
    const [commentsCount, setCommentsCount] = useState(initialComments);
    const [sharesCount, setSharesCount] = useState(initialShares);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentText, setCommentText] = useState("");

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
        setShowCommentInput(false);

        await addComment(postId, text);
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
                <div className="flex gap-2 items-center animate-in fade-in slide-in-from-top-2">
                    <input
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                        autoFocus
                    />
                    <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleCommentSubmit}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}