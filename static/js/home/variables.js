const url_data = `https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql`
const auth = `https://learn.zone01oujda.ma/api/auth/signin`


const USER = `
query {
    user {
        login
        firstName
        lastName
        campus
        email
    }
}
`

const AUDIT = `
query {
  user {
    auditRatio
    audits_aggregate(where: {closureType: {_eq: succeeded}}) {
      aggregate {
        count
      }
    }
    failed_audits: audits_aggregate(where: {closureType: {_eq: failed}}) {
      aggregate {
        count
      }
    }
  }
}
`

const TRANSACTIONS = `
query {
  transaction(
    where: {
      type: {_eq: "xp"},
      _or: [{object: {type: {_eq: "project"}}}, {object: {type: {_eq: "piscine"}}}]
    }
    order_by: {createdAt: asc}
  ) {
    amount
    createdAt
    object {
      name
    }
  }
} 
`

const SKILLS = `
query getSkillTransactions($login: String!) {
  user(where: {login: {_eq: $login}}) {
    transactions(
      where: {
        type: {_ilike: "%skill%"}
      },
      order_by: {amount: desc}
    ) {
      type
      amount
    }
  }
}`












