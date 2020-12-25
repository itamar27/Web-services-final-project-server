const freelancer = require('../models/freelancer');

exports.freeLancerDbController = {
    getFreelancers(req, res) {
        freelancer.find({})
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error getting freelancers data from db: ${err}`));
    },

    getFreelancer(req, res) {
        freelancer.findOne({ id: req.params.id })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error getting freelancer data from db: ${err}`));
    },

    addFreelancer(req, res) {
        const newFreelancer = new freelancer({
            'personal_details' : {
                'id': this.lastId() + 1,
                'first_name': req.params.first_name,
                'last_name': req.params.last_name,
                'email': req.params.email,
                'address' : req.params.address,
                'phone' : req.params.phone,
                'linkedin' : req.params.linkedin,
                'facebook' : req.params.facebook
            },
            'skills': {
                'work_experience': req.params.work_experience,
                'work_history': req.params.work_history,
                'programming_languages': req.params.work_fields,
                'work_fields': req.params.work_fields
            },
            'jobs':null,
        });
        const result = newFreelancer.save();

        if (result) {
            res.json(result)
        } else {
            res.status(404).send("Error saving a restaurant");
        }
    },

    updateFreelancer(req, res) {
        freelancer.findOneAndUpdate({ id: req.params }, req.body, { new: true })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error updating freelancer from db: ${err}`))
    },

    deleteFreelancer(req, res) {
        freelancer.deleteOne({ id: req.params.id })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error deleting freelancer from db: ${err}`));
    },

    /*
     * Last id retrieve function;
     */
    lastId(req,res){

        const id = Customer.findOne({}, {}, {sort: {'id' : -1}}).id;
        return id;
    }
} 
