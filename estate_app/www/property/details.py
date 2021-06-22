import frappe

def get_context(context):
	context.property = frappe.get_doc("Property","000001")
	context.agent = frappe.get_doc("Agent",context.property.agent)
	return context