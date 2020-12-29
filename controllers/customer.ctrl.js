const Customer = require('../models/customer');
const PersonalDetails = require('../models/personalDetails');

exports.customerDbController = {

    getCustomers(req, res) {
        Customer.find({})
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error retreiving data from DB: ${err}`));
    },

    getCustomer(req, res) {
        Customer.findOne({ "personal_details.id": req.params.id }) 
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error getting data from DB: ${err}`));
    },

    async addCustomer(req, res) {
        const item = await Customer.findOne({}).sort({ _id: -1 }).limit(1);
        let id = item.personal_details.id;
        const newCustomer = new Customer({
            'personal_details':{
                'id': id + 1,
                'first_name': req.body.first_name,
                'last_name': req.body.last_name,
                'email': req.body.email,
                'address': req.body.address,
                'phone': req.body.phone,
                'linkedin': req.body.linkedin,
                'facebook': req.body.facebook
            },
            'jobs_id': []
        })

        // check if we want to wait for respone in order to send back
        const result = newCustomer.save();

        if (result) {
            res.json(result);
        }
        else {
            res.status(404).send("Error saving a new customer");

        }
 
    },

    updateCustomer(req, res) {

        //need to add process to body

        Customer.findOneAndUpdate({ "personal_details.id": req.params.id }, req.body, { new: true })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error updating customer from db: ${err}`))
    },

    deleteCustomer(req, res) {

        Customer.deleteOne({ "personal_details.id": req.params.id })
            .then(docs => res.json(docs))
            .catch(err => console.log(`Error deleting restaurant from db: ${err}`));
    },
}


/*
to push to array
{
    "$push": { "jobs_id": 5 } 
}
*/
