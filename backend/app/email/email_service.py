import sib_api_v3_sdk
from pydantic import EmailStr
from sib_api_v3_sdk.rest import ApiException
from ..config import settings

# Configure API key authorization
configuration = sib_api_v3_sdk.Configuration()
configuration.api_key["api-key"] = settings.BREVO_API_KEY.get_secret_value()

# Create an instance of the API class
api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
    sib_api_v3_sdk.ApiClient(configuration)
)


async def send_email(
    to_email: EmailStr,
    subject: str,
    html_content: str,
    sender_name: str = "Ethan Cavill",
):
    sender = {"name": sender_name, "email": "noreply@deepworktimer.io"}
    to = [{"email": to_email}]
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=to, html_content=html_content, sender=sender, subject=subject
    )
    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        print(api_response)
    except ApiException as e:
        print(f"Exception when calling SMTPApi->send_transac_email: {e}")
        raise


async def send_verification_email(email: EmailStr, token: str):
    verification_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    subject = "Verify your Deep Work Timer email"
    html_content = f"""
    <html>
        <body>
            <h2>Verify your email address</h2>
            <p>Thank you for registering with Deep Work Timer. Please click the link below to verify your email address:</p>
            <p><a href="{verification_link}">Verify Email</a></p>
            <p>If you didn't request this, you can safely ignore this email.</p>
        </body>
    </html>
    """
    await send_email(email, subject, html_content)
