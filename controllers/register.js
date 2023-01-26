const handleRegister = (req, res, knex, bcrypt) => {
    
    const saltRounds = 10;
    const { email, password, name } = req.body

    if(!email || !name || !password){     //validation
       return res.status(400).json('incorrect form submission')
    }

    bcrypt.hash(password, saltRounds, function(err, hash) {
        knex.transaction(trx => {   //creating a transaction so that if one table post fails, they all fail.
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email') 
            .then(loginEmail => {
                trx('users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0].email,
                    joined: new Date()
                })
                .then(user => {
                    return res.json(user[0]) //users[0] because .returning returns an array ob objects but we want to send the front end an object.           
                 })
              })
              .then(trx.commit)
              .catch(trx.rollback);
       })
       .catch( err => {res.status(400).json(err + 'unable to register')})
    })
}

module.exports = {
    handleRegister: handleRegister
};