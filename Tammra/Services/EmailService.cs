using Mailjet.Client;
using Mailjet.Client.TransactionalEmails;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using Tammra.DTOs.Account;

namespace Tammra.Services
{
    public class EmailService
    {
        private readonly IConfiguration _congif;

        public EmailService(IConfiguration congif)
        {
            _congif = congif;
        }
        public async Task<bool> SendEmailAsync(EmailSendDto emailSend)
        {
            MailjetClient client = new MailjetClient(_congif["Mailjet:ApiKey"], _congif["Mailjet:SecretKey"]);

            var email = new TransactionalEmailBuilder()
                .WithFrom(new SendContact(_congif["Email:From"], _congif["Email:ApplicationName"]))
                .WithSubject(emailSend.Subject)
                .WithHtmlPart(emailSend.Body)
                .WithTo(new SendContact(emailSend.To))
                .Build();

            var Response = await client.SendTransactionalEmailAsync(email);
            if(Response.Messages != null)
            {
                if (Response.Messages[0].Status == "success")
                {
                    return true;
                }
            }
            return false;
        }
    }
}
