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

type Booking{
     _id: ID
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
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

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}
  
type Query{
    events: [Event!]!
    bookings: [Booking!]! 
    login(email: String!, password: String!): AuthData  
}


type Mutation{
    createEvent(eventInput: EventInput ): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}
`);
