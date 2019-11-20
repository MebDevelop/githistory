import React from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {Container, ListGroup} from 'react-bootstrap'
import Loading from '../Loading';
import ErrorMessage from '../Error';

const GET_COMMIT_HISTORY = gql`
{
    repository(name: "githistory", owner: "MebDevelop") {
      ref(qualifiedName: "master") {
        target {
          ... on Commit {
            id
            history(first:100) {
              pageInfo {
                hasNextPage
              }
              edges {
                node {
                  messageHeadline
                  oid
                  message
                  author {
                    name
                    email
                    date
                  }
                }
              }
            }
          }
        }
      }
    }
}  
`;

function History() {
    return (
        <Query
            query={GET_COMMIT_HISTORY}
            notifyOnNetworkStatusChange={true}
        >
            {({ data, loading, error, fetchMore }) => {
                console.log(data)
                if (loading && !data) {
                    return <Loading isCenter={true} />;
                }
            
                if (error) {
                    return <ErrorMessage error={error} />;
                }
                const edges = data.repository.ref.target.history.edges;
                return (
                    <Container>
                        <ListGroup variant="flush">
                            {
                                edges.map((each, i) => { 
                                    return (
                                        <ListGroup.Item key = {i}>{each.node.message}</ListGroup.Item>
                                    )
                                })
                            }
                        </ListGroup>
                    </Container>
                )
            }}
        </Query>
    )
}

export default History;