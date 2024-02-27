import './App.css'
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import Home from "./routes/Home.jsx"
import Details from "./routes/Details.jsx"
import {Routes, Route} from "react-router-dom";
import Title from "./components/layouts/Title.jsx";

const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache()
})

function App() {

    return (
        <ApolloProvider client={client}>
            <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                <Title>
                </Title>
                <Routes>
                    <Route path={'/'} element={<Home/>}></Route>
                    <Route path={'/people/:personId'} element={<Details/>}></Route>
                </Routes>
            </div>
        </ApolloProvider>
    )
}

export default App
