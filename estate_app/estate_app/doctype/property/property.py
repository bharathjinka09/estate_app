# Copyright (c) 2021, bharath and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Property(Document):
	def after_insert(self):
		frappe.msgprint(f"Document <b>{self.name}</b> inserted successfully!")
	# validate
	def validate(self):
		if(self.property_type=="Apartment"):
			for amenity in self.amenitiess:
				if(amenity.amenity=="Outdoor Kitchen"):
					frappe.throw(f"Property of type <b>Apartment</b> shouldn't have amenity <b>{amenity.amenity}</b>")
			
			# or SQL Query
			# amenity = frappe.db.sql(f"""SELECT amenity FROM `tabProperty Amenity Detail` WHERE parent='{self.name}' AND parenttype='Property' AND amenity='Outdoor Kitchen'""",as_dict=True)
			# print(amenity,"Amenity.......")
			# if(amenity):
			# 	frappe.throw(f"Property of type <b>Apartment</b> shouldn't have amenity <b>{amenity[0].amenity}</b>")