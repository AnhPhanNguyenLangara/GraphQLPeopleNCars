import {useQuery} from "@apollo/client";
import {GET_PEOPLE} from "../../graphql/queries.js";
import {Card, Space, Spin} from "antd";
import {Cars} from "./Cars.jsx";
import {Link} from "react-router-dom";
import AddCar from "../forms/AddCar.jsx";
import DeletePersonButton from "../forms/DeletePersonButton.jsx";
import UpdatePersonModal from "../forms/UpdatePersonModal.jsx";

export default function People() {
    const {data, loading, error} = useQuery(GET_PEOPLE)

    let output;

    if (loading) {
        output = <Spin size={"large"}></Spin>
    } else if (error) {
        output = <p>ERROR</p>
    } else {
        const peopleList = data.people.map(({id, firstName, lastName,}) => ({id, firstName, lastName}))
        const peopleCards = data.people.length > 0 ? data.people.map(person => (
                <Card key={person.id} title={`${person.firstName} ${person.lastName}`} actions={
                    [<UpdatePersonModal person={person}></UpdatePersonModal>, <DeletePersonButton id={person.id}/>]
                }>
                    <Cars ownerId={person.id} cars={person.ownedCars} peopleList={peopleList}></Cars>
                    <Link to={`/people/${person.id}`}>
                        Learn More
                    </Link>
                </Card>)) :
            <p style={{fontSize: '32px', fontWeight: 'bold', textAlign: 'center'}}>Start adding some
                People Please!</p>
        output = (
            <>
                <AddCar peopleList={peopleList}></AddCar>
                <h2 style={{textAlign: 'center'}}>Records</h2>
                <Space direction="vertical" size={16}>
                    {peopleCards}
                </Space>
            </>
        )
    }
    return (
        <>
            {output}
        </>
    )
}

