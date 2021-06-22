import frappe
from estate_app.utils import sendmail

def validate(doc,event):
	# print(f"\n\n\n\n{doc}:{event}")
	# frappe.throw("Error occured!")
	pass

def on_update(doc,event):
	print(f"\n\n\n\n{doc}:{event}","doc : event")
	frappe.msgprint(f"{doc.name} has been updated by {doc.owner}")
	
def after_insert(doc,event):
	# create note on property insert
	note = frappe.get_doc({
		'doctype':'Note',
		'title':f"{doc.name} Added",
		'public':True,
		'content': doc.description
	})
	note.insert()
	frappe.db.commit()
	frappe.msgprint(f"{note.title} has been created!")
	# send mail
	# doc, recipients,msg,title,attachments=None
	agent_email = frappe.get_doc("Agent", doc.agent)
	msg = f"Hello <b>{doc.agent_name}, a property has been created on your behalf.</b>"
	attachments = [frappe.attach_print(doc.doctype, doc.name, file_name=doc.name),]
	sendmail(doc,[agent_email,'test@mail.com'],msg,'New property',attachments)
