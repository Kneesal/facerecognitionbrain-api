const hangleSignIn = (req, res, knex, bcrypt) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json('incorrect form submission');
    }
    knex
    .select('email','hash')
    .from('login')
    .where('email', '=', email)
    .then(data => { 
        if(data.length){ //returns empty array if email doesn't match DB email
            return bcrypt.compare(password, data[0].hash, (err, result) => {
                if(result){
                    knex.select('*').from('users').where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('something went wrong!'))
                }
                if(!result){
                    res.status(400).json('incorrect username or password')
                }
            })
        }
        else{
            res.status(400).json('incorrect username or password')
        }
    })
    .catch(err => res.json(err + ' cannot communicate with database')) 
}

module.exports = {
    hangleSignIn: hangleSignIn
}