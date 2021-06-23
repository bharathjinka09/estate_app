import frappe
# from frappe.utils.pdf import get_pdf,cleanup
from estate_app.utils import sendmail


# (doc, recipients, msg, title, attachments=None)

# email agent from property page
@frappe.whitelist()
def contact_agent(**args):
    print("\n\n\n\n", args.get('property_name'), args['property_name'])
    doc = frappe.get_doc("Property", args.get('property_name'))
    msg = f"From: {args.get('name')} <br>Email: {args.get('email')} <br> {args.get('message')}"
    attachments = [frappe.attach_print(doc.doctype, doc.name, file_name=doc.name),]
    sendmail(doc, [args.get('agent_email')], msg=msg, title="Property Enquiry", attachments=attachments)

    return "Message sent to agent, you'll get response as soon as possible. <br>Thank you."