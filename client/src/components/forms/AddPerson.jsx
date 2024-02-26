import {useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {Button, Form, Input} from "antd";
import {useMutation} from "@apollo/client";
import {ADD_PERSON, GET_PEOPLE} from "../../graphql/queries.js";

export default function AddPerson() {

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
    const [addPerson, {data, loading, error}] = useMutation(ADD_PERSON)

    useEffect(() => {
        forceUpdate({})
    }, [])

    const onFinish = values => {
        const {firstName, lastName} = values
        addPerson({
            variables: {
                addPersonId: id,
                firstName: firstName,
                lastName: lastName,
            },
            update: (cache, {data: {addPerson}}) => {
                const {people} = cache.readQuery({query: GET_PEOPLE})
                cache.writeQuery({
                    query: GET_PEOPLE,
                    data: {people: [...people, addPerson]}
                })
            },
            optimisticResponse: {
                __type: "Mutation",
                addPerson: {
                    __type: "Person",
                    id: id,
                    firstName: firstName,
                    lastName: lastName,
                    ownedCars: []
                }
            }
        })
    }

    return (
        <>
            <h2 style={{textAlign: 'center'}}>Add Person</h2>
            <div style={{
                display: 'grid',
                justifyContent: 'center'
            }}>
                <Form
                    name={'add-person-form'}
                    layout={'inline'}
                    size={'large'}
                    style={{marginBottom: '40px'}}
                    form={form}
                    onFinish={onFinish}
                    preserve={false}
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
                            <Button type={'primary'} htmlType={'submit'}
                                    disabled={!form.isFieldsTouched(true) || form.getFieldsError().filter(({errors}) => errors.length).length}
                            >
                                Add Person
                            </Button>
                        )}
                    </Form.Item>
                </Form>
                {error && <p>ERROR</p>}
            </div>
        </>
    )
}