import {gql} from "@apollo/client";

export const GET_PEOPLE = gql`
    query GetPeople {
        people {
            id
            firstName
            lastName
            ownedCars {
                id
                make
                model
                price
                year
            }
        }
    }
`

export const GET_PERSON = gql`
    query GetPerson($personId: ID!) {
        person(id: $personId) {
            id
            firstName
            lastName
            ownedCars {
                id
                year
                make
                model
                price
            }
        }
    }
`

export const ADD_PERSON = gql`
    mutation AddPerson($addPersonId: ID!, $firstName: String!, $lastName: String!) {
        addPerson(id: $addPersonId, firstName: $firstName, lastName: $lastName) {
            id
            firstName
            lastName
            ownedCars {
                id
                year
                make
                model
                price
            }
        }
    }
`

export const DELETE_PERSON = gql`
    mutation DeletePerson($removePersonId: ID!) {
        removePerson(id: $removePersonId) {
            id
            firstName
            lastName
            ownedCars {
                id
                make
                model
                price
                year
            }
        }
    }
`

export const UPDATE_PERSON = gql`
    mutation UpdatePerson($updatePersonId: ID!, $firstName: String!, $lastName: String!) {
        updatePerson(id: $updatePersonId, firstName: $firstName, lastName: $lastName) {
            firstName
            id
            lastName
            ownedCars {
                id
                make
                model
                price
                year
            }
        }
    }
`


export const ADD_CAR = gql`
    mutation AddCar($addCarId: ID!, $year: String!, $make: String!, $model: String!, $price: String!, $personId: ID!) {
        addCar(id: $addCarId, year: $year, make: $make, model: $model, price: $price, personId: $personId) {
            id
            make
            model
            personId
            price
            year
        }
    }`

export const DELETE_CAR = gql`
    mutation RemoveCar($removeCarId: ID!) {
        removeCar(id: $removeCarId) {
            id
            make
            model
            price
            year
            personId
        }
    }`

export const UPDATE_CAR= gql`
    mutation UpdateCar($updateCarId: ID!, $year: String!, $make: String!, $model: String!, $price: String!, $personId: ID!) {
        updateCar(id: $updateCarId, year: $year, make: $make, model: $model, price: $price, personId: $personId) {
            id
            make
            model
            price
            year
            personId
        }
    }
`