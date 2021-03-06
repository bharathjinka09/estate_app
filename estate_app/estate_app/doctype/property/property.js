// Copyright (c) 2021, bharath and contributors
// For license information, please see license.txt

frappe.ui.form.on('Property', {
	setup: function(frm){
		// check amenities duplicate
		frm.check_amenities_duplicate = function(frm,row){
			frm.doc.amenitiess.forEach(item=>{
				console.log({row})
				if(row.amenity=='' || row.idx==item.idx){
					// pass
				}else if(row.amenity==item.amenity){
					// clear field
					row.amenity = ''
					frappe.throw(`${item.amenity} already exists in the row ${item.idx}`)
					frm.refresh_field('amenitiess')
				}
			})
		}
		// check flat against outdoor kitchen
		frm.check_flat_against_outdoor_kitchen = function(frm,row){
			if(row.amenity == 'Outdoor Kitchen' && frm.doc.property_type=="Flat"){
					let amenity = row.amenity
					row.amenity = ''
					frappe.throw(`${amenity} cannot exist in a flat`)
					frm.refresh_field('amenitiess')
			}
		}

		// compute total
		frm.compute_total = function(frm){
			let total = 0
			// loop throgh child table
			frm.doc.amenitiess.forEach(d=>{
				total = total+d.amenity_price
			})
			// new total
			let new_total = frm.doc.property_price + total;
			if(frm.doc.discount){
				new_total = new_total - (new_total * (frm.doc.discount/100))
				console.log({new_total},"inside")

			}
			console.log({new_total})
			// set grand total
			frm.set_value('grand_total', new_total)
		},

		// copy discount to amenities
		frm.copy_discount = function(frm){
			frm.doc.amenitiess.forEach(d=>{
				d.discount = frm.doc.discount;
			})
			frm.refresh_field("amenitiess")
		}
	},
	refresh: function(frm) {
		// frm.add_custom_button('Say Hi', () => {
		// 	console.log("hi")
		// 	frappe.msgprint("Hi")
		// },"Actions");
		// frm.add_custom_button('Ping', () => {
		// 			console.log("ping")
		// },"Actions");
		// frm.add_custom_button('Pong', () => {
		// 			console.log("pong")
		// },"Actions");

		frm.add_custom_button('Update Address', () => {

			frappe.prompt('Address',({value}) => {
				if(value){
					frm.set_value('address', value)
					frm.refresh_field('address')
					frappe.msgprint(`Address updated with ${value} successfully!`)
				}
			})
		},"Actions");

		// check property types
		frm.add_custom_button('Check Property Types', () => {
			let property_type = frm.doc.property_type
			console.log(property_type)
			// make ajax call
			frappe.call({
				method: "estate_app.estate_app.doctype.property.api.check_property_types",
				args: {"property_type": property_type},
				callback: function(r){
					console.log(r,"API")
					if(r.message.length>0){
						let header = `<h3>Below property is of type ${property_type}</h3>`;
						let body = '';
						r.message.forEach(d=>{
							let cont = `<p>Name: ${d.name}: <a href='/app/property/${d.name}'>Visit</a></p>`
							body += cont
						})
						let all = header + body
						// message print
						frappe.msgprint(all)
					}
				}
			})
		},"Actions")
	},
	property_price: function(frm){
		frm.compute_total(frm)
	},
	discount: function(frm){
		frm.copy_discount(frm)
		frm.compute_total(frm)
	},

});

// Property Amenity Detail child table
frappe.ui.form.on("Property Amenity Detail",{
	amenity: function(frm,cdt,cdn){
		// grab entire record
		let row = locals[cdt][cdn]
		// console.log({row})
		frm.check_flat_against_outdoor_kitchen(frm, row)
		frm.check_amenities_duplicate(frm, row)
	}
})
