import {Link, useParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {GET_PERSON} from "../graphql/queries.js";
import {Card, Space, Spin} from "antd";

export default function Home() {
    const {personId} = useParams()
    const {data,loading,error} = useQuery(GET_PERSON, {variables: {personId}})

    let output;

    if (loading) {
        output = <Spin size={"large"}></Spin>
    } else if (error) {
        output = <p>ERROR</p>
    } else {
        const USDollar = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        output = (
            <Card title={<p style={{fontSize: '28px'}}>{`${data.person.firstName} ${data.person.lastName}\'s Cars`}</p>} >
                <Space direction="vertical" size={16} style={{width: '100%'}}>
                    {data.person.ownedCars.map(car => (
                        <Card key={car.id} title={`${car.year} ${car.make} ${car.model}`}>
                            <p style={{fontSize: '20px'}}>Price: {USDollar.format(parseInt(car.price))}</p>
                        </Card>
                    ))}
                </Space>
            </Card>
        )
    }
    return (
        <>
            <Link to={"/"}>Back to Home</Link>
            {output}
        </>
    )
}