const handleProfile = (req,res, knex) => {
    const { id } = req.params;
    knex.select('*').from('users').join('login','users.email', '=', 'login.email').where('users.id', '=', id)
    .then(user => {
        if(user.length){
            res.json(user[0])
        } else {
            res.status(400).json('not found')
        }
    })
    .catch(err=>{res.status(400).json('error getting user '+err)})
}

module.exports = {
    handleProfile: handleProfile
}