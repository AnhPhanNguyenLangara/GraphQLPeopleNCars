import {DeleteOutlined} from "@ant-design/icons";
import {useMutation} from "@apollo/client";
import {DELETE_PERSON, GET_PEOPLE} from "../../graphql/queries.js";

export default function DeletePersonButton({id}) {
    const [removePerson, {data, loading, error}] = useMutation(DELETE_PERSON)
    const handleClick = () => {
        const confirm = window.confirm('Are you sure you want to delete this person?')
        if (confirm) {
            removePerson({
                variables: {
                    removePersonId: id
                },
                update: (cache, {data: {removePerson}}) => {
                    const {people} = cache.readQuery({query: GET_PEOPLE})
                    const newPeople = people.filter(person => person.id !== removePerson.id)
                    cache.writeQuery({
                        query: GET_PEOPLE,
                        data: {people: newPeople}
                    })
                }
            })
        }
    }
    return <DeleteOutlined key={'delete'} style={{color: 'red'}} onClick={handleClick}></DeleteOutlined>
}