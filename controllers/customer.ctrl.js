const Customer = require('../models/customer');
// const PersonalDetails = require('../models/personalDetails');

const customerDbController = {

    // async getLocalId(id){
    //     Customer.findOne({ "freelancer_api_id":id}) 
    //     .then(docs => { console.log(docs); return {"ok":ok}})
    //     .catch(err => console.log(`Error getting data from DB: ${err}`));
    // },

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
        Customer.findOne({}).sort({ _id: -1 }).limit(1)
            .then((lastid) => {
                let id = lastid.personal_details.id;
                const newCustomer = new Customer({
                    'personal_details': {
                        'id': id + 1,
                        'first_name': req.body.first_name,
                        'last_name': req.body.last_name,
                        'email': req.body.email,
                        'address': req.body.address,
                        'phone': req.body.phone,
                        'linkedin': req.body.linkedin,
                        'facebook': req.body.facebook,

                    },
                    "freelancer_api_id": req.body.freelancer_api_id,
                    "freelancer_api_username": req.body.freelancer_api_username,
                    'jobs_id': []
                })

                newCustomer.save()
                    .then((response) => { res.json(response); })
                    .catch((err) => { res.status(404).send(`Error saving a new customer + ${err}`); })
            })
            .catch((err) => { res.status(404).send("Error finding last customer id"); })

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
};

const getLocalId = async (id) => {
    Customer.findOne({ freelancer_api_id: id })
        .then(docs => { return docs })
        .catch(err => console.log(`Error getting data from DB: ${err}`));
};


module.exports = { getLocalId, customerDbController };

/*
to push to array
{
    "$push": { "jobs_id": 5 }
}
*/
