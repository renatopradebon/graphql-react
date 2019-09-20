const graphql = require('graphql');

const {
    GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList
} = graphql;

// Dummy data
var books = [
    { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
    { name: 'Two States', genre: 'Drama', id: '2', authorId: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
    { name: 'The Colour of Magic', genre: 'Fantasy', id: '4', authorId: '3' },
    { name: 'The Light Fantastic', genre: 'Fantasy', id: '5', authorId: '3' },
    { name: 'Five Point something', genre: 'Drama', id: '6', authorId: '2' },
];

var authors = [
    { name: 'Patrick Rothfuss', age: 44, id: '1' },
    { name: 'Chetan Bhagat', age: 45, id: '2' },
    { name: 'Terry Pratchett', age: 66, id: '3' }
];

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return authors.find(item => item.id === parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books.filter(obj => obj.authorId === parent.id);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //future code from database
                return books.find(item => item.id === args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //future code from database
                return authors.find(item => item.id === args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return books;
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return authors;
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: RootQuery });