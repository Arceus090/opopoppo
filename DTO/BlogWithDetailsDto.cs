using BisleriumBlog.Models;

namespace BisleriumBlog.DTO
{
    public class BlogWithDetailsDto
    {
        public Blog? Blog { get; set; }
        public string? Username { get; set; }
        public ICollection<Comment>? Comments { get; set; }
        public ICollection<Reaction>? Reactions { get; set; }

    }
}
