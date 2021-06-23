import frappe

def get_context(context):
	print(f"{frappe.form_dict}","frappe form_dict")
	try:
		url_param = frappe.form_dict['docname']
		context.property = frappe.get_doc("Property",url_param)
		context.agent = frappe.get_doc("Agent",context.property.agent)
	except Exception as e:
		frappe.local.flags.redirect_location = '/404'
		raise frappe.Redirect
	
	return context