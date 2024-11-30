import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import requests
import os
from pathlib import Path

def send_email(subject, body, to):
  msg = MIMEMultipart()
  
  msg['Subject'] = subject
  msg['From'] = "welcome@mail.houseofmodels.ai"
  msg['To'] = to
  
  msg.attach(MIMEText(body, 'html'))

  # Connect to the Amazon SES SMTP server
  server = smtplib.SMTP('email-smtp.us-east-1.amazonaws.com', 587)
  server.starttls()

  # Login to the SMTP server
  server.login("AKIAYVVFJWOC3CPMI66A", "BGIJO+SQKaoYHSmOtBAmY9gadbzbFYm/wb41BOHWDw1o")

  # Send the email
  server.sendmail("welcome@mail.houseofmodels.ai", to, msg.as_string())

  # Close the connection to the SMTP server
  server.quit()
  


def send_email_with_attachments(subject, body, to, image_urls):
  print(image_urls, "image_urls")
  msg = MIMEMultipart()
  msg['Subject'] = subject
  msg['From'] = "House of Models <generations@mail.houseofmodels.ai>"
  msg['To'] = to

  msg.attach(MIMEText(body, "html"))

  for url in image_urls:
    filename = Path(url).name
    response = requests.get(url)
    with open(filename, 'wb') as file:
      file.write(response.content)

    with open(filename, 'rb') as file:
      part = MIMEBase('application', 'octet-stream')
      part.set_payload(file.read())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', 'attachment', filename=filename)
    msg.attach(part)
    
    os.remove(filename)

  # Connect to the Amazon SES SMTP server
  server = smtplib.SMTP('email-smtp.us-east-1.amazonaws.com', 587)
  server.starttls()

  # Login to the SMTP server
  server.login("AKIAYVVFJWOC3CPMI66A", "BGIJO+SQKaoYHSmOtBAmY9gadbzbFYm/wb41BOHWDw1o")

  # Send the email
  server.sendmail("generations@mail.houseofmodels.ai", to, msg.as_string())

  # Close the connection to the SMTP server
  server.quit()