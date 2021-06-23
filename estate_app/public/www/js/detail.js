document.querySelector("#contact").addEventListener("click",
	(e)=>{

		let agent_email = document.querySelector("#email").value;
		let property_name = document.querySelector("#property_name").textContent;
		
		
		console.log("click")
		let d = new frappe.ui.Dialog({
				    title: 'Enter details',
				    fields: [
				        {
				            label: 'Your Name',
				            fieldname: 'name',
				            fieldtype: 'Data'
				        },
				        {
				            label: 'Your Email',
				            fieldname: 'email',
				            fieldtype: 'Data'
				        },
				        {
				            label: 'Message',
				            fieldname: 'message',
				            fieldtype: 'Small Text'
				        }
				    ],
				    primary_action_label: 'Submit',
				    primary_action(values) {
				    	values.agent_email = agent_email
				    	values.property_name = property_name
				        console.log(values);
				        // api call
				        frappe.call({
				        	method:"estate_app.api.contact_agent",
				        	args: values,
				        	callback: function(r) {
				        		// body...
				        		console.log({r},';kgfgh')
				        		frappe.msgprint(r.message)
				        		// alert(r.message)
				        	}
				        })
				        d.hide();
				    }
				});

				d.show();

	}
)
