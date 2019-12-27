const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Event{
    _id: ID,
    title: String!,
    decription: String!,
    price: Float!,
    date: String!,
    creator: User!            
}

input EventInput
{
    _id: ID,
    title: String!,
    decription: String!,
    price: Float!,
    date: String           
}

input UserInput{
    email: String!,
    password: String!
}

type User{
    _id: ID,
    email : String!,
    password: String,
    createdEvents: [Event!]
}
  
type Query{
    events: [Event!]!
}

type Mutation{
    createEvent(eventInput: EventInput ): Event
    createUser(userInput: UserInput): User
}

`);
