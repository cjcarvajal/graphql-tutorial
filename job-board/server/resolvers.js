export const resolvers = {
    Query: {
        job: () => {
            return {
                id: 'test-id',
                title: 'Scientific Researcher',
                description: 'The scientific researches homolgates a CTO position, with the responsibilities\
                to define the tecnological vision of the company',
            }
        }
    },
};