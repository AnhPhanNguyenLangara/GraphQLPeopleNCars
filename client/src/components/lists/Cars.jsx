import {Card, Space} from "antd";
import DeleteCarButton from "../forms/DeleteCarButton.jsx";
import UpdateCarModal from "../forms/UpdateCarModal.jsx";

export function Cars({ownerId,cars,peopleList}) {
    const USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const carCards = cars.map(carData => {
        const carTitle = `${carData.year} ${carData.make} ${carData.model} -> ${USDollar.format(parseInt(carData.price))}`
        return <Card key={carData.id} title={carTitle} actions={
            [<UpdateCarModal ownerId={ownerId} car={carData} peopleList={peopleList}></UpdateCarModal>,<DeleteCarButton id={carData.id}></DeleteCarButton>]
        }></Card>
    })

    return (
        <Space direction="vertical" size={16} style={{width: '100%'}}>
            {carCards}
        </Space>
    )
}