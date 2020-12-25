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

    addCustomer(req, res) {

        const newCustomer = new Customer({

            'personal_details': {
                'id': this.lastId() + 1,
                'first_name': req.params.first_name,
                'last_name': req.params.last_name,
                'email': req.params.email,
                'address': req.params.address,
                'phone': req.params.phone,
                'linkedin': req.params.linkedin,
                'facebook': req.params.facebook
            },

            'jobs_id': null
        })

        const result = newCustomer.save();

        if (result) {
            res.json(result);
        }
        else {
            res.status(404).send("Error saving a new customer");

        }

    },

    updateCustomer(req, res) {

        Customer.findOneAndUpdate({ id: req.params }, req.body, { new: true })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error updating customer from db: ${err}`))
    },

    deleteCustomer(req, res) {

        Customer.deleteOne({ id: req.params.id })
            .then(docs => res.json(docs))
            .catch(err => console.log(`Error deleting restaurant from db: ${err}`));
    },

    /*
     * Last id retrieve function;
     */
    lastId(req, res) {

        const id = Customer.findOne({}, {}, { sort: { 'id': -1 } }).id;
        return id;
    }


}
