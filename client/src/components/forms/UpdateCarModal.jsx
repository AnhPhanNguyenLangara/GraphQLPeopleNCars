import {EditOutlined} from "@ant-design/icons";
import {useMutation} from "@apollo/client";
import {Button, Form, Input, Modal, Select} from "antd";
import {GET_PEOPLE, UPDATE_CAR} from "../../graphql/queries.js";
import {useEffect, useState} from "react";

export default function UpdateCarModal({ownerId,peopleList,car}) {

    const { id, make, model, year, price } = car


    const [form] = Form.useForm()
    const [, forceUpdate] = useState()
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [updateCar , {data,loading,error}] = useMutation(UPDATE_CAR)


    useEffect(() => {
        forceUpdate({})
    }, [])

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = values => {
        const confirm = window.confirm('Are you sure you want to update this car?')
        if (confirm) {
            const {year, make, model, price, personId} = values
            updateCar({
                variables: {
                    updateCarId: id,
                    year: year,
                    make: make,
                    model: model,
                    price: price,
                    personId: personId
                },
                update: (cache, {data: {updateCar}}) => {
                    // console.log(updateCar)
                    const {people} = cache.readQuery({query: GET_PEOPLE})
                    let newPeople;
                    // Simple case: same owner, modified car data
                    if (updateCar.personId===ownerId) {
                        newPeople = people.map(person => {
                            if (person.id === updateCar.personId) {
                                return {...person,ownedCars: person.ownedCars.map(car => car.id===updateCar.id? updateCar:car)}
                            }

                            else return person
                        })
                    } else {
                    //  Remove from old owner
                        const withoutOld = people.map(person => {
                            if (person.id === ownerId) {
                                return {...person,ownedCars: person.ownedCars.filter(car => car.id!==updateCar.id)}
                            }
                            else return person
                        })
                    //  Give to new owner
                        newPeople = withoutOld.map(person => {
                            if (person.id === updateCar.personId) {
                                return {...person, ownedCars: [...person.ownedCars, updateCar]}
                            }
                            else return person
                        })
                    }
                    cache.writeQuery({
                        query: GET_PEOPLE,
                        data: {people: newPeople}
                    })
                },
                optimisticResponse: {
                    __type: "Mutation",
                    updateCar: {
                        __type: "Car",
                        id: id,
                        make: make,
                        model: model,
                        price: price,
                        year: year,
                        personId: personId
                    }
                }
            })
            setIsModalOpen(false)
        }
    }


    return (
        <>
            <EditOutlined key={'edit'} onClick={showModal}></EditOutlined>
            <Modal title={`Update Car`} open={isModalOpen} onCancel={handleCancel} footer={[]}>
                <Form
                    name={`update-car-form-${id}`}
                    layout={'horizontal'}
                    size={'large'}
                    form={form}
                    onFinish={onFinish}
                    preserve={false}
                    initialValues={{
                        make:make,
                        model:model,
                        price:price,
                        year:year,
                        personId: ownerId
                    }}
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
                            // Update button always left enabled since form is prefilled
                            <Button type={'primary'} htmlType={'submit'}
                                    // disabled={!form.isFieldsTouched(true) || form.getFieldsError().filter(({errors}) => errors.length).length}
                            >
                                Update Car
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}