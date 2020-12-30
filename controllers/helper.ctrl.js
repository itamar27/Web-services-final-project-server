
const processBody = (data) => {
    let update = Object();
    const personal = "personal_details.";

    if (data.first_name)
        update[personal + "first_name"] = data.first_name;

    if (data.last_name)
        update[personal + "last_name"] = data.last_name;

    if (data.email)
        update[personal + "email"] = data.email;

    if (data.address)
        update[personal + "address"] = data.address;

    if (data.phone)
        update[personal + "phone"] = data.phone;

    if (data.linkedin)
        update[personal + "linkedin"] = data.linkedin;

    if (data.facebook)
        update[personal + "facebopk"] = data.facebook;

    if (data.freelancer_api_id)
        update.freelancer_api_id = data.freelancer_api_id;

    if (data.freelancer_api_username)
        update.freelancer_api_username = data.freelancer_api_username;

    if (data.jobs_id)
        update.$push = { "jobs_id": data.jobs_id };

    if(data.description)
        update.description = data.description;
    
    if(data.skills){
        update.skills = Array();
        data.skills.forEach((skill)=>{
            update.skills.push(skill);
        })
    }

    return update
}


module.exports = {processBody}