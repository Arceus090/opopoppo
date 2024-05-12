using Microsoft.AspNetCore.SignalR;

namespace BisleriumBlog.DTO
{
    public class NotificationHub : Hub
    {
        public async Task SendNotification(string message)
        {
            await Clients.All.SendAsync("ReceiveNotification", message); // Send notification to all connected clients
        }
    }
}
