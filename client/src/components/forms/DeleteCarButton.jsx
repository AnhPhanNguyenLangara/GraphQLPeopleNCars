import {DeleteOutlined} from "@ant-design/icons";
import {useMutation} from "@apollo/client";
import {DELETE_CAR, GET_PEOPLE} from "../../graphql/queries.js";


export default function DeleteCarButton({id}) {
    const [removeCar, {data, loading, error}] = useMutation(DELETE_CAR)
    const handleClick = () => {
        const confirm = window.confirm('Are you sure you want to delete this car?')
        if (confirm) {
            removeCar({
                variables: {
                    removeCarId: id
                },
                update: (cache, {data: {removeCar}}) => {
                    const {people} = cache.readQuery({query: GET_PEOPLE})
                    const newPeople = people.map(person => {
                        if (person.ownedCars.find(car => car.id === removeCar.id)) {
                            return {...person,ownedCars: person.ownedCars.filter(car => car.id!==removeCar.id)}
                        }
                        else return person
                    })
                    cache.writeQuery({
                        query: GET_PEOPLE,
                        data: {people: newPeople}
                    })
                },
                optimisticResponse: {
                    __type: "Mutation",
                    removeCar: {
                        __type: "Car",
                        id: id,
                        make: "whatever",
                        model: "whatever",
                        personId: "whatever",
                        price: "whatever",
                        year: "whatever",
                    }
                }
            })
        }
    }
    return <DeleteOutlined key={'delete'} style={{color: 'red'}} onClick={handleClick}></DeleteOutlined>
}