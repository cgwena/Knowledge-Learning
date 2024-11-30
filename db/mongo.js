const mongoose= require('mongoose')


const clientOptions = {
    useNewUrlParser: true,
    dbname: 'Knowledge-Learning'
}

exports.clientDbInitCommection = async() => {
    try {
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('connected')
    } catch (e) {
        console.log(e)
        throw e
    }
}