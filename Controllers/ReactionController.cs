using BisleriumBlog.Interface;
using BisleriumBlog.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BisleriumBlog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReactionController : ControllerBase
    {
        private readonly IReactionService _reactionService;

        public ReactionController(IReactionService reactionService)
        {
            _reactionService = reactionService;
        }

        [HttpPost("blog/{blogId}/upvote")]
        [Authorize]
        public async Task<IActionResult> UpvoteBlog(Guid blogId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var reaction = await _reactionService.CreateReaction(userId, blogId, null, ReactionType.Upvote);
                return Ok(reaction);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("blog/{blogId}/downvote")]
        [Authorize]
        public async Task<IActionResult> DownvoteBlog(Guid blogId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var reaction = await _reactionService.CreateReaction(userId, blogId, null, ReactionType.Downvote);
                return Ok(reaction);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("comment/{commentId}/upvote")]
        [Authorize]
        public async Task<IActionResult> UpvoteComment(Guid commentId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var reaction = await _reactionService.CreateReaction(userId, null, commentId, ReactionType.Upvote);
                return Ok(reaction);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("comment/{commentId}/downvote")]
        [Authorize]
        public async Task<IActionResult> DownvoteComment(Guid commentId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var reaction = await _reactionService.CreateReaction(userId, null, commentId, ReactionType.Downvote);
                return Ok(reaction);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
