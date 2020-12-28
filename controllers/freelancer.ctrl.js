const freelancer = require('../models/freelancer');

exports.freeLancerDbController = {
  
    getFreelancers(req, res) {
        freelancer.find({})
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error getting freelancers data from db: ${err}`));
    },

    getFreelancer(req, res) {
        freelancer.findOne({ "personal_details.id": req.params.id })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error getting freelancer data from db: ${err}`));
    }, 

    async addFreelancer(req, res) {
        const item = await Customer.findOne({}).sort({ _id: -1 }).limit(1);
        let id = item.personal_details.id;
        const newFreelancer = new freelancer({
            'personal_details' : {
                'id':  id + 1,
                'first_name': req.body.first_name,
                'last_name': req.body.last_name,
                'email': req.body.email,
                'address' : req.body.address,
                'phone' : req.body.phone,
                'linkedin' : req.body.linkedin,
                'facebook' : req.body.facebook
            },
            'skills': {
                'work_experience': req.body.work_experience,
                'work_history': req.body.work_history,
                'programming_languages': req.body.work_fields,
                'work_fields': req.body.work_fields
            },
            'jobs':[],
        });

        // check if we want to wait for respone in order to send back
        const result = await newFreelancer.save();

        if (result) {
            res.json(result)
        } else {
            res.status(404).send("Error saving a restaurant");
        }
    },

    updateFreelancer(req, res) {

        //need to add process to body

        freelancer.findOneAndUpdate({ id: req.params }, req.body, { new: true })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error updating freelancer from db: ${err}`))
    },

    deleteFreelancer(req, res) {
        freelancer.deleteOne({ id: req.params.id })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error deleting freelancer from db: ${err}`));
    },

}
