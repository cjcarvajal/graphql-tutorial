export const resolvers = {
    Query: {
        jobs: () => {
            return [
                {
                    id: 'test-id1',
                    title: 'Scientific Researcher',
                    description: 'The scientific researches homolgates a CTO position, with the responsibilities\
                to define the tecnological vision of the company',
                },
                {
                    id: 'test-id2',
                    title: 'Chief Finantial Officier',
                    description: 'In charge of all company budget',
                }
            ];
        }
    },
};