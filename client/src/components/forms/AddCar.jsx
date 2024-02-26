import {v4 as uuidv4} from "uuid";
import {Button, Form, Input, Select} from "antd";
import {useEffect, useState} from "react";
import {useMutation} from "@apollo/client";
import {ADD_CAR, GET_PEOPLE} from "../../graphql/queries.js";

export default function AddCar({peopleList}) {

    // This seems buggy to me. Won't this persist the same uuid
    // across form submissions leading
    // to multiple people with the same id?
    // const [id] = useState(uuidv4())

    // Current solution is to recalculate uuid on each rerender.
    // Can be considered wasteful but at least it's safe.
    // Ideally server should do this anyway.
    const id = uuidv4()

    const [form] = Form.useForm()
    const [, forceUpdate] = useState()
    const [addCar, {data, loading, error}] = useMutation(ADD_CAR)

    useEffect(() => {
        forceUpdate({})
    }, [])

    const onFinish = values => {
        const {year, make, model, price, personId} = values
        addCar({
            variables: {
                addCarId: id,
                year: year,
                make: make,
                model: model,
                price: price,
                personId: personId
            },
            update: (cache, {data: {addCar}}) => {
                const {people} = cache.readQuery({query: GET_PEOPLE})
                const newPeople = people.map(person => {
                    if (person.id === addCar.personId) {
                        return {...person,ownedCars: [...person.ownedCars,addCar]}
                    }
                    else return person
                })
                cache.writeQuery({
                    query: GET_PEOPLE,
                    data: {people: newPeople}
                })
            }
        })
    }

    return (
        <>
            <h2 style={{textAlign: 'center'}}>Add Car</h2>
            <div style={{
                display: 'grid',
                justifyContent: 'center'
            }}>
                <Form
                    name={'add-car-form'}
                    layout={'inline'}
                    size={'large'}
                    style={{marginBottom: '40px'}}
                    form={form}
                    onFinish={onFinish}
                    preserve={false}
                >
                    <Form.Item
                        label={'Year'}
                        name={'year'}
                        rules={[{required: true, message: 'Please enter a year'}]}
                    >
                        <Input placeholder={'e.g. 1976'}></Input>
                    </Form.Item>
                    <Form.Item
                        label={'Make'}
                        name={'make'}
                        rules={[{required: true, message: 'Please enter a make'}]}
                    >
                        <Input placeholder={'e.g. Toyota'}></Input>
                    </Form.Item>
                    <Form.Item
                        label={'Model'}
                        name={'model'}
                        rules={[{required: true, message: 'Please enter a model'}]}
                    >
                        <Input placeholder={'e.g. Supra'}></Input>
                    </Form.Item>
                    <Form.Item
                        label={'Price'}
                        name={'price'}
                        rules={[{required: true, message: 'Please enter a price'}]}
                    >
                        <Input placeholder={'e.g. 40000'}></Input>
                    </Form.Item>
                    <Form.Item
                        label={'Person'}
                        name={'personId'}
                        rules={[{required: true, message: 'Please choose an owner'}]}
                    >
                        <Select
                            placeholder="Select a person"
                        >
                            {peopleList.map(person => <Select.Option key={person.id}
                                                                     value={person.id}>{person.firstName} {person.lastName}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item shouldUpdate={true}>
                        {() => (
                            <Button type={'primary'} htmlType={'submit'} loading={loading}
                                    disabled={!form.isFieldsTouched(true) || form.getFieldsError().filter(({errors}) => errors.length).length}
                            >
                                Add Car
                            </Button>
                        )}
                    </Form.Item>
                </Form>
                {error && <p>ERROR</p>}
            </div>
        </>
    )
}