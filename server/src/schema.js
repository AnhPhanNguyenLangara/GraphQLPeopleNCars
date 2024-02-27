import gql from "graphql-tag"

const typeDefs = gql`
type Person {
    id: ID!
    firstName: String!
    lastName: String!
    ownedCars: [Car!]!
}

type Car {
    id: ID!,
    year: String!,
    make: String!,
    model: String!,
    price: String!,
    personId: ID!
}

type Query {
    people: [Person!]!
    person(id: ID!): Person!
    cars: [Car!]!
}

type Mutation {
    addPerson(id: ID!, firstName: String!, lastName: String!): Person!
    updatePerson(id: ID!, firstName: String!, lastName: String!): Person!
    removePerson(id: ID!): Person!
    addCar(id: ID!,year: String!,make: String!,model: String!,price: String!,personId: ID!): Car!
    updateCar(id: ID!,year: String!,make: String!,model: String!,price: String!,personId: ID!): Car!
    removeCar(id: ID!): Car!
}
`

const resolvers = {
    Query: {
        people: () => people,
        person: (parent, args) => {
            return people.find(person => person.id === args.id)
        },
        cars: () => cars,
    },
    Mutation: {
        addPerson: (parent, args) => {
            const newPerson = {
                id: args.id,
                firstName: args.firstName,
                lastName: args.lastName
            }

            people.push(newPerson)

            return newPerson
        },
        updatePerson: (parent, args) => {
            const target = people.find(person => person.id === args.id)
            if (!target) {
                throw new Error(`Couldn\'t find person with id ${args.id}`)
            } else {
                target.firstName = args.firstName
                target.lastName = args.lastName
                return target
            }
        },
        removePerson: (parent, args) => {
            const target = people.find(person => person.id === args.id)
            if (!target) {
                throw new Error(`Couldn\'t find person with id ${args.id}`)
            } else {
                people = people.filter(person => person.id !== target.id)
                cars = cars.filter(car => car.personId !== target.id)
                return target
            }
        },
        addCar: (parent,args) => {
            // id: ID!,year: String!,make: String!,model: String!,price: String!,personId: ID!
            const newCar = {
                id: args.id,
                year: args.year,
                make: args.make,
                model: args.model,
                price: args.price,
                personId: args.personId
            }

            cars.push(newCar)

            return newCar
        },
        updateCar: (parent, args) => {
            if (!(cars.find(car => car.id === args.id))) {
                throw new Error(`Couldn\'t find car with id ${args.id}`)
            } else {
                const {id,year, make, price, model, personId} = args
                cars = cars.filter(car => car.id !== args.id)
                const newCar ={id,year,price,make,model,personId}
                cars.push(newCar)
                return newCar
            }
        },
        removeCar: (parent,args) => {
            const target = cars.find(car => car.id === args.id)
            if (!target) {
                throw new Error(`Couldn\'t find car with id ${args.id}`)
            } else {
                cars = cars.filter(car => car.id !== target.id)
                return target
            }
        }
    },
    Person: {
        ownedCars: (parent) => {
            return cars.filter(car => car.personId === parent.id)
        }
    }
}


let people = [
    {
        id: '1',
        firstName: 'Bill',
        lastName: 'Gates'
    },
    {
        id: '2',
        firstName: 'Steve',
        lastName: 'Jobs'
    },
    {
        id: '3',
        firstName: 'Linux',
        lastName: 'Torvalds'
    }
]

let cars = [
    {
        id: '1',
        year: '2019',
        make: 'Toyota',
        model: 'Corolla',
        price: '40000',
        personId: '1'
    },
    {
        id: '2',
        year: '2018',
        make: 'Lexus',
        model: 'LX 600',
        price: '13000',
        personId: '1'
    },
    {
        id: '3',
        year: '2017',
        make: 'Honda',
        model: 'Civic',
        price: '20000',
        personId: '1'
    },
    {
        id: '4',
        year: '2019',
        make: 'Acura ',
        model: 'MDX',
        price: '60000',
        personId: '2'
    },
    {
        id: '5',
        year: '2018',
        make: 'Ford',
        model: 'Focus',
        price: '35000',
        personId: '2'
    },
    {
        id: '6',
        year: '2017',
        make: 'Honda',
        model: 'Pilot',
        price: '45000',
        personId: '2'
    },
    {
        id: '7',
        year: '2019',
        make: 'Volkswagen',
        model: 'Golf',
        price: '40000',
        personId: '3'
    },
    {
        id: '8',
        year: '2018',
        make: 'Kia',
        model: 'Sorento',
        price: '45000',
        personId: '3'
    },
    {
        id: '9',
        year: '2017',
        make: 'Volvo',
        model: 'XC40',
        price: '55000',
        personId: '3'
    }
]

export {typeDefs, resolvers}
