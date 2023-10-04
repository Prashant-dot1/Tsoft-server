import {initServer} from "./app"

async function init(){
    const app = await initServer(); // initialize and start the graphql server , add a middleware to /graphql path
    app.listen(8000,()=> console.log(`Server is running on the port - 8000`))
}

init();