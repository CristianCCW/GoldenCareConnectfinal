from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactInquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="new")  # new, read, responded

class ContactInquiryCreate(BaseModel):
    name: str
    email: str
    message: str

class ContactInquiryResponse(BaseModel):
    id: str
    name: str
    email: str
    message: str
    timestamp: datetime
    status: str

# Email configuration (to be set up later)
def send_email_notification(contact_data: ContactInquiry):
    """
    Send email notification when new contact form is submitted.
    Configure SMTP settings in .env file:
    EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, NOTIFICATION_EMAIL
    """
    try:
        # Get email configuration from environment
        email_host = os.environ.get('EMAIL_HOST')
        email_port = os.environ.get('EMAIL_PORT', 587)
        email_user = os.environ.get('EMAIL_USER')
        email_password = os.environ.get('EMAIL_PASSWORD')
        notification_email = os.environ.get('NOTIFICATION_EMAIL')
        
        if not all([email_host, email_user, email_password, notification_email]):
            logging.warning("Email configuration not complete. Skipping email notification.")
            return
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = email_user
        msg['To'] = notification_email
        msg['Subject'] = f"New Contact Form Submission - Golden Care Connect"
        
        body = f"""
        New contact form submission received:
        
        Name: {contact_data.name}
        Email: {contact_data.email}
        Message: {contact_data.message}
        Submitted: {contact_data.timestamp.strftime('%Y-%m-%d %H:%M:%S')}
        
        Please respond to this inquiry promptly.
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        server = smtplib.SMTP(email_host, int(email_port))
        server.starttls()
        server.login(email_user, email_password)
        text = msg.as_string()
        server.sendmail(email_user, notification_email, text)
        server.quit()
        
        logging.info(f"Email notification sent for contact inquiry: {contact_data.id}")
        
    except Exception as e:
        logging.error(f"Failed to send email notification: {str(e)}")

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Golden Care Connect API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/contact", response_model=ContactInquiryResponse)
async def submit_contact_form(input: ContactInquiryCreate):
    """Submit a new contact form inquiry"""
    try:
        # Create contact inquiry object
        contact_dict = input.dict()
        contact_obj = ContactInquiry(**contact_dict)
        
        # Save to database
        result = await db.contact_inquiries.insert_one(contact_obj.dict())
        
        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Failed to save contact inquiry")
        
        # Send email notification (in background)
        try:
            send_email_notification(contact_obj)
        except Exception as e:
            logging.error(f"Email notification failed: {str(e)}")
            # Don't fail the API call if email fails
        
        # Return success response
        return ContactInquiryResponse(**contact_obj.dict())
        
    except Exception as e:
        logging.error(f"Error submitting contact form: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit contact form")

@api_router.get("/contact", response_model=List[ContactInquiryResponse])
async def get_contact_inquiries(status: Optional[str] = None):
    """Get all contact inquiries, optionally filtered by status"""
    try:
        query = {}
        if status:
            query["status"] = status
            
        contact_inquiries = await db.contact_inquiries.find(query).sort("timestamp", -1).to_list(1000)
        return [ContactInquiryResponse(**inquiry) for inquiry in contact_inquiries]
        
    except Exception as e:
        logging.error(f"Error retrieving contact inquiries: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve contact inquiries")

@api_router.put("/contact/{inquiry_id}/status")
async def update_contact_status(inquiry_id: str, status: str):
    """Update the status of a contact inquiry"""
    try:
        result = await db.contact_inquiries.update_one(
            {"id": inquiry_id},
            {"$set": {"status": status}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Contact inquiry not found")
            
        return {"message": "Status updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating contact status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update status")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()