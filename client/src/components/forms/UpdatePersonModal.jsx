import { EditOutlined } from "@ant-design/icons";
import {useMutation} from "@apollo/client";
import {Button, Form, Input, Modal} from "antd";
import {UPDATE_PERSON,GET_PEOPLE} from "../../graphql/queries.js";
import {useEffect, useState} from "react";


export default function UpdatePersonModal({person}) {

    const { id,firstName,lastName} = person

    const [form] = Form.useForm()
    const [, forceUpdate] = useState()
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [updatePerson , {data,loading,error}] = useMutation(UPDATE_PERSON)


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
        const confirm = window.confirm('Are you sure you want to update this person?')
        if (confirm) {
            const {firstName, lastName} = values
            updatePerson({
                variables: {
                    updatePersonId: id,
                    firstName: firstName,
                    lastName: lastName,
                },
                update: (cache, {data: {updatePerson}}) => {
                    const {people} = cache.readQuery({query: GET_PEOPLE})
                    const newPeople = people.map(person => person.id === updatePerson.id? updatePerson:person)
                    cache.writeQuery({
                        query: GET_PEOPLE,
                        data: {people: newPeople}
                    })
                },
                optimisticResponse: {
                    __type: "Mutation",
                    updatePerson: {
                        __type: "Person",
                        id: id,
                        firstName: firstName,
                        lastName: lastName,
                        ownedCars: person.ownedCars
                    }
                }
            })
            setIsModalOpen(false)
        }
    };

    return (
        <>
            <EditOutlined key={'edit'} onClick={showModal}></EditOutlined>
            <Modal title={`Update Person`} open={isModalOpen} onCancel={handleCancel} footer={[]}>
                <Form
                    name={`update-person-form-${id}`}
                    layout={'horizontal'}
                    size={'large'}
                    form={form}
                    onFinish={onFinish}
                    preserve={false}
                    initialValues={{
                        firstName,
                        lastName
                    }}
                >
                    <Form.Item
                        label={'First Name'}
                        name={'firstName'}
                        rules={[{required: true, message: 'Please enter a first name'}]}
                    >
                        <Input placeholder={'e.g. John'}></Input>
                    </Form.Item>
                    <Form.Item
                        label={'Last Name'}
                        name={'lastName'}
                        rules={[{required: true, message: 'Please enter a last name'}]}
                    >
                        <Input placeholder={'e.g. Smith'}></Input>
                    </Form.Item>
                    <Form.Item shouldUpdate={true}>
                        {() => (
                            // Update button always left enabled since form is prefilled
                            <Button type={'primary'} htmlType={'submit'}
                                    // disabled={!form.isFieldsTouched(true) || form.getFieldsError().filter(({errors}) => errors.length).length}
                            >
                                Update Person
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </>
        )
}