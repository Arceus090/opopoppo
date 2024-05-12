using BisleriumBlog.DTO;
using BisleriumBlog.Interface;
using BisleriumBlog.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace BisleriumBlog.Services
{
    public class ReactionService : IReactionService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IHubContext<NotificationHub> _hubContext;

        public ReactionService(ApplicationDbContext dbContext, IHubContext<NotificationHub> hubContext)
        {
            _dbContext = dbContext;
            _hubContext = hubContext;
        }


        public async Task<Reaction> CreateReaction(string userId, Guid? blogId, Guid? commentId, ReactionType reactionType)
        {
            var existingReaction = await _dbContext.Reactions.FirstOrDefaultAsync(r =>
                r.UserId == userId &&
                r.BlogId == blogId &&
                r.CommentId == commentId);

            if (existingReaction != null)
            {
                // Check if the existing reaction type is the same as the new one
                if (existingReaction.ReactionType == reactionType)
                {
                    // If the new reaction type is the same, remove the existing reaction
                    _dbContext.Reactions.Remove(existingReaction);
                    await _dbContext.SaveChangesAsync();
                    return null; // Indicate that the reaction has been undone
                }
                else
                {
                    // If the new reaction type is different, update the existing reaction type
                    existingReaction.ReactionType = reactionType;
                    await _dbContext.SaveChangesAsync();
                    return existingReaction;
                }
            }

            // If no existing reaction found, create a new one
            var reaction = new Reaction
            {
                ReactionId = Guid.NewGuid(),
                UserId = userId,
                BlogId = blogId,
                CommentId = commentId,
                ReactionType = reactionType,
                CreatedAt = DateTime.UtcNow
            };
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", "A vote has been made.");
            try
            {
                _dbContext.Reactions.Add(reaction);
                await _dbContext.SaveChangesAsync();
                return reaction;
            }
            catch (DbUpdateException ex)
            {
                // Handle unique constraint violation
                if (ex.InnerException is Microsoft.Data.SqlClient.SqlException sqlException && sqlException.Number == 2601)
                {
                    // Unique constraint violation
                    throw new InvalidOperationException("You have already voted on this post, comment, or reply.");
                }
                throw;
            }
        }

        public async Task RemoveReaction(string userId, Guid reactionId)
        {
            var reaction = await _dbContext.Reactions.FirstOrDefaultAsync(r => r.ReactionId == reactionId && r.UserId == userId);

            if (reaction != null)
            {
                _dbContext.Reactions.Remove(reaction);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                throw new InvalidOperationException("Reaction not found or you are not authorized to remove this reaction.");
            }
        }

        public async Task UpdateReactionType(string userId, Guid reactionId, ReactionType newReactionType)
        {
            var reaction = await _dbContext.Reactions.FirstOrDefaultAsync(r => r.ReactionId == reactionId && r.UserId == userId);

            if (reaction != null)
            {
                reaction.ReactionType = newReactionType;
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                throw new InvalidOperationException("Reaction not found or you are not authorized to update this reaction.");
            }
        }

        public async Task<Reaction> GetReactionById(Guid reactionId)
        {
            return await _dbContext.Reactions.FindAsync(reactionId);
        }
    }
}
