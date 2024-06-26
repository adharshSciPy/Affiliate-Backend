import connectDb from './mongodb/index.js'
import { app } from './app.js'

//--------db connection and server running--------
connectDb().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running ⚙️ at port : ${process.env.PORT}`);
    })
})
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })